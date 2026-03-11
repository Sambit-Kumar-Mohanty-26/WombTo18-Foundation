import { client } from './client';

export interface DonorDashboard {
  metrics: {
    totalDonated: number;
    impactScore: number;
    livesTouched: number;
    programsSupported: number;
  };
  tier: 'DONOR' | 'PATRON' | 'CHAMPION';
  donor: {
    name: string;
    email: string;
    joinedDate: string;
  };
}

export interface DonorDonation {
  id: string;
  amount: number;
  program: string;
  date: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  razorpayPaymentId?: string;
}

export const donorApi = {
  getDashboard: () => 
    client.get<DonorDashboard>('/donors/dashboard'),
    
  getDonations: () => 
    client.get<DonorDonation[]>('/donors/donations'),
};
