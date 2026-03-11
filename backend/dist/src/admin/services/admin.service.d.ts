import { PrismaService } from '../../prisma/services/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllDonors(): Promise<({
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
    findAllPrograms(): Promise<{
        id: string;
        name: string;
        description: string;
        targetAmount: number;
        raisedAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createProgram(data: any): Promise<{
        id: string;
        name: string;
        description: string;
        targetAmount: number;
        raisedAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
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
}
