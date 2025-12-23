import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Ensure PUBLIC_URL ends with slash for consistent path construction
const publicUrl = process.env.PUBLIC_URL || '';
const basePath = publicUrl ? (publicUrl.endsWith('/') ? publicUrl : publicUrl + '/') : '/';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    ns: ['app'],
    backend: {
      loadPath: `${basePath}i18n/{{ns}}/{{lng}}.json`
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage']
    }
  });

export const supportedLanguages = [
  {
    label: 'English',
    value: 'en-US'
  },
  {
    label: '中文',
    value: 'zh-CN'
  },
  {
    label: 'Español',
    value: 'es-ES'
  },
  {
    label: 'Português',
    value: 'pt-BR'
  },
  {
    label: 'Français',
    value: 'fr-FR'
  },
  {
    label: 'हिन्दी',
    value: 'hi-IN'
  },
  {
    label: 'বাংলা',
    value: 'bn-BD'
  },
  {
    label: 'Русский',
    value: 'ru-RU'
  },
  {
    label: 'Italian',
    value: 'it-IT'
  },
  {
    label: 'Bahasa Indonesia',
    value: 'id-ID'
  }
];

export default i18n;
