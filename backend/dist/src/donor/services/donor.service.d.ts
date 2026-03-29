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
}
