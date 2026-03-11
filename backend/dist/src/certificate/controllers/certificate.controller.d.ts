import { CertificateService } from '../services/certificate.service';
import type { Response } from 'express';
export declare class CertificateController {
    private readonly certificateService;
    constructor(certificateService: CertificateService);
    download80G(id: string, res: Response): Promise<void>;
    downloadReceipt(id: string, res: Response): Promise<void>;
}
