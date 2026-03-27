import { PrismaService } from '../../prisma/services/prisma.service';
export declare class DonationService {
    private readonly prisma;
    private razorpay;
    constructor(prisma: PrismaService);
    createOrder(data: {
        amount: number;
        currency: string;
        donorId: string;
        programId: string;
        displayName: boolean;
    }): Promise<{
        orderId: any;
        amount: any;
        currency: any;
        donationId: string;
    }>;
    verifyPayment(data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<{
        success: boolean;
        tier: import(".prisma/client").$Enums.DonorTier;
        dashboardUnlocked: boolean;
    }>;
}
