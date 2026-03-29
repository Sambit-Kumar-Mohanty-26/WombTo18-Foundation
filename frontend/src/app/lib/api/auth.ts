import { client } from './client';

export interface LoginResponse {
  eligible?: boolean;
  otpSent?: boolean;
  authenticated?: boolean;   // true when password login succeeded immediately
  token?: string;            // JWT returned on password login
  name?: string | null;
  donorId?: string;
  message?: string;
  devOtp?: string;
}


export interface VerifyOtpResponse {
  success: boolean;
  token?: string;
  name?: string;
  donorId?: string;
  donor?: {
    id: string;
    email: string;
    name: string;
    tier: string;
    eligible: boolean;
  };
}

export const authApi = {
  login: (email: string, flags?: { isVolunteer?: boolean; isNonDonor?: boolean; name?: string; mobile?: string; password?: string }) => 
    client.post<LoginResponse>('/donor/login', { email, ...flags }),
    
  verifyOtp: (email: string, otp: string) => 
    client.post<VerifyOtpResponse>('/donor/verify-otp', { email, otp }),
    
  logout: () => 
    client.post<{ success: boolean }>('/auth/logout'),
};
