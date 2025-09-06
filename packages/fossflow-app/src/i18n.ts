import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en-US',
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false,
        },
        ns: ['app'],
        backend: {
            loadPath: './i18n/{{ns}}/{{lng}}.json'
        },
        detection: {
            // configure detection options
            order: ['navigator', 'htmlTag', 'querystring', 'cookie', 'localStorage'],
            caches: ['localStorage', 'cookie'],
        }
    });

export const supportedLanguages = [
    {
        label: 'English',
        value: 'en-US',
    },
    {
        label: '中文',
        value: 'zh-CN',
    },
];

export default i18n;