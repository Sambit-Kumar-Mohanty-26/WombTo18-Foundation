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
exports.DonorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const donor_service_1 = require("../services/donor.service");
let DonorController = class DonorController {
    donorService;
    constructor(donorService) {
        this.donorService = donorService;
    }
    async getDashboard(donorId) {
        return this.donorService.getDashboard(donorId);
    }
    async getDonations(donorId) {
        return this.donorService.getDonations(donorId);
    }
    async getLeaderboard(page, limit, timeframe) {
        return this.donorService.getLeaderboard({
            page: parseInt(page ?? '1'),
            limit: parseInt(limit ?? '10'),
            timeframe: timeframe ?? 'all',
        });
    }
    async getRecruits(donorId) {
        return this.donorService.getRecruits(donorId);
    }
    async becomeVolunteer(donorId) {
        return this.donorService.becomeVolunteer(donorId);
    }
    async toggleLeaderboard(donorId, show) {
        return this.donorService.toggleLeaderboard(donorId, show);
    }
    async getProfile(donorId) {
        return this.donorService.getProfile(donorId);
    }
    async lookup(email) {
        return this.donorService.lookupByEmail(email);
    }
};
exports.DonorController = DonorController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get donor dashboard data' }),
    __param(0, (0, common_1.Query)('donorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonorController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('donations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get donor donation history' }),
    __param(0, (0, common_1.Query)('donorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonorController.prototype, "getDonations", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get global donor leaderboard' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('timeframe')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DonorController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)('recruits/:donorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recruits for volunteer donor' }),
    __param(0, (0, common_1.Param)('donorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonorController.prototype, "getRecruits", null);
__decorate([
    (0, common_1.Post)('apply-volunteer'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark donor as volunteer' }),
    __param(0, (0, common_1.Query)('donorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonorController.prototype, "becomeVolunteer", null);
__decorate([
    (0, common_1.Post)('toggle-leaderboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle leaderboard visibility' }),
    __param(0, (0, common_1.Body)('donorId')),
    __param(1, (0, common_1.Body)('show')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], DonorController.prototype, "toggleLeaderboard", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get donor profile' }),
    __param(0, (0, common_1.Query)('donorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonorController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('lookup'),
    (0, swagger_1.ApiOperation)({ summary: 'Look up donor by email (for guest flow)' }),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonorController.prototype, "lookup", null);
exports.DonorController = DonorController = __decorate([
    (0, swagger_1.ApiTags)('Donors'),
    (0, common_1.Controller)('donors'),
    __metadata("design:paramtypes", [donor_service_1.DonorService])
], DonorController);
//# sourceMappingURL=donor.controller.js.map