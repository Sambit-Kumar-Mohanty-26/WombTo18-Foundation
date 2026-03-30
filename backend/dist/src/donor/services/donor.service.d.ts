import { PrismaService } from '../../prisma/services/prisma.service';
export declare class DonorService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboard(identifier: string): Promise<{
        donor: {
            name: string;
            donorId: string;
            tier: string;
            totalDonated: number;
            isVolunteer: any;
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
        amount: number;
        program: string;
        date: string;
        status: string;
    }[]>;
    getLeaderboard(): Promise<{
        name: string | null;
        donorId: string;
        tier: string;
        totalDonated: number;
    }[]>;
    getRecruits(donorId: string): Promise<{
        name: string | null;
        createdAt: Date;
        donorId: string;
        email: string;
        totalDonated: number;
    }[]>;
    becomeVolunteer(donorId: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        donorId: string;
        email: string;
        mobile: string | null;
        password: string | null;
        pan: string | null;
        address: string | null;
        tier: string;
        totalDonated: number;
        otpHash: string | null;
        otpExpiry: Date | null;
        isEligible: boolean;
        isVolunteer: boolean;
        isNonDonor: boolean;
        referredById: string | null;
    }>;
}
