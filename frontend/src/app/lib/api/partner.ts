import { client } from './client';
import { LoginResponse, RegisterResponse } from './auth';

export interface PartnerStats {
  partner: {
    id: string;
    partnerId: string;
    organizationName: string;
    contactPerson: string;
    email: string;
    csrCategory: string;
    totalSponsored: number;
    status: string;
    esgRating: string;
    partnerScore: number;
    trustScore: number;
    livesImpacted: number;
  };
  stats: {
    totalSponsored: number;
    totalReferrals: number;
    referralDonations: number;
    totalImpact: number;
    conversionRate: number;
    avgYield: number;
    pendingAuth: number;
  };
  trends: {
    monthlyImpact: number[];
    labels: string[];
  };
  recentReferrals: any[];
}

export const partnerApi = {
  signup: (data: any) => 
    client.post<RegisterResponse>('/partners/signup', data),
  
  login: (email: string, password: string) => 
    client.post<LoginResponse>('/partners/login', { email, password }),

  sendEmailOtp: (email: string) => 
    client.post<{ success: boolean; hash: string; message?: string }>('/partners/signup/send-email-otp', { email }),

  sendMobileOtp: (mobile: string) => 
    client.post<{ success: boolean; hash: string; message?: string }>('/partners/signup/send-mobile-otp', { mobile }),

  verifyOtp: (type: 'email' | 'mobile', hash: string, otp: string) => 
    client.post<{ success: boolean }>('/partners/signup/verify-otp', { type, hash, otp }),

  getDashboard: (partnerId: string) => 
    client.get<PartnerStats>(`/partners/dashboard?partnerId=${partnerId}`),

  getReferrals: (partnerId: string) => 
    client.get<any[]>(`/partners/referrals/${partnerId}`),

  getCertificates: (partnerId: string) => 
    client.get<any[]>(`/partners/certificates/${partnerId}`),

  getLeaderboard: (limit = 10) =>
    client.get<any[]>(`/leaderboard/partners?limit=${limit}`),
};
