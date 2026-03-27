import { AuthService } from '../services/auth.service';
import type { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(email: string): Promise<{
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
    verifyOtp(email: string, otp: string, res: Response): Promise<{
        success: boolean;
        token: string;
        redirect: string;
    }>;
}
