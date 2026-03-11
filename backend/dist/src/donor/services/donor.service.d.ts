import { PrismaService } from '../../prisma/services/prisma.service';
export declare class DonorService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboard(donorId: string): Promise<{
        donor: {
            name: string;
            donorId: string;
            tier: import(".prisma/client").$Enums.DonorTier;
            totalDonated: number;
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
    getDonations(donorId: string): Promise<{
        amount: number;
        program: string;
        date: string;
        status: import(".prisma/client").$Enums.DonationStatus;
    }[]>;
}
