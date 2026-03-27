import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/services/prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    donorLogin(email: string): Promise<{
        eligible: boolean;
        message: string;
        redirect: string;
        otpSent?: undefined;
        donorId?: undefined;
    } | {
        eligible: boolean;
        otpSent: boolean;
        donorId: string;
        message?: undefined;
        redirect?: undefined;
    }>;
    verifyOtp(email: string, otp: string): Promise<{
        success: boolean;
        token: string;
        redirect: string;
    }>;
}
