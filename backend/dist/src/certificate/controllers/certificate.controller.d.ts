import { CertificateService } from '../services/certificate.service';
import type { Response } from 'express';
export declare class CertificateController {
    private readonly certificateService;
    constructor(certificateService: CertificateService);
    receipt(donationId: string, res: Response): Promise<void>;
    tax80g(donationId: string, res: Response): Promise<void>;
    downloadCert(certId: string, res: Response): Promise<void>;
    volunteerCert(volunteerId: string, res: Response): Promise<void>;
    campCert(volunteerId: string, campId: string, res: Response): Promise<void>;
    partnerCert(partnerId: string, res: Response): Promise<void>;
    list(recipientType: string, userId: string): Promise<{
        id: string;
        donorId: string | null;
        createdAt: Date;
        volunteerId: string | null;
        partnerId: string | null;
        title: string;
        type: string;
        recipientName: string;
        recipientType: string;
        fileUrl: string | null;
        shareText: string | null;
        metadata: string | null;
    }[]>;
    getByDonor(donorId: string): Promise<{
        id: string;
        donorId: string | null;
        createdAt: Date;
        volunteerId: string | null;
        partnerId: string | null;
        title: string;
        type: string;
        recipientName: string;
        recipientType: string;
        fileUrl: string | null;
        shareText: string | null;
        metadata: string | null;
    }[]>;
    verify(certId: string): Promise<{
        success: boolean;
        data: any;
    }>;
}
