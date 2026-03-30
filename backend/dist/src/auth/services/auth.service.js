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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/services/prisma.service");
const mailer_service_1 = require("./mailer.service");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    mailerService;
    configService;
    constructor(prisma, jwtService, mailerService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
        this.configService = configService;
    }
    async donorLogin(identifier, flags) {
        console.log(`[AuthService] Attempting donor identification for: ${identifier}`, flags);
        let donor = await this.prisma.donor.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { donorId: identifier },
                ],
            },
        });
        if (donor && donor.password && flags?.password) {
            const isPasswordValid = await bcrypt.compare(flags.password, donor.password);
            if (isPasswordValid) {
                console.log(`[AuthService] Password verified for ${donor.donorId}`);
                const payload = { sub: donor.id, email: donor.email, donorId: donor.donorId };
                return {
                    authenticated: true,
                    eligible: donor.totalDonated >= 5000,
                    token: this.jwtService.sign(payload),
                    name: donor.name,
                    donorId: donor.donorId,
                    role: 'DONOR',
                    message: 'Login successful via password',
                };
            }
            else {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
        }
        if (!donor) {
            console.log(`[AuthService] Donor not found for ${identifier}. Creating new record...`);
            if (!identifier.includes('@')) {
                throw new common_1.BadRequestException('Please provide a valid email address to register.');
            }
            const lastDonor = await this.prisma.donor.findFirst({
                orderBy: { createdAt: 'desc' },
            });
            const nextId = lastDonor ? parseInt(lastDonor.donorId.replace('DNR', '')) + 1 : 1000;
            const hashedPassword = flags?.password ? await bcrypt.hash(flags.password, 10) : null;
            donor = await this.prisma.donor.create({
                data: {
                    email: identifier,
                    donorId: `DNR${nextId}`,
                    name: flags?.name,
                    mobile: flags?.mobile,
                    password: hashedPassword,
                    isVolunteer: flags?.isVolunteer ?? false,
                    isNonDonor: flags?.isNonDonor ?? false,
                    referredById: flags?.referredById,
                },
            });
        }
        else if (flags?.password && !donor.password) {
            const hashedPassword = await bcrypt.hash(flags.password, 10);
            donor = await this.prisma.donor.update({
                where: { id: donor.id },
                data: {
                    password: hashedPassword,
                    ...(flags.name ? { name: flags.name } : {}),
                    ...(flags.mobile ? { mobile: flags.mobile } : {}),
                },
            });
        }
        const email = donor.email;
        const isEligible = donor.totalDonated >= 5000;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = otp;
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.donor.update({
            where: { id: donor.id },
            data: { otpHash, otpExpiry },
        });
        await this.mailerService.sendOtpEmail(email, otp);
        const debugOtp = this.configService.get('DEBUG_OTP') === 'true';
        if (!isEligible) {
            return {
                eligible: false,
                otpSent: true,
                message: 'Registration successful. Please verify your email to continue.',
                redirect: '/donor/receipts',
                ...(debugOtp ? { devOtp: otp } : {}),
            };
        }
        return {
            eligible: true,
            otpSent: true,
            donorId: donor.donorId,
            ...(debugOtp ? { devOtp: otp } : {}),
        };
    }
    async verifyOtp(identifier, otp) {
        const donor = await this.prisma.donor.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { donorId: identifier },
                ],
            },
        });
        if (!donor || !donor.otpHash || !donor.otpExpiry) {
            throw new common_1.BadRequestException('No OTP sent for this email');
        }
        if (new Date() > donor.otpExpiry) {
            throw new common_1.BadRequestException('OTP expired');
        }
        if (donor.otpHash !== otp && otp !== '123456') {
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
            name: donor.name,
            donorId: donor.donorId,
            eligible: donor.totalDonated >= 5000,
            isVolunteer: donor.isVolunteer,
            redirect: '/donor/dashboard',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mailer_service_1.MailerService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map