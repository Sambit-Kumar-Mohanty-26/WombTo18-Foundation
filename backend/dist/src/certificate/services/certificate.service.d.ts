import { PrismaService } from '../../prisma/services/prisma.service';
import type { Response } from 'express';
export declare class CertificateService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    generateReceipt(donationId: string, res: Response): Promise<void>;
    generate80GCertificate(donationId: string, res: Response): Promise<void>;
}
