import { AdminService } from '../services/admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDonors(): Promise<({
        donations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            donorId: string;
            status: import(".prisma/client").$Enums.DonationStatus;
            amount: number;
            currency: string;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            programId: string;
            displayName: boolean;
            receiptNumber: string | null;
        }[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        donorId: string;
        email: string;
        mobile: string | null;
        tier: import(".prisma/client").$Enums.DonorTier;
        totalDonated: number;
        otpHash: string | null;
        otpExpiry: Date | null;
        isEligible: boolean;
    })[]>;
    getStats(): Promise<{
        totalDonations: number;
        totalDonors: number;
        totalPrograms: number;
        recentDonations: ({
            program: {
                id: string;
                name: string;
                description: string;
                targetAmount: number;
                raisedAmount: number;
                createdAt: Date;
                updatedAt: Date;
            };
            donor: {
                id: string;
                name: string | null;
                createdAt: Date;
                updatedAt: Date;
                donorId: string;
                email: string;
                mobile: string | null;
                tier: import(".prisma/client").$Enums.DonorTier;
                totalDonated: number;
                otpHash: string | null;
                otpExpiry: Date | null;
                isEligible: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            donorId: string;
            status: import(".prisma/client").$Enums.DonationStatus;
            amount: number;
            currency: string;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            programId: string;
            displayName: boolean;
            receiptNumber: string | null;
        })[];
    }>;
    getPrograms(): Promise<{
        id: string;
        name: string;
        description: string;
        targetAmount: number;
        raisedAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createProgram(body: any): Promise<{
        id: string;
        name: string;
        description: string;
        targetAmount: number;
        raisedAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    postReport(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
