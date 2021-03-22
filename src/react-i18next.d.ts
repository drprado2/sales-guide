// import the original type declarations
import 'react-i18next';
// import all namespaces (for the default language, only)
import translation from './locales/ptbr/translation.json';
import loginPage from './locales/ptbr/loginPage.json';

declare module 'react-i18next' {
  // and extend them!
  interface Resources {
    translation: typeof translation;
    loginPage: typeof loginPage;
  }
}
