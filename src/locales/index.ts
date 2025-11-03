import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import tr from './tr/translation.json';
import en from './en/translation.json';
import { isClient } from '@/utils/helpers/common';
import { Language } from '@/utils/enums/Language';

const getInitialLang = () => {
  if (!isClient) return Language.English;

  try {
    return localStorage.getItem('lang') || Language.English;
  } catch {
    return Language.English;
  }
};

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLang(),
  fallbackLng: Language.English,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
