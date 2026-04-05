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
var BhashiniService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BhashiniService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let BhashiniService = BhashiniService_1 = class BhashiniService {
    configService;
    logger = new common_1.Logger(BhashiniService_1.name);
    configCache = new Map();
    constructor(configService) {
        this.configService = configService;
    }
    async translate(dto) {
        const texts = dto.texts.filter((text) => text.trim().length > 0);
        if (texts.length === 0) {
            return {
                sourceLanguage: dto.sourceLanguage,
                targetLanguage: dto.targetLanguage,
                translations: [],
                provider: 'bhashini',
            };
        }
        if (dto.sourceLanguage === dto.targetLanguage) {
            return {
                sourceLanguage: dto.sourceLanguage,
                targetLanguage: dto.targetLanguage,
                translations: texts,
                provider: 'identity',
            };
        }
        const pipeline = await this.resolvePipeline(dto);
        const response = await fetch(pipeline.callbackUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [pipeline.authHeaderName]: pipeline.authHeaderValue,
            },
            body: JSON.stringify({
                pipelineTasks: [
                    {
                        taskType: 'translation',
                        config: {
                            language: {
                                sourceLanguage: dto.sourceLanguage,
                                targetLanguage: dto.targetLanguage,
                            },
                            serviceId: pipeline.serviceId,
                        },
                    },
                ],
                inputData: {
                    input: texts.map((source) => ({ source })),
                },
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            this.logger.error(`Bhashini compute failed: ${response.status} ${errorText}`);
            throw new common_1.BadGatewayException('Bhashini translation failed');
        }
        const data = (await response.json());
        const outputs = data.pipelineResponse?.[0]?.output ?? [];
        const translations = outputs.map((entry, index) => entry.target || entry.translation || texts[index]);
        if (translations.length !== texts.length) {
            this.logger.warn(`Bhashini returned ${translations.length} translations for ${texts.length} inputs. Falling back per item where needed.`);
        }
        return {
            sourceLanguage: dto.sourceLanguage,
            targetLanguage: dto.targetLanguage,
            translations: texts.map((text, index) => translations[index] || text),
            provider: 'bhashini',
        };
    }
    async resolvePipeline(dto) {
        if (dto.serviceId) {
            return {
                callbackUrl: this.requireEnv('BHASHINI_INFERENCE_URL'),
                authHeaderName: this.configService.get('BHASHINI_INFERENCE_AUTH_HEADER') || 'Authorization',
                authHeaderValue: this.requireEnv('BHASHINI_INFERENCE_AUTH_VALUE'),
                serviceId: dto.serviceId,
            };
        }
        const cacheKey = `${dto.sourceLanguage}:${dto.targetLanguage}`;
        const cached = this.configCache.get(cacheKey);
        if (cached) {
            return cached;
        }
        const ulcaApiKey = this.requireEnv('BHASHINI_ULCA_API_KEY');
        const userId = this.requireEnv('BHASHINI_USER_ID');
        const pipelineId = this.requireEnv('BHASHINI_PIPELINE_ID');
        const configUrl = this.configService.get('BHASHINI_CONFIG_URL') ||
            'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline';
        const response = await fetch(configUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                userID: userId,
                ulcaApiKey,
            },
            body: JSON.stringify({
                pipelineTasks: [
                    {
                        taskType: 'translation',
                        config: {
                            language: {
                                sourceLanguage: dto.sourceLanguage,
                                targetLanguage: dto.targetLanguage,
                            },
                        },
                    },
                ],
                pipelineRequestConfig: {
                    pipelineId,
                },
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            this.logger.error(`Bhashini config failed: ${response.status} ${errorText}`);
            throw new common_1.BadGatewayException('Unable to resolve a Bhashini translation pipeline');
        }
        const data = (await response.json());
        const translationConfig = data.pipelineResponseConfig
            ?.find((task) => task.taskType === 'translation')
            ?.config?.find((config) => config.language?.sourceLanguage === dto.sourceLanguage &&
            config.language?.targetLanguage === dto.targetLanguage);
        const callbackUrl = data.pipelineInferenceAPIEndPoint?.callbackUrl;
        const authHeaderName = data.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name;
        const authHeaderValue = data.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value;
        if (!translationConfig?.serviceId || !callbackUrl || !authHeaderName || !authHeaderValue) {
            this.logger.error(`Bhashini config response missing translation details for ${cacheKey}`);
            throw new common_1.InternalServerErrorException('Bhashini configuration is incomplete for this language pair');
        }
        const resolved = {
            callbackUrl,
            authHeaderName,
            authHeaderValue,
            serviceId: translationConfig.serviceId,
        };
        this.configCache.set(cacheKey, resolved);
        return resolved;
    }
    requireEnv(name) {
        const value = this.configService.get(name);
        if (!value) {
            throw new common_1.InternalServerErrorException(`${name} is not configured on the backend`);
        }
        return value;
    }
};
exports.BhashiniService = BhashiniService;
exports.BhashiniService = BhashiniService = BhashiniService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BhashiniService);
//# sourceMappingURL=bhashini.service.js.map