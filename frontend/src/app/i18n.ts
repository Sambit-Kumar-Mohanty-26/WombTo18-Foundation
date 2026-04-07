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
import guHome from './locales/gu/home/translation.json';
import paHome from './locales/pa/home/translation.json';
import orHome from './locales/or/home/translation.json';

// Programs Page specific translations
import enPrograms from './locales/en/programs/translation.json';
import hiPrograms from './locales/hi/programs/translation.json';
import mrPrograms from './locales/mr/programs/translation.json';
import tePrograms from './locales/te/programs/translation.json';
import taPrograms from './locales/ta/programs/translation.json';
import knPrograms from './locales/kn/programs/translation.json';
import bnPrograms from './locales/bn/programs/translation.json';
import guPrograms from './locales/gu/programs/translation.json';
import paPrograms from './locales/pa/programs/translation.json';
import orPrograms from './locales/or/programs/translation.json';

// About Page specific translations
import enAbout from './locales/en/about/translation.json';
import hiAbout from './locales/hi/about/translation.json';
import mrAbout from './locales/mr/about/translation.json';
import teAbout from './locales/te/about/translation.json';
import taAbout from './locales/ta/about/translation.json';
import knAbout from './locales/kn/about/translation.json';
import bnAbout from './locales/bn/about/translation.json';
import guAbout from './locales/gu/about/translation.json';
import paAbout from './locales/pa/about/translation.json';
import orAbout from './locales/or/about/translation.json';

// Impact Page specific translations
import enImpact from './locales/en/impact/translation.json';
import hiImpact from './locales/hi/impact/translation.json';
import mrImpact from './locales/mr/impact/translation.json';
import teImpact from './locales/te/impact/translation.json';
import taImpact from './locales/ta/impact/translation.json';
import knImpact from './locales/kn/impact/translation.json';
import bnImpact from './locales/bn/impact/translation.json';
import guImpact from './locales/gu/impact/translation.json';
import paImpact from './locales/pa/impact/translation.json';
import orImpact from './locales/or/impact/translation.json';

// Transparency Page specific translations
import enTransparency from './locales/en/transparency/translation.json';
import hiTransparency from './locales/hi/transparency/translation.json';

// Donate Page specific translations
import enDonate from './locales/en/donate/translation.json';
import hiDonate from './locales/hi/donate/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation, home: enHome, about: enAbout, programs: enPrograms, impact: enImpact, transparency: enTransparency, donate: enDonate },
      hi: { translation: hiTranslation, home: hiHome, about: hiAbout, programs: hiPrograms, impact: hiImpact, transparency: hiTransparency, donate: hiDonate },
      mr: { translation: mrTranslation, home: mrHome, about: mrAbout, programs: mrPrograms, impact: mrImpact },
      te: { translation: teTranslation, home: teHome, about: teAbout, programs: tePrograms, impact: teImpact },
      ta: { translation: taTranslation, home: taHome, about: taAbout, programs: taPrograms, impact: taImpact },
      kn: { translation: knTranslation, home: knHome, about: knAbout, programs: knPrograms, impact: knImpact },
      bn: { translation: bnTranslation, home: bnHome, about: bnAbout, programs: bnPrograms, impact: bnImpact },
      gu: { translation: guTranslation, home: guHome, about: guAbout, programs: guPrograms, impact: guImpact },
      pa: { translation: paTranslation, home: paHome, about: paAbout, programs: paPrograms, impact: paImpact },
      or: { translation: orTranslation, home: orHome, about: orAbout, programs: orPrograms, impact: orImpact }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React is already safe from XSS
    }
  });

export default i18n;
