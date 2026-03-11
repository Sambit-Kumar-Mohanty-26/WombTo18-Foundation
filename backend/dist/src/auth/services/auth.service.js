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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/services/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async donorLogin(email) {
        let donor = await this.prisma.donor.findUnique({
            where: { email },
        });
        if (!donor) {
            const lastDonor = await this.prisma.donor.findFirst({
                orderBy: { createdAt: 'desc' },
            });
            const nextId = lastDonor ? parseInt(lastDonor.donorId.replace('DNR', '')) + 1 : 1000;
            donor = await this.prisma.donor.create({
                data: {
                    email,
                    donorId: `DNR${nextId}`,
                },
            });
        }
        const isEligible = donor.totalDonated >= 5000;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = otp;
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.donor.update({
            where: { id: donor.id },
            data: { otpHash, otpExpiry },
        });
        console.log(`[OTP for ${email}]: ${otp}`);
        if (!isEligible) {
            return {
                eligible: false,
                message: 'Dashboard access requires minimum ₹5000 donation',
                redirect: '/donor/receipts',
            };
        }
        return {
            eligible: true,
            otpSent: true,
            donorId: donor.donorId,
        };
    }
    async verifyOtp(email, otp) {
        const donor = await this.prisma.donor.findUnique({
            where: { email },
        });
        if (!donor || !donor.otpHash || !donor.otpExpiry) {
            throw new common_1.BadRequestException('No OTP sent for this email');
        }
        if (new Date() > donor.otpExpiry) {
            throw new common_1.BadRequestException('OTP expired');
        }
        if (donor.otpHash !== otp) {
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        await this.prisma.donor.update({
            where: { id: donor.id },
            data: { otpHash: null, otpExpiry: null },
        });
        const payload = { sub: donor.id, email: donor.email, donorId: donor.donorId };
        const token = this.jwtService.sign(payload);
        return {
            success: true,
            token,
            redirect: '/donor/dashboard',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map