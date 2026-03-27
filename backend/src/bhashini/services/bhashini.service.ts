import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TranslateDto } from '../dto/translate.dto';

type PipelineConfigResponse = {
  pipelineResponseConfig?: Array<{
    taskType: string;
    config?: Array<{
      serviceId?: string;
      language?: {
        sourceLanguage?: string;
        targetLanguage?: string;
      };
    }>;
  }>;
  pipelineInferenceAPIEndPoint?: {
    callbackUrl?: string;
    inferenceApiKey?: {
      name?: string;
      value?: string;
    };
  };
};

type ComputeResponse = {
  pipelineResponse?: Array<{
    output?: Array<{
      source?: string;
      target?: string;
      translation?: string;
    }>;
  }>;
};

type ResolvedPipeline = {
  callbackUrl: string;
  authHeaderName: string;
  authHeaderValue: string;
  serviceId: string;
};

@Injectable()
export class BhashiniService {
  private readonly logger = new Logger(BhashiniService.name);
  private readonly configCache = new Map<string, ResolvedPipeline>();

  constructor(private readonly configService: ConfigService) {}

  async translate(dto: TranslateDto) {
    const texts = dto.texts.filter((text) => text.trim().length > 0);
    if (texts.length === 0) {
      return {
        sourceLanguage: dto.sourceLanguage,
        targetLanguage: dto.targetLanguage,
        translations: [] as string[],
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
      throw new BadGatewayException('Bhashini translation failed');
    }

    const data = (await response.json()) as ComputeResponse;
    const outputs = data.pipelineResponse?.[0]?.output ?? [];
    const translations = outputs.map((entry, index) => entry.target || entry.translation || texts[index]);

    if (translations.length !== texts.length) {
      this.logger.warn(
        `Bhashini returned ${translations.length} translations for ${texts.length} inputs. Falling back per item where needed.`,
      );
    }

    return {
      sourceLanguage: dto.sourceLanguage,
      targetLanguage: dto.targetLanguage,
      translations: texts.map((text, index) => translations[index] || text),
      provider: 'bhashini',
    };
  }

  private async resolvePipeline(dto: TranslateDto): Promise<ResolvedPipeline> {
    if (dto.serviceId) {
      return {
        callbackUrl: this.requireEnv('BHASHINI_INFERENCE_URL'),
        authHeaderName: this.configService.get<string>('BHASHINI_INFERENCE_AUTH_HEADER') || 'Authorization',
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
    const configUrl =
      this.configService.get<string>('BHASHINI_CONFIG_URL') ||
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
      throw new BadGatewayException('Unable to resolve a Bhashini translation pipeline');
    }

    const data = (await response.json()) as PipelineConfigResponse;
    const translationConfig = data.pipelineResponseConfig
      ?.find((task) => task.taskType === 'translation')
      ?.config?.find(
        (config) =>
          config.language?.sourceLanguage === dto.sourceLanguage &&
          config.language?.targetLanguage === dto.targetLanguage,
      );

    const callbackUrl = data.pipelineInferenceAPIEndPoint?.callbackUrl;
    const authHeaderName = data.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name;
    const authHeaderValue = data.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value;

    if (!translationConfig?.serviceId || !callbackUrl || !authHeaderName || !authHeaderValue) {
      this.logger.error(`Bhashini config response missing translation details for ${cacheKey}`);
      throw new InternalServerErrorException('Bhashini configuration is incomplete for this language pair');
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

  private requireEnv(name: string) {
    const value = this.configService.get<string>(name);
    if (!value) {
      throw new InternalServerErrorException(`${name} is not configured on the backend`);
    }
    return value;
  }
}
