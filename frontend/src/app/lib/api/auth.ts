import { client } from './client';

export interface LoginResponse {
  eligible: boolean;
  otpSent: boolean;
  message?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  token?: string; // JWT might be in cookie, but sometimes returned for storage
  donor?: {
    id: string;
    email: string;
    name: string;
    tier: string;
    eligible: boolean;
  };
}

export const authApi = {
  login: (email: string) => 
    client.post<LoginResponse>('/donor/login', { email }),
    
  verifyOtp: (email: string, otp: string) => 
    client.post<VerifyOtpResponse>('/donor/verify-otp', { email, otp }),
    
  logout: () => 
    client.post<{ success: boolean }>('/auth/logout'),
};
