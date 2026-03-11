import { Controller, Get, Param, Res } from '@nestjs/common';
import { CertificateService } from '../services/certificate.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('Certificates & Receipts')
@Controller('api')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get('certificates/download/:id')
  @ApiOperation({ summary: 'Download 80G Tax certificate' })
  async download80G(@Param('id') id: string, @Res() res: Response) {
    return this.certificateService.generate80GCertificate(id, res);
  }

  @Get('donor/receipts/download/:id')
  @ApiOperation({ summary: 'Download donation receipt' })
  async downloadReceipt(@Param('id') id: string, @Res() res: Response) {
    return this.certificateService.generateReceipt(id, res);
  }
}
