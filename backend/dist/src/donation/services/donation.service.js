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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
const pdf_generator_service_1 = require("./pdf-generator.service");
const Razorpay = require("razorpay");
const crypto = __importStar(require("crypto"));
let DonationService = class DonationService {
    prisma;
    pdfGenerator;
    razorpay;
    constructor(prisma, pdfGenerator) {
        this.prisma = prisma;
        this.pdfGenerator = pdfGenerator;
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
        });
    }
    buildDonorId() {
        const stamp = Date.now().toString().slice(-6);
        const random = Math.floor(100 + Math.random() * 900);
        return `DNR${stamp}${random}`;
    }
    async createOrder(data) {
        if (!data.amount || data.amount < 100) {
            throw new common_1.BadRequestException('Minimum donation amount is INR 100');
        }
        const currency = data.currency || 'INR';
        const donorEmail = data.email?.trim().toLowerCase();
        if (!donorEmail) {
            throw new common_1.BadRequestException('Email is required to create a donation');
        }
        const donorName = data.name?.trim() ||
            data.organizationName?.trim() ||
            data.contactPerson?.trim() ||
            'Anonymous Donor';
        let donor = await this.prisma.donor.findUnique({
            where: { email: donorEmail },
        });
        if (donor) {
            donor = await this.prisma.donor.update({
                where: { id: donor.id },
                data: {
                    name: donorName,
                    mobile: data.mobile?.trim() || donor.mobile,
                    pan: data.pan?.trim() || donor.pan,
                    address: data.address?.trim() ||
                        data.schoolName?.trim() ||
                        donor.address,
                },
            });
        }
        else {
            donor = await this.prisma.donor.create({
                data: {
                    donorId: this.buildDonorId(),
                    email: donorEmail,
                    name: donorName,
                    mobile: data.mobile?.trim(),
                    pan: data.pan?.trim(),
                    address: data.address?.trim() || data.schoolName?.trim(),
                },
            });
        }
        let program = data.programId
            ? await this.prisma.program.findUnique({
                where: { id: data.programId },
            })
            : null;
        if (!program) {
            const programName = data.programName?.trim() || 'General Donation';
            program = await this.prisma.program.upsert({
                where: { name: programName },
                update: {},
                create: {
                    name: programName,
                    description: data.notes?.trim() ||
                        `Support contribution for ${programName}.`,
                    targetAmount: Math.max(data.amount * 10, 250000),
                },
            });
        }
        let order;
        try {
            if (process.env.RAZORPAY_KEY_SECRET === 'test_secret_12345') {
                order = {
                    id: `order_mock_${Date.now()}`,
                    amount: data.amount * 100,
                    currency,
                };
            }
            else {
                order = await this.razorpay.orders.create({
                    amount: data.amount * 100,
                    currency,
                    receipt: `receipt_${Date.now()}`,
                });
            }
        }
        catch (error) {
            console.error('Razorpay order creation error:', error?.error?.description || error?.message || error);
            throw new common_1.BadRequestException(`Razorpay order creation failed: ${error?.error?.description || error?.message || 'Unknown error'}`);
        }
        const donation = await this.prisma.donation.create({
            data: {
                amount: data.amount,
                currency,
                razorpayOrderId: order.id,
                donorId: donor.id,
                programId: program.id,
                displayName: data.displayName ?? true,
                referralCode: data.referralCode,
            },
        });
        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            donationId: donation.id,
            donorId: donor.donorId,
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        };
    }
    async verifyPayment(data) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
        const key_secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
        const existingDonation = await this.prisma.donation.findUnique({
            where: { razorpayOrderId: razorpay_order_id },
        });
        if (!existingDonation) {
            throw new common_1.BadRequestException('Donation order not found');
        }
        if (existingDonation.status === 'SUCCESS') {
            const donor = await this.prisma.donor.findUnique({ where: { id: existingDonation.donorId } });
            const cert = await this.prisma.certificate.findFirst({
                where: { donorId: existingDonation.donorId, type: '80G' },
                orderBy: { createdAt: 'desc' },
            });
            return {
                success: true,
                tier: donor?.tier || 'DONOR',
                dashboardUnlocked: donor?.isEligible || false,
                certificateUrl: cert?.fileUrl || null,
                certId: cert?.id || null,
                donationId: existingDonation.id,
                donorId: donor?.donorId || null,
                email: donor?.email || null,
            };
        }
        const generated_signature = crypto
            .createHmac('sha256', key_secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');
        if (generated_signature !== razorpay_signature) {
            throw new common_1.BadRequestException('Invalid payment signature');
        }
        const donation = await this.prisma.donation.update({
            where: { razorpayOrderId: razorpay_order_id },
            data: {
                status: 'SUCCESS',
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
            },
            include: { donor: true },
        });
        await this.prisma.program.update({
            where: { id: donation.programId },
            data: {
                raisedAmount: {
                    increment: donation.amount,
                },
            },
        });
        await this.prisma.impactMetrics.upsert({
            where: { id: 'global' },
            update: {
                totalRaised: {
                    increment: donation.amount,
                },
            },
            create: {
                id: 'global',
                totalRaised: donation.amount,
            },
        });
        const donor = await this.prisma.donor.findUnique({
            where: { id: donation.donorId },
            include: { donations: { where: { status: 'SUCCESS' } } },
        });
        if (!donor)
            throw new common_1.BadRequestException('Donor not found');
        const totalDonated = donor.donations.reduce((sum, d) => sum + d.amount, 0);
        let tier = 'DONOR';
        if (totalDonated >= 50000)
            tier = 'CHAMPION';
        else if (totalDonated >= 10000)
            tier = 'PATRON';
        const updatedDonor = await this.prisma.donor.update({
            where: { id: donor.id },
            data: {
                totalDonated,
                tier: tier,
                isEligible: totalDonated >= 5000,
            },
        });
        if (donation.referralCode) {
            const volunteer = await this.prisma.volunteer.findUnique({
                where: { volunteerId: donation.referralCode },
            });
            if (volunteer && volunteer.email !== donor.email) {
                const existingReferral = await this.prisma.coinTransaction.findFirst({
                    where: {
                        volunteerId: volunteer.id,
                        type: 'REFERRAL',
                        metadata: { contains: donation.id },
                    },
                });
                if (!existingReferral) {
                    let coinConfig = await this.prisma.coinConfig.findUnique({ where: { id: 'global' } });
                    if (!coinConfig) {
                        coinConfig = await this.prisma.coinConfig.create({ data: { id: 'global' } });
                    }
                    let tiers = [];
                    try {
                        tiers = JSON.parse(coinConfig.referralTiers);
                    }
                    catch {
                        tiers = [];
                    }
                    const matchedTier = tiers.find(t => donation.amount >= t.min && donation.amount <= t.max);
                    const coinsEarned = matchedTier ? matchedTier.coins : (tiers.length > 0 ? tiers[tiers.length - 1].coins : 50);
                    await this.prisma.$transaction([
                        this.prisma.volunteer.update({
                            where: { id: volunteer.id },
                            data: { totalCoins: { increment: coinsEarned } },
                        }),
                        this.prisma.coinTransaction.create({
                            data: {
                                volunteerId: volunteer.id,
                                amount: coinsEarned,
                                type: 'REFERRAL',
                                description: `Referral bonus: ${coinsEarned} coins for ₹${donation.amount} donation`,
                                metadata: JSON.stringify({ donationId: donation.id, donorEmail: donor.email }),
                            },
                        }),
                        this.prisma.referral.create({
                            data: {
                                referrerType: 'VOLUNTEER',
                                volunteerId: volunteer.id,
                                referredName: donor.name,
                                referredEmail: donor.email,
                                referredPhone: donor.mobile,
                                paymentAmount: donation.amount,
                                coinsAwarded: coinsEarned,
                                status: 'DONATED',
                                joinedDonorId: donor.id,
                            },
                        }),
                    ]);
                }
            }
        }
        let fileUrl = null;
        let certId = null;
        try {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const receiptNum = `RCPT-${Date.now()}`;
            await this.prisma.donation.update({ where: { id: donation.id }, data: { receiptNumber: receiptNum } });
            certId = `80G-${donation.id}`;
            const existingCert = await this.prisma.certificate.findUnique({ where: { id: certId } });
            if (existingCert) {
                fileUrl = existingCert.fileUrl;
            }
            else {
                fileUrl = await this.pdfGenerator.generate80GCertificate({
                    donorName: donor.name || 'Anonymous Donor',
                    donorPan: donor.pan || 'N/A',
                    amount: donation.amount,
                    receiptNumber: receiptNum,
                    date: new Date(),
                    certId,
                    frontendUrl,
                });
                await this.prisma.certificate.create({
                    data: {
                        id: certId,
                        type: '80G',
                        title: 'Donation Receipt & 80G',
                        recipientName: donor.name || 'Anonymous Donor',
                        recipientType: 'DONOR',
                        donorId: donor.id,
                        fileUrl,
                        metadata: JSON.stringify({ amount: donation.amount, donationId: donation.id }),
                    },
                });
            }
        }
        catch (err) {
            console.error('Failed to generate 80G certificate:', err);
        }
        return {
            success: true,
            tier: updatedDonor.tier,
            dashboardUnlocked: updatedDonor.isEligible,
            certificateUrl: fileUrl,
            certId: certId,
            donationId: donation.id,
            donorId: updatedDonor.donorId,
            email: donor.email,
        };
    }
    async getSidebarStats() {
        const metrics = await this.prisma.impactMetrics.findUnique({ where: { id: 'global' } });
        const activeProgramsCount = await this.prisma.program.count();
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const monthlyDonations = await this.prisma.donation.aggregate({
            where: {
                status: 'SUCCESS',
                createdAt: { gte: startOfMonth }
            },
            _sum: { amount: true }
        });
        const currentMonthRaised = monthlyDonations._sum.amount || 0;
        const recentDonations = await this.prisma.donation.findMany({
            where: { status: 'SUCCESS' },
            orderBy: { createdAt: 'desc' },
            take: 4,
            include: { donor: true }
        });
        const recentDonorsData = recentDonations.map(d => ({
            name: d.displayName ? (d.donor.name || 'Anonymous Donor') : 'Anonymous Donor',
            amount: d.amount,
            createdAt: d.createdAt,
        }));
        return {
            childrenRegistered: metrics?.childrenImpacted || 5200,
            treesPlanted: Math.floor((metrics?.totalRaised || 500000) / 100) + 4300,
            schoolsOnboarded: metrics?.schoolsReached || 120,
            monthlyRaised: currentMonthRaised || 77500,
            activePrograms: activeProgramsCount > 0 ? activeProgramsCount : 32,
            recentDonors: recentDonorsData,
            monthlyGoal: 500000,
        };
    }
    async getWallOfFame(filter) {
        let result = [];
        const limit = 100;
        if (filter === 'top_all_time') {
            const topDonors = await this.prisma.donor.findMany({
                where: { totalDonated: { gt: 0 } },
                orderBy: { totalDonated: 'desc' },
                take: limit,
            });
            result = topDonors.map(d => ({
                id: d.id,
                name: d.showOnLeaderboard && d.name ? d.name : 'Anonymous Donor',
                amount: d.totalDonated,
                tier: d.tier,
                date: d.updatedAt,
            }));
        }
        else if (filter === 'top_month') {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const groupedDonations = await this.prisma.donation.groupBy({
                by: ['donorId'],
                where: {
                    status: 'SUCCESS',
                    createdAt: { gte: startOfMonth },
                },
                _sum: { amount: true },
                orderBy: { _sum: { amount: 'desc' } },
                take: limit,
            });
            const donorIds = groupedDonations.map(g => g.donorId);
            const donors = await this.prisma.donor.findMany({
                where: { id: { in: donorIds } },
            });
            result = groupedDonations.map(g => {
                const donor = donors.find(d => d.id === g.donorId);
                return {
                    id: g.donorId,
                    name: donor?.showOnLeaderboard && donor?.name ? donor.name : 'Anonymous Donor',
                    amount: g._sum.amount || 0,
                    tier: donor?.tier || 'DONOR',
                    date: new Date(),
                };
            });
        }
        else {
            const recentDonations = await this.prisma.donation.findMany({
                where: { status: 'SUCCESS' },
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: { donor: true },
            });
            result = recentDonations.map(d => ({
                id: d.id,
                name: d.displayName && d.donor.name ? d.donor.name : 'Anonymous Donor',
                amount: d.amount,
                tier: d.donor.tier,
                date: d.createdAt,
            }));
        }
        return result;
    }
};
exports.DonationService = DonationService;
exports.DonationService = DonationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pdf_generator_service_1.PdfGeneratorService])
], DonationService);
//# sourceMappingURL=donation.service.js.map