"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
const pdf_generator_service_1 = require("../../donation/services/pdf-generator.service");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
let CertificateService = class CertificateService {
    prisma;
    pdfGenerator;
    constructor(prisma, pdfGenerator) {
        this.prisma = prisma;
        this.pdfGenerator = pdfGenerator;
    }
    buildCertificateHTML(data) {
        const accent = data.accentColor || '#1D6E3F';
        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1100px; height: 780px; font-family: 'Poppins', sans-serif; background: #FFFDF7; overflow: hidden; }
    .cert { position: relative; width: 100%; height: 100%; padding: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .border { position: absolute; inset: 20px; border: 3px solid ${accent}30; border-radius: 24px; }
    .border-inner { position: absolute; inset: 28px; border: 1px solid ${accent}18; border-radius: 20px; }
    .corner { position: absolute; width: 80px; height: 80px; }
    .corner-tl { top: 20px; left: 20px; border-top: 4px solid ${accent}; border-left: 4px solid ${accent}; border-radius: 24px 0 0 0; }
    .corner-tr { top: 20px; right: 20px; border-top: 4px solid ${accent}; border-right: 4px solid ${accent}; border-radius: 0 24px 0 0; }
    .corner-bl { bottom: 20px; left: 20px; border-bottom: 4px solid ${accent}; border-left: 4px solid ${accent}; border-radius: 0 0 0 24px; }
    .corner-br { bottom: 20px; right: 20px; border-bottom: 4px solid ${accent}; border-right: 4px solid ${accent}; border-radius: 0 0 24px 0; }
    .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12; }
    .orb1 { width: 400px; height: 400px; background: ${accent}; top: -100px; right: -100px; }
    .orb2 { width: 300px; height: 300px; background: #F59E0B; bottom: -50px; left: -50px; }
    .logo-section { text-align: center; margin-bottom: 12px; z-index: 10; }
    .logo-text { font-size: 28px; font-weight: 900; color: #1a1a1a; letter-spacing: -1px; }
    .logo-text span:nth-child(1) { color: #1D6E3F; }
    .logo-text span:nth-child(2) { color: #F59E0B; }
    .logo-text span:nth-child(3) { color: #00AEEF; }
    .type-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 4px; color: ${accent}; background: ${accent}10; padding: 6px 24px; border-radius: 100px; margin: 8px 0 20px; display: inline-block; }
    .title { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 800; color: #1a1a1a; text-align: center; line-height: 1.1; z-index: 10; }
    .subtitle { font-size: 14px; color: #666; margin-top: 4px; z-index: 10; text-align: center; }
    .recipient { font-size: 36px; font-weight: 900; background: linear-gradient(135deg, ${accent}, ${accent}CC); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 16px 0; z-index: 10; text-align: center; }
    .details { text-align: center; z-index: 10; margin: 12px 0; }
    .details p { font-size: 13px; color: #555; line-height: 1.8; }
    .details strong { color: #1a1a1a; font-weight: 700; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; width: 100%; max-width: 800px; margin-top: auto; z-index: 10; padding-top: 20px; }
    .sig { text-align: center; }
    .sig-line { width: 160px; height: 1px; background: #ccc; margin-bottom: 8px; }
    .sig-name { font-size: 11px; font-weight: 700; color: #333; }
    .sig-title { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 2px; }
    .cert-id { font-size: 9px; color: #bbb; text-align: center; margin-top: 12px; z-index: 10; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="cert">
    <div class="orb orb1"></div>
    <div class="orb orb2"></div>
    <div class="border"></div>
    <div class="border-inner"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    
    <div class="logo-section">
      <div class="logo-text"><span>Womb</span><span>To</span><span>18</span> Foundation</div>
    </div>
    <div class="type-tag">${data.type}</div>
    <div class="title">${data.title}</div>
    ${data.subtitle ? `<div class="subtitle">${data.subtitle}</div>` : ''}
    <div class="recipient">${data.recipientName}</div>
    <div class="details">
      ${data.details.map(d => `<p>${d}</p>`).join('\n      ')}
    </div>
    <div class="footer">
      <div class="sig">
        <div class="sig-line"></div>
        <div class="sig-name">Date: ${data.dateStr}</div>
        <div class="sig-title">Issue Date</div>
      </div>
      <div class="sig">
        <div class="sig-line"></div>
        <div class="sig-name">WombTo18 Foundation</div>
        <div class="sig-title">Authorized Signatory</div>
      </div>
    </div>
    <div class="cert-id">Certificate ID: ${data.certId}</div>
  </div>
</body>
</html>`;
    }
    async htmlToPdf(html, res, filename) {
        let browser;
        try {
            const puppeteer = require('puppeteer');
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdf = await page.pdf({
                width: '1100px',
                height: '780px',
                printBackground: true,
                landscape: true,
            });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.end(pdf);
        }
        catch (e) {
            console.error('Puppeteer PDF error, falling back to basic PDF:', e);
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
        }
        finally {
            if (browser)
                await browser.close();
        }
    }
    async generateReceipt(donationId, res) {
        const donation = await this.prisma.donation.findUnique({
            where: { id: donationId },
            include: { donor: true, program: true },
        });
        if (!donation)
            throw new common_1.NotFoundException('Donation not found');
        const html = this.buildCertificateHTML({
            type: 'Donation Receipt',
            title: 'Certificate of Donation',
            subtitle: 'In recognition of your generous contribution',
            recipientName: donation.donor.name || 'Anonymous Donor',
            details: [
                `Receipt Number: <strong>${donation.receiptNumber || 'WTF-' + donation.id.slice(-6).toUpperCase()}</strong>`,
                `Amount: <strong>₹${donation.amount.toLocaleString('en-IN')}</strong> • Program: <strong>${donation.program.name}</strong>`,
                `Date: <strong>${donation.createdAt.toDateString()}</strong>`,
            ],
            dateStr: donation.createdAt.toLocaleDateString('en-IN'),
            certId: `DON-${donation.id.slice(-8).toUpperCase()}`,
            accentColor: '#1D6E3F',
        });
        await this.htmlToPdf(html, res, `receipt_${donationId}.pdf`);
        await this.prisma.certificate.create({
            data: {
                type: 'DONATION_RECEIPT',
                title: 'Donation Receipt',
                recipientName: donation.donor.name || 'Anonymous Donor',
                recipientType: 'DONOR',
                donorId: donation.donorId,
                shareText: `I just contributed ₹${donation.amount.toLocaleString('en-IN')} to ${donation.program.name} via @WombTo18Foundation! 🌟 Every contribution counts. #WombTo18 #GiveBack`,
                metadata: JSON.stringify({ amount: donation.amount, program: donation.program.name }),
            },
        });
    }
    async generate80GCertificate(donationId, res) {
        const donation = await this.prisma.donation.findUnique({
            where: { id: donationId },
            include: { donor: true },
        });
        if (!donation || donation.amount < 5000) {
            throw new common_1.BadRequestException('Donation not eligible for 80G certificate (minimum ₹5,000)');
        }
        const html = this.buildCertificateHTML({
            type: 'Tax Exemption Certificate',
            title: 'Certificate of Tax Exemption',
            subtitle: 'Issued under Section 80G of the Income Tax Act, 1961',
            recipientName: donation.donor.name || 'Donor',
            details: [
                `Certificate ID: <strong>80G-${donation.id.slice(-8).toUpperCase()}</strong> • Financial Year: <strong>2025-26</strong>`,
                `Donation Amount: <strong>₹${donation.amount.toLocaleString('en-IN')}</strong>`,
                donation.donor.pan ? `Donor PAN: <strong>${donation.donor.pan}</strong>` : '',
                `Organization PAN: <strong>ABCDE1234F</strong> • 80G Reg: <strong>CIT/EXEMP/2021-22/A/12345</strong>`,
            ].filter(Boolean),
            dateStr: donation.createdAt.toLocaleDateString('en-IN'),
            certId: `80G-${donation.id.slice(-8).toUpperCase()}`,
            accentColor: '#1a365d',
        });
        await this.htmlToPdf(html, res, `80G_Certificate_${donationId}.pdf`);
    }
    async generateVolunteerCertificate(volunteerId, res) {
        const volunteer = await this.prisma.volunteer.findFirst({
            where: { OR: [{ volunteerId }, { email: volunteerId }] },
            include: {
                campParticipations: true,
                referrals: true,
            },
        });
        if (!volunteer)
            throw new common_1.NotFoundException('Volunteer not found');
        const html = this.buildCertificateHTML({
            type: 'Volunteer Appreciation',
            title: 'Certificate of Volunteership',
            subtitle: 'In recognition of outstanding service and dedication',
            recipientName: volunteer.name,
            details: [
                `Volunteer ID: <strong>${volunteer.volunteerId}</strong>`,
                `Total Coins Earned: <strong>${volunteer.totalCoins}</strong> • Camps Attended: <strong>${volunteer.campParticipations.length}</strong>`,
                `People Referred: <strong>${volunteer.referrals.length}</strong>`,
                `"Your selfless contributions have made a measurable difference in countless lives."`,
            ],
            dateStr: new Date().toLocaleDateString('en-IN'),
            certId: `VOL-${volunteer.id.slice(-8).toUpperCase()}`,
            accentColor: '#D97706',
        });
        await this.htmlToPdf(html, res, `volunteer_cert_${volunteerId}.pdf`);
        await this.prisma.certificate.create({
            data: {
                type: 'VOLUNTEER',
                title: 'Volunteer Appreciation Certificate',
                recipientName: volunteer.name,
                recipientType: 'VOLUNTEER',
                volunteerId: volunteer.id,
                shareText: `I'm a proud volunteer at @WombTo18Foundation! 💛 ${volunteer.totalCoins} coins earned, ${volunteer.campParticipations.length} camps attended. #WombTo18 #Volunteer`,
            },
        });
    }
    async generateAutomatedCampCertificate(volunteerId, campId) {
        const participation = await this.prisma.campParticipation.findUnique({
            where: { campId_volunteerId: { campId, volunteerId } },
            include: { camp: true, volunteer: true },
        });
        if (!participation)
            throw new common_1.NotFoundException('Participation record not found');
        const certId = `CAMP-${participation.id.slice(-8).toUpperCase()}`;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const fileUrl = await this.pdfGenerator.generateVolunteerServiceCertificate({
            volunteerName: participation.volunteer.name,
            volunteerId: participation.volunteer.volunteerId,
            campName: participation.camp.name,
            campLocation: participation.camp.location,
            campDate: participation.camp.date,
            creditsAwarded: participation.coinsAwarded || 100,
            certId,
            frontendUrl,
            isExcellent: participation.participationType === 'ACTIVE',
        });
        await this.prisma.certificate.upsert({
            where: { id: certId },
            update: { fileUrl },
            create: {
                id: certId,
                type: 'CAMP',
                title: participation.participationType === 'ACTIVE' ? 'Certificate of Excellence' : 'Certificate of Service',
                recipientName: participation.volunteer.name,
                recipientType: 'VOLUNTEER',
                volunteerId: participation.volunteer.id,
                fileUrl,
                metadata: JSON.stringify({
                    campId,
                    campName: participation.camp.name,
                    credits: participation.coinsAwarded
                }),
            },
        });
        return fileUrl;
    }
    async generateCampCertificate(volunteerId, campId, res) {
        const url = await this.generateAutomatedCampCertificate(volunteerId, campId);
        if (url.startsWith('http')) {
            return res.redirect(url);
        }
        const filePath = path.join(process.cwd(), url);
        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=certificate_${campId}.pdf`);
            return fs.createReadStream(filePath).pipe(res);
        }
        throw new common_1.NotFoundException('Certificate file not found');
    }
    async generatePartnerCertificate(partnerId, res) {
        const partner = await this.prisma.partner.findFirst({
            where: { OR: [{ partnerId }, { email: partnerId }] },
            include: { referrals: true },
        });
        if (!partner)
            throw new common_1.NotFoundException('Partner not found');
        const html = this.buildCertificateHTML({
            type: 'CSR Partnership',
            title: 'Certificate of CSR Partnership',
            subtitle: 'In recognition of corporate social responsibility',
            recipientName: partner.organizationName,
            details: [
                `Partner ID: <strong>${partner.partnerId}</strong> • Contact: <strong>${partner.contactPerson}</strong>`,
                `Total Sponsored: <strong>₹${partner.totalSponsored.toLocaleString('en-IN')}</strong>`,
                `CSR Focus: <strong>${partner.csrCategory || 'General'}</strong>`,
                `People Referred: <strong>${partner.referrals.length}</strong>`,
            ],
            dateStr: new Date().toLocaleDateString('en-IN'),
            certId: `PTR-${partner.id.slice(-8).toUpperCase()}`,
            accentColor: '#00AEEF',
        });
        await this.htmlToPdf(html, res, `partner_cert_${partnerId}.pdf`);
        await this.prisma.certificate.create({
            data: {
                type: 'PARTNER',
                title: 'CSR Partnership Certificate',
                recipientName: partner.organizationName,
                recipientType: 'PARTNER',
                partnerId: partner.id,
                shareText: `${partner.organizationName} is proud to partner with @WombTo18Foundation for impactful CSR initiatives! 🌍 #CSR #WombTo18 #Impact`,
            },
        });
    }
    async getCertificates(typeStr, userIdOrDisplayId) {
        const type = typeStr.toUpperCase();
        let internalId = userIdOrDisplayId;
        let crossId = null;
        if (type === 'VOLUNTEER') {
            const vol = await this.prisma.volunteer.findFirst({
                where: { OR: [{ volunteerId: userIdOrDisplayId }, { email: userIdOrDisplayId }, { id: userIdOrDisplayId }] },
            });
            if (vol) {
                internalId = vol.id;
                crossId = vol.donorId;
            }
        }
        else if (type === 'DONOR') {
            const donor = await this.prisma.donor.findFirst({
                where: { OR: [{ donorId: userIdOrDisplayId }, { email: userIdOrDisplayId }, { id: userIdOrDisplayId }] },
            });
            if (donor) {
                internalId = donor.id;
                const vol = await this.prisma.volunteer.findUnique({ where: { donorId: donor.id } });
                crossId = vol?.id || null;
            }
        }
        const where = {
            OR: [
                { donorId: internalId },
                { volunteerId: internalId },
                { partnerId: internalId }
            ]
        };
        if (crossId) {
            where.OR.push({ donorId: crossId }, { volunteerId: crossId });
        }
        const internalCerts = await this.prisma.certificate.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { donor: true, volunteer: true, partner: true }
        });
        if (type === 'VOLUNTEER') {
            const participations = await this.prisma.campParticipation.findMany({
                where: { volunteerId: internalId, status: 'ATTENDED' },
                include: { camp: true, volunteer: true }
            });
            const legacyCerts = participations
                .filter(p => !internalCerts.some(c => c.type === 'CAMP' && JSON.parse(c.metadata || '{}').campId === p.campId))
                .map(p => ({
                id: `CAMP-${p.id.slice(-8).toUpperCase()}`,
                type: 'CAMP',
                title: p.participationType === 'ACTIVE' ? 'Certificate of Excellence' : 'Certificate of Service',
                recipientName: p.volunteer.name,
                recipientType: 'VOLUNTEER',
                volunteerId: p.volunteer.id,
                createdAt: p.camp.date,
                metadata: JSON.stringify({ campId: p.campId, campName: p.camp.name }),
            }));
            return [...internalCerts, ...legacyCerts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return internalCerts;
    }
    async verifyCertificate(certId) {
        const formattedId = certId.trim().toUpperCase();
        const certRecord = await this.prisma.certificate.findUnique({
            where: { id: formattedId },
            include: { donor: true, volunteer: true, partner: true }
        });
        if (certRecord) {
            let description = `Official ${certRecord.type} issued to ${certRecord.recipientName}.`;
            if (certRecord.type === '80G' || certRecord.type === 'DONATION_RECEIPT') {
                const meta = JSON.parse(certRecord.metadata || '{}');
                description = `Donation of ₹${meta.amount?.toLocaleString('en-IN') || '—'} for ${certRecord.title}.`;
            }
            return {
                success: true,
                data: {
                    certId: certRecord.id,
                    isAuthentic: true,
                    type: certRecord.title,
                    recipientName: certRecord.recipientName,
                    issueDate: certRecord.createdAt,
                    description,
                    fileUrl: certRecord.fileUrl
                }
            };
        }
        const [prefix, suffix] = formattedId.split('-');
        if (!suffix)
            throw new common_1.NotFoundException('Invalid Certificate ID format');
        const lowerSuffix = suffix.toLowerCase();
        let isAuthentic = false;
        let details = null;
        if (prefix === 'DON' || prefix === '80G' || prefix === 'CERT') {
            const donations = await this.prisma.donation.findMany({
                where: { id: { endsWith: lowerSuffix } },
                include: { donor: true, program: true }
            });
            if (donations.length > 0) {
                const d = donations[0];
                isAuthentic = true;
                details = {
                    type: prefix === '80G' ? '80G Tax Exemption' : 'Impact Certificate',
                    recipientName: d.donor.name || 'Anonymous Donor',
                    issueDate: d.createdAt,
                    description: `Verified donation of ₹${d.amount.toLocaleString('en-IN')} to ${d.program.name}`
                };
            }
        }
        else if (prefix === 'VOL') {
            const volunteers = await this.prisma.volunteer.findMany({
                where: { id: { endsWith: lowerSuffix } }
            });
            if (volunteers.length > 0) {
                isAuthentic = true;
                details = {
                    type: 'Volunteer Appreciation',
                    recipientName: volunteers[0].name,
                    issueDate: new Date(),
                    description: `Verified volunteer profile for ${volunteers[0].name}.`
                };
            }
        }
        else if (prefix === 'CAMP') {
            const participations = await this.prisma.campParticipation.findMany({
                where: { id: { endsWith: lowerSuffix } },
                include: { volunteer: true, camp: true }
            });
            if (participations.length > 0) {
                isAuthentic = true;
                const p = participations[0];
                details = {
                    type: p.participationType === 'ACTIVE' ? 'Active Service Certificate' : 'Camp Participation',
                    recipientName: p.volunteer.name,
                    issueDate: p.camp.date,
                    description: `Completed service at ${p.camp.name} (${p.camp.location}).`
                };
            }
        }
        if (!isAuthentic || !details) {
            throw new common_1.NotFoundException('Certificate not found or invalid');
        }
        return {
            success: true,
            data: {
                certId: formattedId,
                isAuthentic: true,
                ...details
            }
        };
    }
    async findCertRecord(certId) {
        return this.prisma.certificate.findFirst({
            where: { OR: [{ id: certId }, { id: { contains: certId } }] },
        });
    }
    async downloadOrRegenerate(certId, res) {
        const cert = await this.prisma.certificate.findUnique({
            where: { id: certId },
        });
        if (!cert) {
            const certs = await this.prisma.certificate.findMany({
                where: { id: { contains: certId.replace('80G-', '') } },
                take: 1,
            });
            if (certs.length === 0) {
                throw new common_1.NotFoundException('Certificate not found');
            }
        }
        const certificateRecord = cert || (await this.prisma.certificate.findFirst({
            where: { id: { contains: certId.replace('80G-', '') } },
        }));
        if (!certificateRecord) {
            throw new common_1.NotFoundException('Certificate not found');
        }
        let meta = {};
        try {
            meta = JSON.parse(certificateRecord.metadata || '{}');
        }
        catch { }
        if (certificateRecord.type === '80G' && meta.donationId) {
            return this.generate80GCertificate(meta.donationId, res);
        }
        if (certificateRecord.type === 'DONATION_RECEIPT' && meta.donationId) {
            return this.generateReceipt(meta.donationId, res);
        }
        const html = this.buildCertificateHTML({
            type: certificateRecord.type,
            title: certificateRecord.title,
            recipientName: certificateRecord.recipientName,
            details: [`Certificate ID: <strong>${certificateRecord.id}</strong>`],
            dateStr: certificateRecord.createdAt.toLocaleDateString('en-IN'),
            certId: certificateRecord.id,
        });
        await this.htmlToPdf(html, res, `certificate_${certId}.pdf`);
    }
    async getCertificatesByDonorId(donorId) {
        const donor = await this.prisma.donor.findFirst({
            where: { OR: [{ donorId }, { email: donorId }] },
        });
        if (!donor)
            throw new common_1.NotFoundException('Donor not found');
        return this.prisma.certificate.findMany({
            where: { donorId: donor.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async generateZip(recipientType, userId, res) {
        try {
            const certificates = await this.getCertificates(recipientType, userId);
            if (!certificates || certificates.length === 0) {
                throw new common_1.NotFoundException('No certificates found to bundle');
            }
            const archiver = require('archiver');
            const archive = archiver('zip', { zlib: { level: 9 } });
            const zipName = `${recipientType}_Certificates_${new Date().getTime()}.zip`;
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename=${zipName}`);
            archive.pipe(res);
            for (const cert of certificates) {
                try {
                    const fileName = `${cert.title.replace(/[\s&/]/g, '_')}_${cert.id}.pdf`;
                    if (cert.fileUrl && cert.fileUrl.startsWith('http')) {
                        const response = await axios_1.default.get(cert.fileUrl, { responseType: 'arraybuffer' });
                        archive.append(Buffer.from(response.data), { name: fileName });
                    }
                    else {
                        const localPath = path.join(process.cwd(), 'public', 'certificates', `${cert.id}.pdf`);
                        if (fs.existsSync(localPath)) {
                            archive.file(localPath, { name: fileName });
                        }
                        else {
                        }
                    }
                }
                catch (err) {
                    console.error(`Failed to add certificate ${cert.id} to ZIP:`, err);
                }
            }
            await archive.finalize();
        }
        catch (error) {
            console.error('ZIP Error:', error);
            if (!res.headersSent) {
                res.status(500).send('Failed to generate ZIP archive');
            }
        }
    }
};
exports.CertificateService = CertificateService;
exports.CertificateService = CertificateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pdf_generator_service_1.PdfGeneratorService])
], CertificateService);
//# sourceMappingURL=certificate.service.js.map