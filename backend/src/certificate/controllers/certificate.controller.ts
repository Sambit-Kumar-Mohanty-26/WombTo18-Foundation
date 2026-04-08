import { Controller, Get, Param, Res, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CertificateService } from '../services/certificate.service';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

import { StorageService } from '../../storage/storage.service';

@ApiTags('Certificates')
@Controller('certificates')
export class CertificateController {
  constructor(
    private readonly certificateService: CertificateService,
    private readonly storageService: StorageService,
  ) {}

  @Get('receipt/:donationId')
  @ApiOperation({ summary: 'Generate donation receipt PDF' })
  async receipt(@Param('donationId') donationId: string, @Res() res: Response) {
    return this.certificateService.generateReceipt(donationId, res);
  }

  @Get('80g/:donationId')
  @ApiOperation({ summary: 'Generate 80G tax certificate PDF' })
  async tax80g(@Param('donationId') donationId: string, @Res() res: Response) {
    return this.certificateService.generate80GCertificate(donationId, res);
  }

  @Get('download/:certId')
  @ApiOperation({ summary: 'Download a previously generated certificate PDF' })
  async downloadCert(@Param('certId') certId: string, @Res() res: Response) {
    // First check if the certificate record has a cloud URL
    // If it starts with http, redirect to the cloud URL
    const cert = await this.certificateService.findCertRecord(certId);
    if (cert?.fileUrl && cert.fileUrl.startsWith('http')) {
      const pathPart = this.extractStoragePath(cert.fileUrl);
      if (pathPart) {
        const file = await this.storageService.download(pathPart);
        if (file) {
          res.setHeader('Content-Type', file.contentType || 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=${certId}.pdf`);
          return res.send(file.data);
        }
      }

      const response = await axios.get(cert.fileUrl, { responseType: 'arraybuffer' });
      res.setHeader('Content-Type', response.headers['content-type'] || 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${certId}.pdf`);
      return res.send(Buffer.from(response.data));
    }

    // Try to serve the pre-generated PDF file from disk (local dev)
    const certDir = path.join(process.cwd(), 'public', 'certificates');
    const filePath = path.join(certDir, `${certId}.pdf`);

    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${certId}.pdf`);
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      return;
    }

    // If the file doesn't exist on disk, try to find the Certificate record and regenerate
    return this.certificateService.downloadOrRegenerate(certId, res);
  }

  @Get('volunteer/:volunteerId')
  @ApiOperation({ summary: 'Generate volunteer appreciation certificate' })
  async volunteerCert(@Param('volunteerId') volunteerId: string, @Res() res: Response) {
    return this.certificateService.generateVolunteerCertificate(volunteerId, res);
  }

  @Get('camp/:volunteerId/:campId')
  @ApiOperation({ summary: 'Generate camp participation certificate' })
  async campCert(
    @Param('volunteerId') volunteerId: string,
    @Param('campId') campId: string,
    @Res() res: Response,
  ) {
    const url = await this.certificateService.generateAutomatedCampCertificate(volunteerId, campId);

    if (url.startsWith('http')) {
      const pathPart = this.extractStoragePath(url);
      if (pathPart) {
        const file = await this.storageService.download(pathPart);
        if (file) {
          res.setHeader('Content-Type', file.contentType || 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=certificate_${campId}.pdf`);
          return res.send(file.data);
        }
      }

      const response = await axios.get(url, { responseType: 'arraybuffer' });
      res.setHeader('Content-Type', response.headers['content-type'] || 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=certificate_${campId}.pdf`);
      return res.send(Buffer.from(response.data));
    }

    const filePath = path.join(process.cwd(), url);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=certificate_${campId}.pdf`);
      return fs.createReadStream(filePath).pipe(res);
    }

    throw new NotFoundException('Certificate file not found');
  }

  @Get('partner/:partnerId')
  @ApiOperation({ summary: 'Generate partner CSR certificate' })
  async partnerCert(@Param('partnerId') partnerId: string, @Res() res: Response) {
    return this.certificateService.generatePartnerCertificate(partnerId, res);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all certificates for a user' })
  async list(
    @Query('recipientType') recipientType: string,
    @Query('userId') userId: string,
  ) {
    return this.certificateService.getCertificates(recipientType, userId);
  }

  @Get('by-donor/:donorId')
  @ApiOperation({ summary: 'Get all certificates for a donor by donorId string (e.g. DNR123456)' })
  async getByDonor(@Param('donorId') donorId: string) {
    return this.certificateService.getCertificatesByDonorId(donorId);
  }

  @Get('verify/:certId')
  @ApiOperation({ summary: 'Verify a certificate by its printed visual ID' })
  async verify(@Param('certId') certId: string) {
    return this.certificateService.verifyCertificate(certId);
  }

  @Get('zip')
  @ApiOperation({ summary: 'Download all certificates as a ZIP archive' })
  async downloadZip(
    @Query('recipientType') recipientType: string,
    @Query('userId') userId: string,
    @Res() res: Response,
  ) {
    return this.certificateService.generateZip(recipientType, userId, res);
  }

  private extractStoragePath(fileUrl: string) {
    const marker = '/public/uploads/';
    const idx = fileUrl.indexOf(marker);
    if (idx === -1) return null;
    return fileUrl.slice(idx + marker.length);
  }
}
