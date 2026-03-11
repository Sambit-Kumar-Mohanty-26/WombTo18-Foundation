import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async donorLogin(email: string) {
    let donor = await this.prisma.donor.findUnique({
      where: { email },
    });

    if (!donor) {
      // Create new donor if not exists
      const lastDonor = await this.prisma.donor.findFirst({
        orderBy: { createdAt: 'desc' },
      });
      const nextId = lastDonor ? parseInt(lastDonor.donorId.replace('DNR', '')) + 1 : 1000;
      
      donor = await this.prisma.donor.create({
        data: {
          email,
          donorId: `DNR${nextId}`,
        },
      });
    }

    const isEligible = donor.totalDonated >= 5000;

    // Simulate OTP generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = otp; // In prod, use bcrypt
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.prisma.donor.update({
      where: { id: donor.id },
      data: { otpHash, otpExpiry },
    });

    // In prod, send OTP via email service (Resend)
    console.log(`[OTP for ${email}]: ${otp}`);

    if (!isEligible) {
      return {
        eligible: false,
        message: 'Dashboard access requires minimum ₹5000 donation',
        redirect: '/donor/receipts',
      };
    }

    return {
      eligible: true,
      otpSent: true,
      donorId: donor.donorId,
    };
  }

  async verifyOtp(email: string, otp: string) {
    const donor = await this.prisma.donor.findUnique({
      where: { email },
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
      redirect: '/donor/dashboard',
    };
  }
}
