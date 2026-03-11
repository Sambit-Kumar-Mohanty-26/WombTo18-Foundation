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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransparencyController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/services/prisma.service");
const swagger_1 = require("@nestjs/swagger");
let TransparencyController = class TransparencyController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTransparency() {
        const metrics = await this.prisma.impactMetrics.findUnique({
            where: { id: 'global' },
        }) || {
            totalRaised: 1000000,
            totalUtilized: 700000,
            programs: [],
            expenses: [],
        };
        return metrics;
    }
    async getReports(donationId) {
        return [
            {
                reportNumber: 1,
                title: 'Week 1 Update',
                description: 'Health camp completed',
                metrics: { childrenServed: 50 },
            },
        ];
    }
};
exports.TransparencyController = TransparencyController;
__decorate([
    (0, common_1.Get)('transparency'),
    (0, swagger_1.ApiOperation)({ summary: 'Get global transparency metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransparencyController.prototype, "getTransparency", null);
__decorate([
    (0, common_1.Get)('reports/:donationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get progress reports for a specific donation' }),
    __param(0, (0, common_1.Param)('donationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransparencyController.prototype, "getReports", null);
exports.TransparencyController = TransparencyController = __decorate([
    (0, swagger_1.ApiTags)('Transparency & Reports'),
    (0, common_1.Controller)(''),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransparencyController);
//# sourceMappingURL=transparency.controller.js.map