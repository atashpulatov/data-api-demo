import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import moment from 'moment';
import enCommon from './locales/en-US/common';
import deCommon from './locales/de-DE/common';
import zhCNCommon from './locales/zh-CN/common';
import frCommon from './locales/fr-FR/common';
import itCommon from './locales/it-IT/common';
import esCommon from './locales/es-ES/common';
import zhTWCommon from './locales/zh-TW/common';
import koCommon from './locales/ko-KR/common';
import ptCommon from './locales/pt-BR/common';
import nlCommon from './locales/nl-NL/common';
import svCommon from './locales/sv-SE/common';
import jaCommon from './locales/ja-JP/common';
import daCommon from './locales/da-DK/common';

moment.locale('ko-KR', {
  meridiem: function(hours, minutes, isLowercase) {
    return hours < 12 ? '오전' : '오후';
  },
});
moment.locale('zh-CN', {
  meridiem: function(hour, minute, isLowercase) {
    if (hour < 9) {
      return '早上';
    } else if (hour < 11 && minute < 30) {
      return '上午';
    } else if (hour < 13 && minute < 30) {
      return '中午';
    } else if (hour < 18) {
      return '下午';
    } else {
      return '晚上';
    }
  },
});
moment.locale('zh-TW', {
  meridiem: function(hour, minute, isLowercase) {
    if (hour < 9) {
      return '早上';
    } else if (hour < 11 && minute < 30) {
      return '上午';
    } else if (hour < 13 && minute < 30) {
      return '中午';
    } else if (hour < 18) {
      return '下午';
    } else {
      return '晚上';
    }
  },
});

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: {
        'en-US': {
          common: enCommon,
        },
        'de-DE': {
          common: deCommon,
        },
        'zh-CN': {
          common: zhCNCommon,
        },
        'fr-FR': {
          common: frCommon,
        },
        'es-ES': {
          common: esCommon,
        },
        'it-IT': {
          common: itCommon,
        },
        'zh-TW': {
          common: zhTWCommon,
        },
        'ko-KR': {
          common: koCommon,
        },
        'pt-BR': {
          common: ptCommon,
        },
        'nl-NL': {
          common: nlCommon,
        },
        'sv-SE': {
          common: svCommon,
        },
        'ja-JP': {
          common: jaCommon,
        },
        'da-DK': {
          common: daCommon,
        },
      },
      saveMissing: true,
      saveMissingTo: 'all',
      lng: 'en-US',
      fallbackLng: 'en-US',
      load: 'all',
      keySeparator: false, // we do not use keys in form messages.welcome

      interpolation: {
        escapeValue: false, // react already safes from xss
        format: function(value, format, lng) {
          if (value instanceof Date) return moment(value).format(format);
          return value;
        },
      },
      debug: process.env.NODE_ENV !== 'production',
    });

i18n.on('languageChanged', (lng) => moment.locale(lng));

export default i18n;
