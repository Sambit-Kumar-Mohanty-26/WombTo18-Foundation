import { PrismaService } from '../../prisma/services/prisma.service';
import type { Response } from 'express';
export declare class CertificateService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private buildCertificateHTML;
    private htmlToPdf;
    generateReceipt(donationId: string, res: Response): Promise<void>;
    generate80GCertificate(donationId: string, res: Response): Promise<void>;
    generateVolunteerCertificate(volunteerId: string, res: Response): Promise<void>;
    generateCampCertificate(volunteerId: string, campId: string, res: Response): Promise<void>;
    generatePartnerCertificate(partnerId: string, res: Response): Promise<void>;
    getCertificates(recipientType: string, userId: string): Promise<{
        id: string;
        type: string;
        title: string;
        recipientName: string;
        recipientType: string;
        donorId: string | null;
        volunteerId: string | null;
        partnerId: string | null;
        fileUrl: string | null;
        shareText: string | null;
        metadata: string | null;
        createdAt: Date;
    }[]>;
    verifyCertificate(certId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    downloadOrRegenerate(certId: string, res: Response): Promise<void>;
    getCertificatesByDonorId(donorId: string): Promise<{
        id: string;
        type: string;
        title: string;
        recipientName: string;
        recipientType: string;
        donorId: string | null;
        volunteerId: string | null;
        partnerId: string | null;
        fileUrl: string | null;
        shareText: string | null;
        metadata: string | null;
        createdAt: Date;
    }[]>;
}
