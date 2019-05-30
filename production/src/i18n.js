import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import uaCommon from './locales/ua-UA/common';
import uaNotifications from './locales/ua-UA/notifications';
import enCommon from './locales/en-US/common';
import enNotifications from './locales/en-US/notifications';

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: {
        'ua-UA': {
          common: uaCommon,
          notifications: uaNotifications,
        },
        'en-US': {
          common: enCommon,
          notifications: enNotifications,
        },
      },
      saveMissing: true,
      saveMissingTo: 'all',
      lng: 'en-US',
      keySeparator: false, // we do not use keys in form messages.welcome

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      debug: process.env.NODE_ENV !== 'production',
    });

export default i18n;
