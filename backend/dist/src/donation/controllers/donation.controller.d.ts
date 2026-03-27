import { DonationService } from '../services/donation.service';
export declare class DonationController {
    private readonly donationService;
    constructor(donationService: DonationService);
    create(body: any): Promise<{
        orderId: any;
        amount: any;
        currency: any;
        donationId: string;
    }>;
    verify(body: any): Promise<{
        success: boolean;
        tier: import(".prisma/client").$Enums.DonorTier;
        dashboardUnlocked: boolean;
    }>;
}
