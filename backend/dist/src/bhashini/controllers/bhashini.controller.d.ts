import { TranslateDto } from '../dto/translate.dto';
import { BhashiniService } from '../services/bhashini.service';
export declare class BhashiniController {
    private readonly bhashiniService;
    constructor(bhashiniService: BhashiniService);
    translate(dto: TranslateDto): Promise<{
        sourceLanguage: string;
        targetLanguage: string;
        translations: string[];
        provider: string;
    }>;
}
