import { AuthService } from '../services/auth.service';
import type { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(email: string, password?: string, isVolunteer?: boolean, isNonDonor?: boolean, name?: string, mobile?: string): Promise<{
        authenticated: boolean;
        eligible: boolean;
        token: string;
        name: string | null;
        donorId: string;
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
    } | {
        devOtp?: string | undefined;
        eligible: boolean;
        otpSent: boolean;
        donorId: string;
        authenticated?: undefined;
        token?: undefined;
        name?: undefined;
        message?: undefined;
    }>;
    verifyOtp(email: string, otp: string, res: Response): Promise<{
        success: boolean;
        token: string;
        name: string | null;
        donorId: string;
        eligible: boolean;
        redirect: string;
    }>;
}
