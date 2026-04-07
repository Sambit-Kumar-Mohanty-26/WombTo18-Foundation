import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/services/prisma.service';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';
import { VerificationService } from '../../verification/verification.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly mailerService;
    private readonly verificationService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailerService: MailerService, verificationService: VerificationService, configService: ConfigService);
    private generateIdentityId;
    private checkLoginRateLimit;
    private checkOtpRateLimit;
    private resetOtpRateLimit;
    private validateEmail;
    private validateMobile;
    private validatePasswordStrength;
    private sanitizeInput;
    private generateOtp;
    private hashOtp;
    private verifyOtpHash;
    adminLogin(email: string, password: string): Promise<{
        success: boolean;
        token: string;
        name: string;
        role: string;
        redirect: string;
        otpSent: boolean;
    }>;
    donorLogin(identifier: string, flags?: {
        isVolunteer?: boolean;
        isNonDonor?: boolean;
        name?: string;
        mobile?: string;
        password?: string;
        referredById?: string;
    }): Promise<{
        success: boolean;
        token: string;
        name: string | null;
        donorId: string;
        volunteerId: string | undefined;
        eligible: boolean;
        isVolunteer: boolean;
        profileCompleted: boolean;
        role: string;
        redirect: string;
        otpSent: boolean;
    } | {
        devOtp?: string | undefined;
        success: boolean;
        otpSent: boolean;
        twoFactorPending: boolean;
        donorId: string;
        message: string;
        token?: undefined;
        name?: undefined;
        volunteerId?: undefined;
        eligible?: undefined;
        isVolunteer?: undefined;
        profileCompleted?: undefined;
        role?: undefined;
        redirect?: undefined;
    } | {
        success: boolean;
        token: string;
        name: string | null;
        donorId: string;
        eligible: boolean;
        isVolunteer: boolean;
        role: string;
        redirect: string;
        otpSent: boolean;
        volunteerId?: undefined;
        profileCompleted?: undefined;
    }>;
    donorRegister(data: {
        email: string;
        password: string;
        name: string;
        mobile?: string;
        isVolunteer?: boolean;
        isNonDonor?: boolean;
        referredById?: string;
    }): Promise<{
        devOtp?: string | undefined;
        devMobileOtp?: string | null | undefined;
        success: boolean;
        otpSent: boolean;
        donorId: any;
        requiresMobileOtp: boolean;
        message: string;
    }>;
    resendOtp(identifier: string): Promise<{
        devOtp?: string | undefined;
        devMobileOtp?: string | null | undefined;
        success: boolean;
        requiresMobileOtp: boolean;
        message: string;
    }>;
    verifyOtp(identifier: string, otp: string): Promise<{
        success: boolean;
        token: string;
        name: string | null;
        donorId: string;
        volunteerId: string | undefined;
        eligible: boolean;
        isVolunteer: boolean;
        profileCompleted: boolean;
        role: string;
        redirect: string;
    }>;
    verifyDualOtp(identifier: string, emailOtp: string, mobileOtp?: string): Promise<{
        success: boolean;
        token: string;
        name: any;
        donorId: any;
        volunteerId: any;
        partnerId: any;
        eligible: boolean;
        profileCompleted: boolean;
        role: "DONOR" | "VOLUNTEER" | "PARTNER";
    }>;
    requestPasswordChange(email: string): Promise<{
        devOtp?: string | undefined;
        success: boolean;
        message: string;
    }>;
    updatePassword(email: string, otp: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleTwoFactor(userId: string, enabled: boolean): Promise<{
        success: boolean;
        message: string;
    }>;
    revokeOtherSessions(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
