import { PrismaService } from '../../prisma/services/prisma.service';
import { PdfGeneratorService } from './pdf-generator.service';
import { CoinService } from '../../coin/services/coin.service';
export declare class DonationService {
    private readonly prisma;
    private readonly pdfGenerator;
    private readonly coinService;
    private razorpay;
    constructor(prisma: PrismaService, pdfGenerator: PdfGeneratorService, coinService: CoinService);
    private buildDonorId;
    createOrder(data: {
        amount: number;
        currency?: string;
        donorId?: string;
        programId?: string;
        programName?: string;
        displayName?: boolean;
        donorType?: string;
        email?: string;
        name?: string;
        mobile?: string;
        pan?: string;
        address?: string;
        organizationName?: string;
        contactPerson?: string;
        schoolName?: string;
        notes?: string;
        referralCode?: string;
    }): Promise<{
        orderId: any;
        amount: any;
        currency: any;
        donationId: string;
        donorId: string;
        keyId: string;
    }>;
    verifyPayment(data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<{
        success: boolean;
        tier: string;
        dashboardUnlocked: boolean;
        certificateUrl: string | null;
        certId: string | null;
        donationId: string;
        donorId: string | null;
        email: string | null;
        userExists?: undefined;
        isVolunteer?: undefined;
    } | {
        success: boolean;
        tier: string;
        dashboardUnlocked: boolean;
        certificateUrl: string | null;
        certId: string | null;
        donationId: string;
        donorId: string;
        email: string;
        userExists: boolean;
        isVolunteer: boolean;
    }>;
    getSidebarStats(): Promise<{
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
    getWallOfFame(filter: string): Promise<any[]>;
}
