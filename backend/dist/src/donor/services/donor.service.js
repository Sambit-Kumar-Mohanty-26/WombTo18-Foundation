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
exports.DonorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
let DonorService = class DonorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(donorId) {
        const donor = await this.prisma.donor.findUnique({
            where: { donorId },
            include: { donations: { where: { status: 'SUCCESS' } } },
        });
        if (!donor)
            throw new common_1.NotFoundException('Donor not found');
        const impact = await this.prisma.impactMetrics.findUnique({
            where: { id: 'global' },
        }) || {
            childrenImpacted: 150,
            schoolsReached: 12,
            healthCheckups: 89,
            programsSupported: 3,
        };
        return {
            donor: {
                name: donor.name || 'Anonymous Donor',
                donorId: donor.donorId,
                tier: donor.tier,
                totalDonated: donor.totalDonated,
            },
            impact,
        };
    }
    async getDonations(donorId) {
        const donor = await this.prisma.donor.findUnique({
            where: { donorId },
        });
        if (!donor)
            throw new common_1.NotFoundException('Donor not found');
        const donations = await this.prisma.donation.findMany({
            where: { donorId: donor.id, status: 'SUCCESS' },
            include: { program: true },
            orderBy: { createdAt: 'desc' },
        });
        return donations.map((d) => ({
            amount: d.amount,
            program: d.program.name,
            date: d.createdAt.toISOString().split('T')[0],
            status: d.status,
        }));
    }
};
exports.DonorService = DonorService;
exports.DonorService = DonorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DonorService);
//# sourceMappingURL=donor.service.js.map