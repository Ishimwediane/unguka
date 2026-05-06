import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  rw: {
    translation: {
      subtitle: 'Sogongeza umusaruro wawe'
    }
  },
  en: {
    translation: {
      subtitle: 'Maximize Your Harvest'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'rw',
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;