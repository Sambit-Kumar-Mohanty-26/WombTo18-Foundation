"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BhashiniModule = void 0;
const common_1 = require("@nestjs/common");
const bhashini_controller_1 = require("./controllers/bhashini.controller");
const bhashini_service_1 = require("./services/bhashini.service");
let BhashiniModule = class BhashiniModule {
};
exports.BhashiniModule = BhashiniModule;
exports.BhashiniModule = BhashiniModule = __decorate([
    (0, common_1.Module)({
        controllers: [bhashini_controller_1.BhashiniController],
        providers: [bhashini_service_1.BhashiniService],
        exports: [bhashini_service_1.BhashiniService],
    })
], BhashiniModule);
//# sourceMappingURL=bhashini.module.js.map