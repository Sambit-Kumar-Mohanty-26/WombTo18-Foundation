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
const donor_service_1 = require("../services/donor.service");
const swagger_1 = require("@nestjs/swagger");
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
exports.DonorController = DonorController = __decorate([
    (0, swagger_1.ApiTags)('Donor Dashboard'),
    (0, common_1.Controller)('api/donors'),
    __metadata("design:paramtypes", [donor_service_1.DonorService])
], DonorController);
//# sourceMappingURL=donor.controller.js.map