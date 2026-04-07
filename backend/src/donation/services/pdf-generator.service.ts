import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as QRCode from 'qrcode';
import { StorageService } from '../../storage/storage.service';

const PDFDocument = require('pdfkit');

@Injectable()
export class PdfGeneratorService {
  private readonly logger = new Logger(PdfGeneratorService.name);
  private readonly publicDir = path.join(process.cwd(), 'public');
  private readonly certDir = path.join(this.publicDir, 'certificates');

  constructor(private readonly storage: StorageService) {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    if (!fs.existsSync(this.publicDir)) fs.mkdirSync(this.publicDir, { recursive: true });
    if (!fs.existsSync(this.certDir)) fs.mkdirSync(this.certDir, { recursive: true });
  }

  /**
   * Universal Premium Certificate Generator
   * Supports 80G, Donation Receipts, and Volunteer Service Certificates
   */
  private async generatePremiumCertificate(params: {
    title: string;
    badgeText: string;
    recipientName: string;
    details: { label: string; value: string; bold?: boolean }[];
    date: Date;
    certId: string;
    frontendUrl: string;
    accentColor?: string;
    secondaryColor?: string;
    legalText?: { title: string; lines: string[] };
    footerNote?: string;
  }): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          title,
          badgeText,
          recipientName,
          details,
          date,
          certId,
          frontendUrl,
          accentColor = '#1D6E3F', // Forest Green
          secondaryColor = '#D4A953', // Gold
          legalText,
          footerNote = 'This is a computer-generated document. No signature is required.',
        } = params;

        const filePath = path.join(this.certDir, `${certId}.pdf`);
        const doc = new PDFDocument({
          size: 'A4',
          margin: 0,
          info: {
            Title: `${title} - ${certId}`,
            Author: 'WombTo18 Foundation',
          },
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        const W = doc.page.width;
        const H = doc.page.height;

        // QR Code
        const verifyUrl = `${frontendUrl}/verify?certId=${encodeURIComponent(certId)}`;
        const qrBuffer = await QRCode.toBuffer(verifyUrl, {
          errorCorrectionLevel: 'H',
          margin: 0,
          width: 140,
          color: { dark: accentColor, light: '#FFFFFF' },
        });

        // BACKGROUND
        doc.rect(0, 0, W, H).fill('#FBF9F3');
        doc.circle(W + 30, -30, 200).fill(accentColor).opacity(0.03);
        doc.opacity(1);
        doc.circle(-40, H + 40, 180).fill('#FF9900').opacity(0.03);
        doc.opacity(1);

        // BORDERS
        doc.lineWidth(3).rect(18, 18, W - 36, H - 36).stroke(accentColor);
        doc.lineWidth(1.5).rect(24, 24, W - 48, H - 48).stroke(secondaryColor);
        doc.lineWidth(0.5).rect(30, 30, W - 60, H - 60).stroke(accentColor);

        // Corner ornaments
        const corners = [
          { x: 18, y: 18 }, { x: W - 28, y: 18 },
          { x: 18, y: H - 28 }, { x: W - 28, y: H - 28 },
        ];
        corners.forEach(c => doc.rect(c.x, c.y, 10, 10).fill(secondaryColor));

        // HEADER RIBBON
        doc.rect(30, 30, W - 60, 90).fill(accentColor);
        doc.rect(30, 120, W - 60, 3).fill(secondaryColor);

        doc.font('Helvetica-Bold').fontSize(24).fillColor('#FFFFFF');
        doc.text('WOMBTO18 FOUNDATION', 50, 48, { align: 'center', width: W - 100 });
        
        doc.font('Helvetica').fontSize(9).fillColor('#B8D8C8');
        doc.text('REGISTERED CHARITABLE TRUST  •  BUILDING A BETTER TOMORROW', 50, 80, { 
          align: 'center', width: W - 100 
        });

        // BADGE
        const badgeW = 320;
        const badgeX = (W - badgeW) / 2;
        const badgeY = 138;
        doc.roundedRect(badgeX, badgeY, badgeW, 36, 4).fill('#FFF7E6').stroke(secondaryColor);
        doc.font('Helvetica-Bold').fontSize(12).fillColor('#8B6914');
        doc.text(badgeText, badgeX, badgeY + 11, { align: 'center', width: badgeW });

        // REFERENCE LINE
        const formattedDate = date.toLocaleDateString('en-IN', {
          day: '2-digit', month: 'long', year: 'numeric',
        });
        const refY = 195;
        doc.font('Helvetica').fontSize(9).fillColor('#888888');
        doc.text(`ID: ${certId}`, 55, refY);
        doc.text(`Date: ${formattedDate}`, 55, refY, { align: 'right', width: W - 110 });
        doc.moveTo(55, refY + 18).lineTo(W - 55, refY + 18).lineWidth(0.5).stroke('#E0DDD5');

        // MAIN BODY
        let y = 235;
        doc.font('Helvetica-Bold').fontSize(11).fillColor(accentColor);
        doc.text('TO WHOMSOEVER IT MAY CONCERN', 55, y, { align: 'center', width: W - 110 });
        y += 35;

        doc.font('Helvetica').fontSize(11).fillColor('#333333').lineGap(6);
        doc.text('This is to certify that ', 55, y, {
          width: W - 110, continued: true,
        });
        doc.font('Helvetica-Bold').fillColor(accentColor).text(recipientName.toUpperCase(), {
          continued: true,
        });
        doc.font('Helvetica').fillColor('#333333').text(` has ${title.toLowerCase().includes('donation') ? 'generously contributed to' : 'successfully participated in'} `);
        doc.font('Helvetica-Bold').fillColor(accentColor).text('WombTo18 Foundation', { continued: true });
        doc.font('Helvetica').fillColor('#333333').text(' programs.');
        y = doc.y + 20;

        // DETAILS TABLE
        const tableX = 55;
        const tableW = W - 110;
        const col1W = 160;
        const col2W = tableW - col1W;
        const rowH = 34;

        doc.rect(tableX, y, tableW, 28).fill(accentColor);
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#FFFFFF');
        doc.text('PARTICULARS', tableX + 15, y + 9, { width: col1W });
        doc.text('DETAILS', tableX + col1W + 15, y + 9, { width: col2W });
        y += 28;

        details.forEach((row, i) => {
          const bgColor = i % 2 === 0 ? '#FFFFFF' : '#F8F6F0';
          doc.rect(tableX, y, tableW, rowH).fill(bgColor).stroke('#E8E5DD');
          doc.font('Helvetica-Bold').fontSize(8).fillColor('#666666');
          doc.text(row.label, tableX + 15, y + 12, { width: col1W - 20 });
          doc.font('Helvetica-Bold').fontSize(9).fillColor('#222222');
          doc.text(row.value, tableX + col1W + 15, y + 12, { width: col2W - 30 });
          y += rowH;
        });
        doc.rect(tableX, y - 1, tableW, 2).fill(secondaryColor);
        y += 20;

        // LEGAL / INFO BOX
        if (legalText) {
          doc.roundedRect(55, y, W - 110, 65, 6).fill('#F0FAF4').stroke('#C8E6D8');
          doc.font('Helvetica-Bold').fontSize(9).fillColor(accentColor);
          doc.text(legalText.title, 70, y + 10, { width: W - 140 });
          doc.font('Helvetica').fontSize(8).fillColor('#4A7A5E').lineGap(2);
          legalText.lines.forEach((line, idx) => {
            doc.text(line, 70, doc.y, { width: W - 140 });
          });
          y += 85;
        }

        const bottomY = H - 170;
        // QR Code
        doc.roundedRect(50, bottomY, 118, 118, 6).lineWidth(1).stroke('#E0DDD5');
        doc.image(qrBuffer, 55, bottomY + 5, { width: 108 });
        doc.font('Helvetica').fontSize(7).fillColor('#999999');
        doc.text('Scan to verify', 50, bottomY + 120, { width: 118, align: 'center' });

        // Cert ID & Verif
        doc.font('Helvetica').fontSize(8).fillColor('#AAAAAA');
        doc.text('Verification ID', 190, bottomY + 20, { width: 210, align: 'center' });
        doc.font('Helvetica-Bold').fontSize(11).fillColor(accentColor);
        doc.text(certId, 190, bottomY + 35, { width: 210, align: 'center' });
        doc.font('Helvetica').fontSize(7).fillColor('#AAAAAA').lineGap(2);
        doc.text('Verify at:', 190, bottomY + 60, { width: 210, align: 'center' });
        doc.font('Helvetica-Bold').fontSize(7).fillColor(accentColor);
        doc.text(`${frontendUrl}/verify`, 190, doc.y, { width: 210, align: 'center' });

        // Signatory
        doc.moveTo(W - 180, bottomY + 80).lineTo(W - 60, bottomY + 80).lineWidth(0.5).stroke('#333333');
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#333333');
        doc.text('Authorized Signatory', W - 185, bottomY + 88, { width: 130, align: 'center' });
        doc.font('Helvetica').fontSize(8).fillColor('#666666');
        doc.text('WombTo18 Foundation', W - 185, bottomY + 102, { width: 130, align: 'center' });

        // FOOTER
        doc.rect(30, H - 48, W - 60, 18).fill(accentColor);
        doc.font('Helvetica').fontSize(7).fillColor('#B8D8C8');
        doc.text(footerNote, 50, H - 44, { align: 'center', width: W - 100 });

        doc.end();

        stream.on('finish', async () => {
          try {
            const cloudUrl = await this.storage.uploadFromPath(
              filePath,
              `certificates/${certId}.pdf`,
              'application/pdf',
            );
            resolve(cloudUrl);
          } catch (err) {
            this.logger.warn(`Cloud upload failed: ${err}`);
            resolve(`/public/certificates/${certId}.pdf`);
          }
        });
        stream.on('error', (err) => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Premium 80G Certificate PDF Generator
   */
  async generate80GCertificate(data: {
    donorName: string;
    donorPan: string;
    amount: number;
    receiptNumber: string;
    date: Date;
    certId: string;
    frontendUrl: string;
  }): Promise<string> {
    return this.generatePremiumCertificate({
      title: '80G Tax Certificate',
      badgeText: 'DONATION RECEIPT',
      recipientName: data.donorName,
      details: [
        { label: 'Donor Name', value: data.donorName.toUpperCase() },
        { label: 'PAN Number', value: data.donorPan && data.donorPan !== 'N/A' ? data.donorPan : '—' },
        { label: 'Donation Amount', value: `₹ ${data.amount.toLocaleString('en-IN')}  (INR ${this.numberToWords(data.amount)} Only)` },
        { label: 'Date of Donation', value: data.date.toLocaleDateString('en-IN') },
        { label: 'Mode of Payment', value: 'Online (Razorpay Gateway)' },
        { label: 'Purpose', value: 'Trust Objects & Charitable Programs' },
      ],
      date: data.date,
      certId: data.certId,
      frontendUrl: data.frontendUrl,
      legalText: {
        title: '80G TAX EXEMPTION DETAILS',
        lines: [
          'Registration Number: CIT(E)/xxxx/80G/202x-xx',
          'PAN of Trust: XXXXXXXXX',
          'Validity: Applicable for the relevant Assessment Year.',
        ],
      },
    });
  }

  /**
   * Premium Volunteer Service Certificate
   */
  async generateVolunteerServiceCertificate(data: {
    volunteerName: string;
    volunteerId: string;
    campName: string;
    campLocation: string;
    campDate: Date;
    creditsAwarded: number;
    certId: string;
    frontendUrl: string;
    isExcellent?: boolean;
  }): Promise<string> {
    return this.generatePremiumCertificate({
      title: 'Volunteer Service Certificate',
      badgeText: data.isExcellent ? 'CERTIFICATE OF EXCELLENCE' : 'CERTIFICATE OF VOLUNTEER SERVICE',
      recipientName: data.volunteerName,
      accentColor: data.isExcellent ? '#8B5CF6' : '#1D6E3F', // Purple for excellence, Green for service
      details: [
        { label: 'Volunteer Name', value: data.volunteerName.toUpperCase() },
        { label: 'Volunteer ID', value: data.volunteerId },
        { label: 'Impact Program', value: data.campName },
        { label: 'Location', value: data.campLocation },
        { label: 'Date of Service', value: data.campDate.toLocaleDateString('en-IN') },
        { label: 'Impact Credits Earned', value: `${data.creditsAwarded} Credits` },
      ],
      date: new Date(),
      certId: data.certId,
      frontendUrl: data.frontendUrl,
      footerNote: 'Issued with gratitude by WombTo18 Foundation Impact Team.',
    });
  }

  /** Convert number to words (Indian numbering) for certificate amounts */
  private numberToWords(num: number): string {
    if (num === 0) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
      'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convert = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };

    const intPart = Math.floor(num);
    const decPart = Math.round((num - intPart) * 100);

    let result = 'Rupees ' + convert(intPart);
    if (decPart > 0) result += ' and ' + convert(decPart) + ' Paise';
    return result;
  }
}
