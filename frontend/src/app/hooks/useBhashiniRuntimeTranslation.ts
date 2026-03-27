import { useEffect, useMemo, useState } from 'react';
import { bhashiniApi } from '../lib/api/bhashini';

function collectStrings(value: unknown, acc: string[] = []) {
  if (typeof value === 'string') {
    acc.push(value);
    return acc;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, acc));
    return acc;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectStrings(item, acc));
  }

  return acc;
}

function replaceStrings<T>(value: T, translations: Map<string, string>): T {
  if (typeof value === 'string') {
    return (translations.get(value) || value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceStrings(item, translations)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, replaceStrings(item, translations)]),
    ) as T;
  }

  return value;
}

export function useBhashiniRuntimeTranslation<T>(
  content: T,
  targetLanguage: string,
  options?: { sourceLanguage?: string; enabled?: boolean },
) {
  const sourceLanguage = options?.sourceLanguage || 'en';
  const enabled = options?.enabled ?? true;
  const [translatedContent, setTranslatedContent] = useState(content);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uniqueStrings = useMemo(() => Array.from(new Set(collectStrings(content))), [content]);

  useEffect(() => {
    let isMounted = true;

    if (!enabled || !targetLanguage || targetLanguage === sourceLanguage || uniqueStrings.length === 0) {
      setTranslatedContent(content);
      setIsLoading(false);
      setError(null);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);
    setError(null);

    bhashiniApi
      .translate({
        texts: uniqueStrings,
        sourceLanguage,
        targetLanguage,
      })
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const translations = new Map(
          uniqueStrings.map((source, index) => [source, response.translations[index] || source]),
        );
        setTranslatedContent(replaceStrings(content, translations));
      })
      .catch((err: Error) => {
        if (!isMounted) {
          return;
        }
        setTranslatedContent(content);
        setError(err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [content, enabled, sourceLanguage, targetLanguage, uniqueStrings]);

  return {
    content: translatedContent,
    isLoading,
    error,
  };
}
