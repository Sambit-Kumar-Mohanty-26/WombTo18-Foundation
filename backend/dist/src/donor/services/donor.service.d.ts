import { PrismaService } from '../../prisma/services/prisma.service';
export declare class DonorService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboard(identifier: string): Promise<{
        donor: {
            id: string;
            name: string;
            donorId: string;
            email: string;
            tier: string;
            totalDonated: number;
            impactScore: number;
            isVolunteer: boolean;
            showOnLeaderboard: boolean;
            volunteerId: string | null;
            volunteerCoins: number;
            mobile: string | null;
            createdAt: Date;
        };
        impact: {
            id: string;
            totalRaised: number;
            totalUtilized: number;
            childrenImpacted: number;
            schoolsReached: number;
            healthCheckups: number;
            programsSupported: number;
        } | {
            childrenImpacted: number;
            schoolsReached: number;
            healthCheckups: number;
            programsSupported: number;
        };
    }>;
    getDonations(identifier: string): Promise<{
        id: string;
        amount: number;
        program: string;
        date: string;
        status: string;
        receiptNumber: string | null;
    }[]>;
    getLeaderboard(): Promise<{
        donorId: string;
        name: string | null;
        tier: string;
        totalDonated: number;
        showOnLeaderboard: boolean;
    }[]>;
    getRecruits(donorId: string): Promise<{
        donorId: string;
        createdAt: Date;
        name: string | null;
        email: string;
        totalDonated: number;
    }[]>;
    toggleLeaderboard(donorId: string, show: boolean): Promise<{
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
    }>;
    becomeVolunteer(donorId: string): Promise<{
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
    }>;
    getProfile(identifier: string): Promise<{
        id: string;
        donorId: string;
        name: string | null;
        email: string;
        mobile: string | null;
        pan: string | null;
        address: string | null;
        tier: string;
        totalDonated: number;
        impactScore: number;
        isVolunteer: boolean;
        showOnLeaderboard: boolean;
        volunteerId: string | null;
        recentDonations: {
            id: string;
            amount: number;
            program: string;
            date: string;
        }[];
        createdAt: Date;
    }>;
    lookupByEmail(email: string): Promise<{
        donorId: string;
        name: string | null;
        email: string;
        tier: string;
        totalDonated: number;
        impactScore: number;
        isEligible: boolean;
        emailVerified: boolean;
        mobileVerified: boolean;
        donationCount: number;
        certificateCount: number;
        donations: {
            id: string;
            amount: number;
            date: string;
            receiptNumber: string | null;
        }[];
        certificates: {
            id: string;
            type: string;
            title: string;
            fileUrl: string | null;
            createdAt: Date;
        }[];
    }>;
}
