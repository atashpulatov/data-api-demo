import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import uaCommon from './locales/ua/common';
import uaNotifications from './locales/ua/notifications';
import enCommon from './locales/en/common';
import enNotifications from './locales/en/notifications';


i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: {
        ua: {
          common: uaCommon,
          notifications: uaNotifications,
        },
        en: {
          common: enCommon,
          notifications: enNotifications,
        },
      },
      saveMissing: true,
      saveMissingTo: 'all',
      lng: 'en',
      keySeparator: false, // we do not use keys in form messages.welcome

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      debug: process.env.NODE_ENV !== 'production',
    });

export default i18n;
