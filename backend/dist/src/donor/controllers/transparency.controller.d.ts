import { PrismaService } from '../../prisma/services/prisma.service';
export declare class TransparencyController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTransparency(): Promise<{
        id: string;
        totalRaised: number;
        totalUtilized: number;
        childrenImpacted: number;
        schoolsReached: number;
        healthCheckups: number;
        programsSupported: number;
    } | {
        totalRaised: number;
        totalUtilized: number;
        programs: never[];
        expenses: never[];
    }>;
    getReports(donationId: string): Promise<{
        reportNumber: number;
        title: string;
        description: string;
        metrics: {
            childrenServed: number;
        };
    }[]>;
}
