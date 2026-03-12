import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import PDFDocument = require('pdfkit');
import type { Response } from 'express';

@Injectable()
export class CertificateService {
  constructor(private readonly prisma: PrismaService) {}

  async generateReceipt(donationId: string, res: Response) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: { donor: true, program: true },
    });

    if (!donation) throw new NotFoundException('Donation not found');

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Design
    doc.fillColor('#1a365d').fontSize(24).text('WOMBTO18 FOUNDATION', { align: 'center' });
    doc.fontSize(10).fillColor('#4a5568').text('Empowering lives', { align: 'center' });
    doc.moveDown(2);

    doc.rect(50, 110, 500, 2).fill('#3182ce');
    doc.moveDown(2);

    doc.fillColor('#2d3748').fontSize(16).text('DONATION RECEIPT', { align: 'center', underline: true });
    doc.moveDown(2);

    doc.fontSize(12).fillColor('#4a5568');
    doc.text(`Receipt Number: ${donation.receiptNumber || 'WTF' + donation.id.slice(-6).toUpperCase()}`);
    doc.text(`Date: ${donation.createdAt.toDateString()}`);
    doc.moveDown();

    doc.text(`Received with thanks from:`, { continued: true }).fillColor('#2d3748').text(` ${donation.donor.name || 'Anonymous'}`);
    doc.fillColor('#4a5568').text(`Amount: `, { continued: true }).fillColor('#2d3748').text(`INR ${donation.amount.toLocaleString()}`);
    doc.fillColor('#4a5568').text(`Purpose: `, { continued: true }).fillColor('#2d3748').text(`Support for ${donation.program.name}`);
    doc.moveDown(2);

    doc.fontSize(10).fillColor('#718096').text('This is a computer-generated receipt and does not require a physical signature.', { align: 'center', italic: true });
    
    doc.moveDown(4);
    doc.fillColor('#1a365d').fontSize(12).text('Thank you for your generous contribution!', { align: 'center' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${donationId}.pdf`);
    
    doc.pipe(res);
    doc.end();
  }

  async generate80GCertificate(donationId: string, res: Response) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: { donor: true },
    });

    if (!donation || donation.amount < 5000) {
      throw new BadRequestException('Donation not eligible for 80G certificate');
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // 80G Layout
    doc.fillColor('#1a365d').fontSize(26).text('80G TAX CERTIFICATE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).fillColor('#4a5568').text('Issued under section 80G of the Income Tax Act, 1961', { align: 'center' });
    doc.moveDown(3);

    doc.rect(50, 150, 500, 1).fill('#cbd5e0');
    doc.moveDown(2);

    doc.fillColor('#2d3748').fontSize(14);
    doc.text(`Certificate ID: 80G-${donation.id.slice(-8).toUpperCase()}`);
    doc.text(`Financial Year: 2025-26`);
    doc.moveDown();

    doc.fontSize(12).fillColor('#4a5568').text(`This is to certify that ${donation.donor.name || 'the donor'} has donated a sum of INR ${donation.amount.toLocaleString()} to Wombto18 Foundation.`);
    
    doc.moveDown(1);
    if (donation.donor.pan) doc.text(`Donor PAN: ${donation.donor.pan}`);
    if (donation.donor.address) doc.text(`Donor Address: ${donation.donor.address}`);
    doc.moveDown(1);

    doc.text(`The donation is eligible for deduction under section 80G of the Income Tax Act.`);
    doc.moveDown(2);

    doc.text('Organization PAN: ABCDE1234F');
    doc.text('80G Reg No: CIT/EXEMP/2021-22/A/12345');
    
    doc.moveDown(5);
    doc.text('Authorized Signatory', { align: 'right' });
    doc.text('Wombto18 Foundation', { align: 'right' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=80G_Certificate_${donationId}.pdf`);
    
    doc.pipe(res);
    doc.end();
  }
}
