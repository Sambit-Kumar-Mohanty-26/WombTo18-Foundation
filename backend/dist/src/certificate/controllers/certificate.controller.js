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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const certificate_service_1 = require("../services/certificate.service");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
const storage_service_1 = require("../../storage/storage.service");
let CertificateController = class CertificateController {
    certificateService;
    storageService;
    constructor(certificateService, storageService) {
        this.certificateService = certificateService;
        this.storageService = storageService;
    }
    async receipt(donationId, res) {
        return this.certificateService.generateReceipt(donationId, res);
    }
    async tax80g(donationId, res) {
        return this.certificateService.generate80GCertificate(donationId, res);
    }
    async downloadCert(certId, res) {
        const cert = await this.certificateService.findCertRecord(certId);
        if (cert?.fileUrl && cert.fileUrl.startsWith('http')) {
            const pathPart = this.extractStoragePath(cert.fileUrl);
            if (pathPart) {
                const file = await this.storageService.download(pathPart);
                if (file) {
                    res.setHeader('Content-Type', file.contentType || 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename=${certId}.pdf`);
                    return res.send(file.data);
                }
            }
            const response = await axios_1.default.get(cert.fileUrl, { responseType: 'arraybuffer' });
            res.setHeader('Content-Type', response.headers['content-type'] || 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${certId}.pdf`);
            return res.send(Buffer.from(response.data));
        }
        const certDir = path.join(process.cwd(), 'public', 'certificates');
        const filePath = path.join(certDir, `${certId}.pdf`);
        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${certId}.pdf`);
            const stream = fs.createReadStream(filePath);
            stream.pipe(res);
            return;
        }
        return this.certificateService.downloadOrRegenerate(certId, res);
    }
    async volunteerCert(volunteerId, res) {
        return this.certificateService.generateVolunteerCertificate(volunteerId, res);
    }
    async campCert(volunteerId, campId, res) {
        const url = await this.certificateService.generateAutomatedCampCertificate(volunteerId, campId);
        if (url.startsWith('http')) {
            const pathPart = this.extractStoragePath(url);
            if (pathPart) {
                const file = await this.storageService.download(pathPart);
                if (file) {
                    res.setHeader('Content-Type', file.contentType || 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename=certificate_${campId}.pdf`);
                    return res.send(file.data);
                }
            }
            const response = await axios_1.default.get(url, { responseType: 'arraybuffer' });
            res.setHeader('Content-Type', response.headers['content-type'] || 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=certificate_${campId}.pdf`);
            return res.send(Buffer.from(response.data));
        }
        const filePath = path.join(process.cwd(), url);
        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=certificate_${campId}.pdf`);
            return fs.createReadStream(filePath).pipe(res);
        }
        throw new common_1.NotFoundException('Certificate file not found');
    }
    async partnerCert(partnerId, res) {
        return this.certificateService.generatePartnerCertificate(partnerId, res);
    }
    async list(recipientType, userId) {
        return this.certificateService.getCertificates(recipientType, userId);
    }
    async getByDonor(donorId) {
        return this.certificateService.getCertificatesByDonorId(donorId);
    }
    async verify(certId) {
        return this.certificateService.verifyCertificate(certId);
    }
    async downloadZip(recipientType, userId, res) {
        return this.certificateService.generateZip(recipientType, userId, res);
    }
    extractStoragePath(fileUrl) {
        const marker = '/public/uploads/';
        const idx = fileUrl.indexOf(marker);
        if (idx === -1)
            return null;
        return fileUrl.slice(idx + marker.length);
    }
};
exports.CertificateController = CertificateController;
__decorate([
    (0, common_1.Get)('receipt/:donationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate donation receipt PDF' }),
    __param(0, (0, common_1.Param)('donationId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "receipt", null);
__decorate([
    (0, common_1.Get)('80g/:donationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate 80G tax certificate PDF' }),
    __param(0, (0, common_1.Param)('donationId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "tax80g", null);
__decorate([
    (0, common_1.Get)('download/:certId'),
    (0, swagger_1.ApiOperation)({ summary: 'Download a previously generated certificate PDF' }),
    __param(0, (0, common_1.Param)('certId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "downloadCert", null);
__decorate([
    (0, common_1.Get)('volunteer/:volunteerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate volunteer appreciation certificate' }),
    __param(0, (0, common_1.Param)('volunteerId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "volunteerCert", null);
__decorate([
    (0, common_1.Get)('camp/:volunteerId/:campId'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate camp participation certificate' }),
    __param(0, (0, common_1.Param)('volunteerId')),
    __param(1, (0, common_1.Param)('campId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "campCert", null);
__decorate([
    (0, common_1.Get)('partner/:partnerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate partner CSR certificate' }),
    __param(0, (0, common_1.Param)('partnerId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "partnerCert", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all certificates for a user' }),
    __param(0, (0, common_1.Query)('recipientType')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('by-donor/:donorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all certificates for a donor by donorId string (e.g. DNR123456)' }),
    __param(0, (0, common_1.Param)('donorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "getByDonor", null);
__decorate([
    (0, common_1.Get)('verify/:certId'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify a certificate by its printed visual ID' }),
    __param(0, (0, common_1.Param)('certId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)('zip'),
    (0, swagger_1.ApiOperation)({ summary: 'Download all certificates as a ZIP archive' }),
    __param(0, (0, common_1.Query)('recipientType')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CertificateController.prototype, "downloadZip", null);
exports.CertificateController = CertificateController = __decorate([
    (0, swagger_1.ApiTags)('Certificates'),
    (0, common_1.Controller)('certificates'),
    __metadata("design:paramtypes", [certificate_service_1.CertificateService,
        storage_service_1.StorageService])
], CertificateController);
//# sourceMappingURL=certificate.controller.js.map