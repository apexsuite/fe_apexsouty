import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import tr from './tr/translation.json';
import en from './en/translation.json';

const getInitialLang = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  try {
    return localStorage.getItem('lang') || 'en';
  } catch {
    return 'en';
  }
};

const resources = {
  en: {
    translation: en
  },
  tr: {
    translation: tr
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLang(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
