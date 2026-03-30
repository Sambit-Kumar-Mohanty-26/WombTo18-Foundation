import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/services/prisma.service';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly mailerService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailerService: MailerService, configService: ConfigService);
    donorLogin(identifier: string, flags?: {
        isVolunteer?: boolean;
        isNonDonor?: boolean;
        name?: string;
        mobile?: string;
        password?: string;
        referredById?: string;
    }): Promise<{
        authenticated: boolean;
        eligible: boolean;
        token: string;
        name: string | null;
        donorId: string;
        role: string;
        message: string;
    } | {
        devOtp?: string | undefined;
        eligible: boolean;
        otpSent: boolean;
        message: string;
        redirect: string;
        authenticated?: undefined;
        token?: undefined;
        name?: undefined;
        donorId?: undefined;
        role?: undefined;
    } | {
        devOtp?: string | undefined;
        eligible: boolean;
        otpSent: boolean;
        donorId: string;
        authenticated?: undefined;
        token?: undefined;
        name?: undefined;
        role?: undefined;
        message?: undefined;
    }>;
    verifyOtp(identifier: string, otp: string): Promise<{
        success: boolean;
        token: string;
        name: string | null;
        donorId: string;
        eligible: boolean;
        isVolunteer: boolean;
        redirect: string;
    }>;
}
