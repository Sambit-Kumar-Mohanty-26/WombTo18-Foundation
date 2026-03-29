import { DonorService } from '../services/donor.service';
export declare class DonorController {
    private readonly donorService;
    constructor(donorService: DonorService);
    getDashboard(donorId: string): Promise<{
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
    getDonations(donorId: string): Promise<{
        amount: number;
        program: string;
        date: string;
        status: string;
    }[]>;
}
