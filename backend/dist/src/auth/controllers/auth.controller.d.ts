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
        role: string;
        redirect: string;
        otpSent: boolean;
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
        role: "VOLUNTEER" | "DONOR" | "PARTNER";
    } | {
        error: string;
    }>;
}
