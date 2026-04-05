import { ConfigService } from '@nestjs/config';
import { TranslateDto } from '../dto/translate.dto';
export declare class BhashiniService {
    private readonly configService;
    private readonly logger;
    private readonly configCache;
    constructor(configService: ConfigService);
    translate(dto: TranslateDto): Promise<{
        sourceLanguage: string;
        targetLanguage: string;
        translations: string[];
        provider: string;
    }>;
    private resolvePipeline;
    private requireEnv;
}
