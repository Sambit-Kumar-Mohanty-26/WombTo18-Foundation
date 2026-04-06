import { AuthService } from '../services/auth.service';
import type { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    adminLogin(email: string, password: string, res: Response): Promise<{
        success: boolean;
        token: string;
        name: string;
        role: string;
        redirect: string;
        otpSent: boolean;
    } | {
        error: string;
    }>;
    login(email: string, password: string, res: Response): Promise<{
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
    } | {
        error: string;
    } | {
        role: string;
        redirect: string;
        success: boolean;
        token: string;
        name: string;
        otpSent: boolean;
        error?: undefined;
    }>;
    register(email: string, password: string, name: string, mobile?: string, isVolunteer?: boolean, isNonDonor?: boolean, referredById?: string): Promise<{
        devOtp?: string | undefined;
        devMobileOtp?: string | null | undefined;
        success: boolean;
        otpSent: boolean;
        donorId: any;
        requiresMobileOtp: boolean;
        message: string;
    } | {
        error: string;
    }>;
    verifyOtp(email: string, otp: string, res: Response): Promise<{
        success: boolean;
        token: string;
        name: string | null;
        donorId: string;
        volunteerId: string | undefined;
        eligible: boolean;
        isVolunteer: boolean;
        role: string;
        redirect: string;
    } | {
        error: string;
    }>;
    resendOtp(email: string): Promise<{
        devOtp?: string | undefined;
        devMobileOtp?: string | null | undefined;
        success: boolean;
        requiresMobileOtp: boolean;
        message: string;
    } | {
        error: string;
    }>;
    verifyDualOtp(email: string, emailOtp: string, mobileOtp: string | undefined, res: Response): Promise<{
        success: boolean;
        token: string;
        name: any;
        donorId: any;
        volunteerId: any;
        partnerId: any;
        eligible: boolean;
        profileCompleted: boolean;
        role: "VOLUNTEER" | "DONOR" | "PARTNER";
    } | {
        error: string;
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
    toggle2FA(donorId: string, enabled: boolean): Promise<{
        success: boolean;
        message: string;
    }>;
    revokeSessions(donorId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
