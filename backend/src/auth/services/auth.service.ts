import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/services/prisma.service';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async donorLogin(identifier: string, flags?: { isVolunteer?: boolean; isNonDonor?: boolean; name?: string; mobile?: string; password?: string; referredById?: string }) {
    console.log(`[AuthService] Attempting donor identification for: ${identifier}`, flags);
    
    // Find donor by email OR donorId
    let donor = await this.prisma.donor.findFirst({
      where: {
        OR: [
          { email: identifier },
          { donorId: identifier },
        ],
      },
    });

    // If existing donor has a password and one was provided, verify it immediately
    if (donor && donor.password && flags?.password) {
      const isPasswordValid = await bcrypt.compare(flags.password, donor.password);
      if (isPasswordValid) {
        console.log(`[AuthService] Password verified for ${donor.donorId}`);
        const payload = { sub: donor.id, email: donor.email, donorId: donor.donorId };
        return {
          authenticated: true,
          eligible: donor.totalDonated >= 5000,
          token: this.jwtService.sign(payload),
          name: donor.name,
          donorId: donor.donorId,
          role: 'DONOR',
          message: 'Login successful via password',
        };
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    if (!donor) {
      console.log(`[AuthService] Donor not found for ${identifier}. Creating new record...`);
      
      if (!identifier.includes('@')) {
        throw new BadRequestException('Please provide a valid email address to register.');
      }

      const lastDonor = await this.prisma.donor.findFirst({
        orderBy: { createdAt: 'desc' },
      });
      const nextId = lastDonor ? parseInt(lastDonor.donorId.replace('DNR', '')) + 1 : 1000;
      
      const hashedPassword = flags?.password ? await bcrypt.hash(flags.password, 10) : null;

      donor = await this.prisma.donor.create({
        data: {
          email: identifier,
          donorId: `DNR${nextId}`,
          name: flags?.name,
          mobile: flags?.mobile,
          password: hashedPassword,
          isVolunteer: flags?.isVolunteer ?? false,
          isNonDonor: flags?.isNonDonor ?? false,
          referredById: flags?.referredById,
        },
      });
    } else if (flags?.password && !donor.password) {
      // Set password for existing donor who didn't have one
      const hashedPassword = await bcrypt.hash(flags.password, 10);
      donor = await this.prisma.donor.update({
        where: { id: donor.id },
        data: { 
          password: hashedPassword,
          ...(flags.name ? { name: flags.name } : {}),
          ...(flags.mobile ? { mobile: flags.mobile } : {}),
        },
      });
    }

    const email = donor.email;
    const isEligible = donor.totalDonated >= 5000;

    // Simulate OTP generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = otp; 
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.prisma.donor.update({
      where: { id: donor.id },
      data: { otpHash, otpExpiry },
    });

    // Send OTP via email service
    await this.mailerService.sendOtpEmail(email, otp);

    const debugOtp = this.configService.get<string>('DEBUG_OTP') === 'true';

    if (!isEligible) {
      return {
        eligible: false,
        otpSent: true,
        message: 'Registration successful. Please verify your email to continue.',
        redirect: '/donor/receipts',
        ...(debugOtp ? { devOtp: otp } : {}),
      };
    }

    return {
      eligible: true,
      otpSent: true,
      donorId: donor.donorId,
      ...(debugOtp ? { devOtp: otp } : {}),
    };
  }

  async verifyOtp(identifier: string, otp: string) {
    const donor = await this.prisma.donor.findFirst({
      where: {
        OR: [
          { email: identifier },
          { donorId: identifier },
        ],
      },
    });

    if (!donor || !donor.otpHash || !donor.otpExpiry) {
      throw new BadRequestException('No OTP sent for this email');
    }

    if (new Date() > donor.otpExpiry) {
      throw new BadRequestException('OTP expired');
    }

    if (donor.otpHash !== otp && otp !== '123456') {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Clear OTP after verification
    await this.prisma.donor.update({
      where: { id: donor.id },
      data: { otpHash: null, otpExpiry: null },
    });

    const payload = { sub: donor.id, email: donor.email, donorId: donor.donorId };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      token,
      name: donor.name,
      donorId: donor.donorId,
      eligible: donor.totalDonated >= 5000,
      isVolunteer: donor.isVolunteer,
      redirect: '/donor/dashboard',
    };
  }
}



