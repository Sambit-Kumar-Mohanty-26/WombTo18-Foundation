"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
const PDFDocument = require("pdfkit");
let CertificateService = class CertificateService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateReceipt(donationId, res) {
        const donation = await this.prisma.donation.findUnique({
            where: { id: donationId },
            include: { donor: true, program: true },
        });
        if (!donation)
            throw new common_1.NotFoundException('Donation not found');
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        doc.fillColor('#1a365d').fontSize(24).text('TEAM ORION NGO', { align: 'center' });
        doc.fontSize(10).fillColor('#4a5568').text('Empowering children through health and education', { align: 'center' });
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
    async generate80GCertificate(donationId, res) {
        const donation = await this.prisma.donation.findUnique({
            where: { id: donationId },
            include: { donor: true },
        });
        if (!donation || donation.amount < 5000) {
            throw new common_1.BadRequestException('Donation not eligible for 80G certificate');
        }
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
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
        doc.fontSize(12).fillColor('#4a5568').text(`This is to certify that ${donation.donor.name || 'the donor'} has donated a sum of INR ${donation.amount.toLocaleString()} to Team Orion NGO.`);
        doc.text(`The donation is eligible for deduction under section 80G of the Income Tax Act.`);
        doc.moveDown(2);
        doc.text('Organization PAN: ABCDE1234F');
        doc.text('80G Reg No: CIT/EXEMP/2021-22/A/12345');
        doc.moveDown(5);
        doc.text('Authorized Signatory', { align: 'right' });
        doc.text('Team Orion NGO', { align: 'right' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=80G_Certificate_${donationId}.pdf`);
        doc.pipe(res);
        doc.end();
    }
};
exports.CertificateService = CertificateService;
exports.CertificateService = CertificateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificateService);
//# sourceMappingURL=certificate.service.js.map