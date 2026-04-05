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
exports.DonationController = void 0;
const common_1 = require("@nestjs/common");
const donation_service_1 = require("../services/donation.service");
const swagger_1 = require("@nestjs/swagger");
const cache_manager_1 = require("@nestjs/cache-manager");
let DonationController = class DonationController {
    donationService;
    constructor(donationService) {
        this.donationService = donationService;
    }
    async create(body) {
        return this.donationService.createOrder(body);
    }
    async verify(body) {
        return this.donationService.verifyPayment(body);
    }
    async getStats() {
        return this.donationService.getSidebarStats();
    }
    async getWallOfFame(filter) {
        return this.donationService.getWallOfFame(filter || 'recent');
    }
};
exports.DonationController = DonationController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Razorpay order for donation' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DonationController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Razorpay payment signature' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DonationController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    (0, cache_manager_1.CacheTTL)(120),
    (0, swagger_1.ApiOperation)({ summary: 'Get live donation stats and recent donors' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DonationController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('wall-of-fame'),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    (0, cache_manager_1.CacheTTL)(180),
    (0, swagger_1.ApiOperation)({ summary: 'Get ranked wall of fame donors' }),
    __param(0, (0, common_1.Query)('filter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonationController.prototype, "getWallOfFame", null);
exports.DonationController = DonationController = __decorate([
    (0, swagger_1.ApiTags)('Donations'),
    (0, common_1.Controller)('donations'),
    __metadata("design:paramtypes", [donation_service_1.DonationService])
], DonationController);
//# sourceMappingURL=donation.controller.js.map