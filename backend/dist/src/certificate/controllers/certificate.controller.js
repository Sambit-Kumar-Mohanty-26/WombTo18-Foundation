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
exports.CertificateController = void 0;
const common_1 = require("@nestjs/common");
const certificate_service_1 = require("../services/certificate.service");
const swagger_1 = require("@nestjs/swagger");
let CertificateController = class CertificateController {
    certificateService;
    constructor(certificateService) {
        this.certificateService = certificateService;
    }
    async download80G(id, res) {
        return this.certificateService.generate80GCertificate(id, res);
    }
    async downloadReceipt(id, res) {
        return this.certificateService.generateReceipt(id, res);
    }
};
exports.CertificateController = CertificateController;
__decorate([
    (0, common_1.Get)('certificates/download/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Download 80G Tax certificate' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "download80G", null);
__decorate([
    (0, common_1.Get)('donor/receipts/download/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Download donation receipt' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "downloadReceipt", null);
exports.CertificateController = CertificateController = __decorate([
    (0, swagger_1.ApiTags)('Certificates & Receipts'),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [certificate_service_1.CertificateService])
], CertificateController);
//# sourceMappingURL=certificate.controller.js.map