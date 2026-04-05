import { client } from './client';

export interface LoginResponse {
  success?: boolean;
  eligible?: boolean;
  otpSent?: boolean;
  authenticated?: boolean;
  token?: string;
  name?: string | null;
  donorId?: string;
  volunteerId?: string;
  role?: string;
  redirect?: string;
  isVolunteer?: boolean;
  message?: string;
  devOtp?: string;
  devMobileOtp?: string;
  requiresMobileOtp?: boolean;
}

export interface RegisterResponse {
  success?: boolean;
  otpSent?: boolean;
  donorId?: string;
  message?: string;
  devOtp?: string;
  devMobileOtp?: string;
  requiresMobileOtp?: boolean;
}

export interface VerifyOtpResponse {
  success: boolean;
  token?: string;
  name?: string;
  donorId?: string;
  volunteerId?: string;
  partnerId?: string;
  eligible?: boolean;
  role?: string;
  donor?: {
    id: string;
    email: string;
    name: string;
    tier: string;
    eligible: boolean;
  };
}

export interface ResendOtpResponse {
  success: boolean;
  message?: string;
  devOtp?: string;
  devMobileOtp?: string;
  requiresMobileOtp?: boolean;
}

export const authApi = {
  adminLogin: (email: string, password: string) =>
    client.post<LoginResponse>('/admin/login', { email, password }),

  login: (email: string, password: string) =>
    client.post<LoginResponse>('/donor/login', { email, password }),

  register: (data: {
    email: string;
    password: string;
    name: string;
    mobile?: string;
    isVolunteer?: boolean;
    isNonDonor?: boolean;
    referredById?: string;
  }) =>
    client.post<RegisterResponse>('/donor/register', data),

  verifyOtp: (email: string, otp: string) =>
    client.post<VerifyOtpResponse>('/donor/verify-otp', { email, otp }),

  verifyDualOtp: (email: string, emailOtp: string, mobileOtp?: string) =>
    client.post<VerifyOtpResponse>('/auth/verify-dual-otp', { email, emailOtp, mobileOtp }),

  resendOtp: (email: string) =>
    client.post<ResendOtpResponse>('/donor/resend-otp', { email }),

  requestPasswordChange: (email: string) =>
    client.post<{ success: boolean; message: string; devOtp?: string }>('/donor/request-password-change', { email }),

  updatePassword: (data: { email: string; otp: string; newPassword: string }) =>
    client.post<{ success: boolean; message: string }>('/donor/update-password', data),

  toggle2FA: (donorId: string, enabled: boolean) =>
    client.post<{ success: boolean; message: string }>('/donor/toggle-2fa', { donorId, enabled }),

  revokeSessions: (donorId: string) =>
    client.post<{ success: boolean; message: string }>('/auth/revoke-sessions', { donorId }),

  logout: () =>
    client.post<{ success: boolean }>('/auth/logout'),
};
