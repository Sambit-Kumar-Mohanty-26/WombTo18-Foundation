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
const Razorpay = require("razorpay");
const crypto = __importStar(require("crypto"));
let DonationService = class DonationService {
    prisma;
    razorpay;
    constructor(prisma) {
        this.prisma = prisma;
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
        });
    }
    async createOrder(data) {
        let order;
        try {
            if (process.env.RAZORPAY_KEY_SECRET === 'test_secret_12345') {
                order = {
                    id: `order_mock_${Date.now()}`,
                    amount: data.amount * 100,
                    currency: data.currency,
                };
            }
            else {
                order = await this.razorpay.orders.create({
                    amount: data.amount * 100,
                    currency: data.currency,
                    receipt: `receipt_${Date.now()}`,
                });
            }
        }
        catch (error) {
            console.error(error);
            throw new common_1.BadRequestException('Razorpay order creation failed');
        }
        const donation = await this.prisma.donation.create({
            data: {
                amount: data.amount,
                currency: data.currency,
                razorpayOrderId: order.id,
                donorId: data.donorId,
                programId: data.programId,
                displayName: data.displayName,
            },
        });
        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            donationId: donation.id,
        };
    }
    async verifyPayment(data) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
        const key_secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
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
        return {
            success: true,
            tier: updatedDonor.tier,
            dashboardUnlocked: updatedDonor.isEligible,
        };
    }
};
exports.DonationService = DonationService;
exports.DonationService = DonationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DonationService);
//# sourceMappingURL=donation.service.js.map