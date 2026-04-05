import { client } from './client';

type TranslateResponse = {
  sourceLanguage: string;
  targetLanguage: string;
  translations: string[];
  provider: string;
};

export const bhashiniApi = {
  translate: (payload: {
    texts: string[];
    sourceLanguage: string;
    targetLanguage: string;
    serviceId?: string;
  }) => client.post<TranslateResponse>('/bhashini/translate', payload),
};
