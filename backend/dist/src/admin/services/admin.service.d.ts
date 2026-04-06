import { PrismaService } from '../../prisma/services/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllDonors(): Promise<{
        id: string;
        name: string;
        email: string;
        totalAmount: string;
        category: string;
        lastDonation: string;
    }[]>;
    private timeAgo;
    findAllPrograms(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        targetAmount: number;
        raisedAmount: number;
    }[]>;
    createProgram(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        targetAmount: number;
        raisedAmount: number;
    }>;
    getStats(range?: string): Promise<{
        totalDonations: number;
        totalDonors: number;
        totalPrograms: number;
        recentDonations: ({
            donor: {
                id: string;
                donorId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                email: string;
                mobile: string | null;
                password: string | null;
                pan: string | null;
                address: string | null;
                tier: string;
                totalDonated: number;
                otpHash: string | null;
                otpExpiry: Date | null;
                emailOtpHash: string | null;
                mobileOtpHash: string | null;
                emailVerified: boolean;
                mobileVerified: boolean;
                isEligible: boolean;
                isVolunteer: boolean;
                isNonDonor: boolean;
                showOnLeaderboard: boolean;
                profileImage: string | null;
                referredById: string | null;
                twoFactorEnabled: boolean;
                tokenVersion: number;
            };
            program: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string;
                targetAmount: number;
                raisedAmount: number;
            };
        } & {
            id: string;
            amount: number;
            currency: string;
            status: string;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            donorId: string;
            programId: string;
            displayName: boolean;
            receiptNumber: string | null;
            referralCode: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        chartData: any[];
        mappingStats: {
            oneTime: number;
            recurring: number;
        };
    }>;
    private getStartDate;
    private aggregateChartData;
    private getMappingStats;
}
