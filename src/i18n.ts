import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation from './locales/ptbr/translation.json';
import loginPage from './locales/ptbr/loginPage.json';

export const resources = {
  ptbr: {
    translation,
    loginPage,
  },
} as const;

i18n
  .use(initReactI18next)
  .init({
    lng: 'ptbr',
    ns: ['translation', 'loginPage'],
    resources,
    fallbackLng: 'ptbr', // use en if detected lng is not available
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    debug: true,
  });

export default i18n;
