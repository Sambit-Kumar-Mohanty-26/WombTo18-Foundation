import { PrismaService } from '../../prisma/services/prisma.service';
import type { Response } from 'express';
export declare class DemoController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDemoPage(res: Response): void;
    donateDummy(body: any): Promise<{
        success: boolean;
        donationId: string;
    }>;
}
