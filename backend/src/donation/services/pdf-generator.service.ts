import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as QRCode from 'qrcode';

const PDFDocument = require('pdfkit');

@Injectable()
export class PdfGeneratorService {
  private readonly logger = new Logger(PdfGeneratorService.name);
  private readonly publicDir = path.join(process.cwd(), 'public');
  private readonly certDir = path.join(this.publicDir, 'certificates');

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    if (!fs.existsSync(this.publicDir)) fs.mkdirSync(this.publicDir, { recursive: true });
    if (!fs.existsSync(this.certDir)) fs.mkdirSync(this.certDir, { recursive: true });
  }

  /**
   * Premium 80G Certificate PDF Generator
   * Creates a visually stunning, professional tax certificate
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
    return new Promise(async (resolve, reject) => {
      try {
        const filePath = path.join(this.certDir, `${data.certId}.pdf`);
        const doc = new PDFDocument({
          size: 'A4',
          margin: 0,
          info: {
            Title: `80G Tax Certificate - ${data.certId}`,
            Author: 'WombTo18 Foundation',
            Subject: `Donation Receipt for ${data.donorName}`,
            Keywords: '80G, Tax Certificate, Donation, WombTo18',
          },
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        const W = doc.page.width;   // 595
        const H = doc.page.height;  // 842

        // QR Code
        const verifyUrl = `${data.frontendUrl}/verify?certId=${encodeURIComponent(data.certId)}`;
        const qrBuffer = await QRCode.toBuffer(verifyUrl, {
          errorCorrectionLevel: 'H',
          margin: 0,
          width: 140,
          color: { dark: '#1D6E3F', light: '#FFFFFF' },
        });
        //  BACKGROUND
        doc.rect(0, 0, W, H).fill('#FBF9F3');
        doc.circle(W + 30, -30, 200).fill('#1D6E3F').opacity(0.03);
        doc.opacity(1);
        doc.circle(-40, H + 40, 180).fill('#FF9900').opacity(0.03);
        doc.opacity(1);
        //  PREMIUM BORDER SYSTEM (Triple Border)
        
        // Outer border - forest green
        doc.lineWidth(3).rect(18, 18, W - 36, H - 36).stroke('#1D6E3F');
        
        // Middle border - gold/saffron  
        doc.lineWidth(1.5).rect(24, 24, W - 48, H - 48).stroke('#D4A953');
        
        // Inner border - thin green
        doc.lineWidth(0.5).rect(30, 30, W - 60, H - 60).stroke('#1D6E3F');

        // Corner ornaments (small squares at each corner)
        const corners = [
          { x: 18, y: 18 }, { x: W - 28, y: 18 },
          { x: 18, y: H - 28 }, { x: W - 28, y: H - 28 },
        ];
        corners.forEach(c => {
          doc.rect(c.x, c.y, 10, 10).fill('#D4A953');
        });

        // ═══════════════════════════════════════════════════
        //  TOP GREEN RIBBON / HEADER BAR
        // ═══════════════════════════════════════════════════
        
        doc.rect(30, 30, W - 60, 90).fill('#1D6E3F');
        
        // Gold accent line under ribbon
        doc.rect(30, 120, W - 60, 3).fill('#D4A953');

        // Header text on ribbon
        doc.font('Helvetica-Bold').fontSize(24).fillColor('#FFFFFF');
        doc.text('WOMBTO18 FOUNDATION', 50, 48, { align: 'center', width: W - 100 });
        
        doc.font('Helvetica').fontSize(9).fillColor('#B8D8C8');
        doc.text('REGISTERED CHARITABLE TRUST  •  BUILDING A BETTER TOMORROW', 50, 80, { 
          align: 'center', width: W - 100 
        });

        //  CERTIFICATE TYPE BADGE
        
        // Centered badge background
        const badgeW = 280;
        const badgeX = (W - badgeW) / 2;
        const badgeY = 138;

        doc.roundedRect(badgeX, badgeY, badgeW, 36, 4).fill('#FFF7E6').stroke('#D4A953');
        doc.font('Helvetica-Bold').fontSize(13).fillColor('#8B6914');
        doc.text('DONATION RECEIPT & 80G CERTIFICATE', badgeX, badgeY + 11, { 
          align: 'center', width: badgeW 
        });

        //  REFERENCE LINE

        const formattedDate = data.date.toLocaleDateString('en-IN', {
          day: '2-digit', month: 'long', year: 'numeric',
        });

        const refY = 195;
        doc.font('Helvetica').fontSize(9).fillColor('#888888');
        doc.text(`Receipt No: ${data.receiptNumber}`, 55, refY);
        doc.text(`Date: ${formattedDate}`, 55, refY, { align: 'right', width: W - 110 });

        // Thin divider
        doc.moveTo(55, refY + 18).lineTo(W - 55, refY + 18).lineWidth(0.5).stroke('#E0DDD5');

        //  MAIN BODY — "TO WHOMSOEVER IT MAY CONCERN"

        let y = 235;

        doc.font('Helvetica-Bold').fontSize(11).fillColor('#1D6E3F');
        doc.text('TO WHOMSOEVER IT MAY CONCERN', 55, y, { align: 'center', width: W - 110 });
        y += 35;

        doc.font('Helvetica').fontSize(11).fillColor('#333333').lineGap(6);
        doc.text('This is to certify that the following donation has been received by ', 55, y, {
          width: W - 110, continued: true,
        });
        doc.font('Helvetica-Bold').fillColor('#1D6E3F').text('WombTo18 Foundation', {
          continued: true,
        });
        doc.font('Helvetica').fillColor('#333333').text(' and is eligible for tax exemption under Section 80G of the Income Tax Act, 1961.');
        y = doc.y + 20;

        //  DONOR DETAILS TABLE

        const tableX = 55;
        const tableW = W - 110;
        const col1W = 160;
        const col2W = tableW - col1W;
        const rowH = 36;

        // Table header
        doc.rect(tableX, y, tableW, rowH).fill('#1D6E3F');
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF');
        doc.text('PARTICULARS', tableX + 15, y + 12, { width: col1W });
        doc.text('DETAILS', tableX + col1W + 15, y + 12, { width: col2W });
        y += rowH;

        // Table rows
        const rows = [
          ['Donor Name', data.donorName.toUpperCase()],
          ['PAN Number', data.donorPan && data.donorPan !== 'N/A' ? data.donorPan : '—'],
          ['Donation Amount', `₹ ${data.amount.toLocaleString('en-IN')}  (INR ${this.numberToWords(data.amount)} Only)`],
          ['Date of Donation', formattedDate],
          ['Mode of Payment', 'Online (Razorpay Gateway)'],
          ['Purpose', 'Support of WombTo18 Foundation Programs'],
        ];

        rows.forEach((row, i) => {
          const bgColor = i % 2 === 0 ? '#FFFFFF' : '#F8F6F0';
          doc.rect(tableX, y, tableW, rowH).fill(bgColor).stroke('#E8E5DD');
          
          doc.font('Helvetica-Bold').fontSize(9).fillColor('#666666');
          doc.text(row[0], tableX + 15, y + 12, { width: col1W - 20 });
          
          doc.font('Helvetica-Bold').fontSize(10).fillColor('#222222');
          doc.text(row[1], tableX + col1W + 15, y + 12, { width: col2W - 30 });
          y += rowH;
        });

        // Table bottom border
        doc.rect(tableX, y - 1, tableW, 2).fill('#D4A953');
        y += 20;

        //  80G LEGAL TEXT

        // Green info box
        doc.roundedRect(55, y, W - 110, 72, 6).fill('#F0FAF4').stroke('#C8E6D8');
        
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#1D6E3F');
        doc.text('80G TAX EXEMPTION DETAILS', 70, y + 10, { width: W - 140 });
        
        doc.font('Helvetica').fontSize(8).fillColor('#4A7A5E').lineGap(3);
        doc.text('Registration Number: CIT(E)/xxxx/80G/202x-xx', 70, y + 26, { width: W - 140 });
        doc.text('PAN of Trust: XXXXXXXXX', 70, doc.y, { width: W - 140 });
        doc.text('Validity: Applicable for the relevant Assessment Year as per Income Tax Act, 1961.', 70, doc.y, { width: W - 140 });
        
        y += 90;
        
        const bottomY = H - 170;

        // QR Code section (left)
        doc.roundedRect(50, bottomY, 118, 118, 6).lineWidth(1).stroke('#E0DDD5');
        doc.image(qrBuffer, 55, bottomY + 5, { width: 108 });
        
        doc.font('Helvetica').fontSize(7).fillColor('#999999');
        doc.text('Scan to verify', 50, bottomY + 120, { width: 118, align: 'center' });

        // Certificate ID (center)
        doc.font('Helvetica').fontSize(8).fillColor('#AAAAAA');
        doc.text('Certificate ID', 190, bottomY + 20, { width: 210, align: 'center' });
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#1D6E3F');
        doc.text(data.certId, 190, bottomY + 35, { width: 210, align: 'center' });

        // Verification note
        doc.font('Helvetica').fontSize(7).fillColor('#AAAAAA').lineGap(2);
        doc.text('This certificate can be verified by scanning', 190, bottomY + 60, { width: 210, align: 'center' });
        doc.text('the QR code or visiting:', 190, doc.y, { width: 210, align: 'center' });
        doc.font('Helvetica-Bold').fontSize(7).fillColor('#1D6E3F');
        doc.text(`${data.frontendUrl}/verify`, 190, doc.y, { width: 210, align: 'center' });

        // Authorized signatory (right)
        doc.moveTo(W - 180, bottomY + 80).lineTo(W - 60, bottomY + 80).lineWidth(0.5).stroke('#333333');
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#333333');
        doc.text('Authorized Signatory', W - 185, bottomY + 88, { width: 130, align: 'center' });
        doc.font('Helvetica').fontSize(8).fillColor('#666666');
        doc.text('WombTo18 Foundation', W - 185, bottomY + 102, { width: 130, align: 'center' });

        //  FOOTER BAR
        doc.rect(30, H - 48, W - 60, 18).fill('#1D6E3F');
        doc.font('Helvetica').fontSize(7).fillColor('#B8D8C8');
        doc.text(
          'This is a computer-generated document. No signature is required.  |  For queries: support@wombto18.org',
          50, H - 44, { align: 'center', width: W - 100 }
        );

        doc.end();

        stream.on('finish', () => {
          this.logger.log(`Generated premium 80G certificate: ${data.certId}`);
          resolve(`/public/certificates/${data.certId}.pdf`);
        });

        stream.on('error', (err) => {
          this.logger.error(`PDF stream error: ${err.message}`);
          reject(err);
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.error(`PDF generation error: ${message}`);
        reject(err);
      }
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
