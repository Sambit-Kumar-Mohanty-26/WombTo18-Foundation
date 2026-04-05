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
exports.BhashiniController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const translate_dto_1 = require("../dto/translate.dto");
const bhashini_service_1 = require("../services/bhashini.service");
let BhashiniController = class BhashiniController {
    bhashiniService;
    constructor(bhashiniService) {
        this.bhashiniService = bhashiniService;
    }
    async translate(dto) {
        return this.bhashiniService.translate(dto);
    }
};
exports.BhashiniController = BhashiniController;
__decorate([
    (0, common_1.Post)('translate'),
    (0, swagger_1.ApiOperation)({ summary: 'Translate a batch of strings through Bhashini' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [translate_dto_1.TranslateDto]),
    __metadata("design:returntype", Promise)
], BhashiniController.prototype, "translate", null);
exports.BhashiniController = BhashiniController = __decorate([
    (0, swagger_1.ApiTags)('Bhashini'),
    (0, common_1.Controller)('bhashini'),
    __metadata("design:paramtypes", [bhashini_service_1.BhashiniService])
], BhashiniController);
//# sourceMappingURL=bhashini.controller.js.map