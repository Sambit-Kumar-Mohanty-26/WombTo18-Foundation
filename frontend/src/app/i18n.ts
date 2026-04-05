import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';
import mrTranslation from './locales/mr/translation.json';
import teTranslation from './locales/te/translation.json';
import taTranslation from './locales/ta/translation.json';
import knTranslation from './locales/kn/translation.json';
import bnTranslation from './locales/bn/translation.json';
import guTranslation from './locales/gu/translation.json';
import paTranslation from './locales/pa/translation.json';
import orTranslation from './locales/or/translation.json';

// Home Page specific translations
import enHome from './locales/en/home/translation.json';
import hiHome from './locales/hi/home/translation.json';
import mrHome from './locales/mr/home/translation.json';
import teHome from './locales/te/home/translation.json';
import taHome from './locales/ta/home/translation.json';
import knHome from './locales/kn/home/translation.json';
import bnHome from './locales/bn/home/translation.json';
import enAbout from './locales/en/about/translation.json';
import hiAbout from './locales/hi/about/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation, home: enHome, about: enAbout },
      hi: { translation: hiTranslation, home: hiHome, about: hiAbout },
      mr: { translation: mrTranslation, home: mrHome },
      te: { translation: teTranslation, home: teHome },
      ta: { translation: taTranslation, home: taHome },
      kn: { translation: knTranslation, home: knHome },
      bn: { translation: bnTranslation, home: bnHome },
      //gu: { translation: guTranslation, home: guHome },
      //pa: { translation: paTranslation, home: paHome },
      //or: { translation: orTranslation, home: orHome }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React is already safe from XSS
    }
  });

export default i18n;
