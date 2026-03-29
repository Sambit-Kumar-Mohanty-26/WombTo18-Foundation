import { DonationService } from '../services/donation.service';
export declare class DonationController {
    private readonly donationService;
    constructor(donationService: DonationService);
    create(body: any): Promise<{
        orderId: any;
        amount: any;
        currency: any;
        donationId: string;
        donorId: string;
        keyId: string;
    }>;
    verify(body: any): Promise<{
        success: boolean;
        tier: string;
        dashboardUnlocked: boolean;
    }>;
    getStats(): Promise<{
        childrenRegistered: number;
        treesPlanted: number;
        schoolsOnboarded: number;
        monthlyRaised: number;
        activePrograms: number;
        recentDonors: {
            name: string;
            amount: number;
            createdAt: Date;
        }[];
        monthlyGoal: number;
    }>;
}
