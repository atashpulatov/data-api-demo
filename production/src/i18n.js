import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';
import enCommon from './locales/en-US';
import deCommon from './locales/de-DE';
import zhCNCommon from './locales/zh-CN';
import frCommon from './locales/fr-FR';
import itCommon from './locales/it-IT';
import esCommon from './locales/es-ES';
import zhTWCommon from './locales/zh-TW';
import koCommon from './locales/ko-KR';
import ptCommon from './locales/pt-BR';
import nlCommon from './locales/nl-NL';
import svCommon from './locales/sv-SE';
import jaCommon from './locales/ja-JP';
import daCommon from './locales/da-DK';

enCommon.refreshed_date = '{{date, YYYY-MM-DD H:mm}}';
deCommon.refreshed_date = '{{date, DD.MM.YYYY HH:mm:ss}}';
zhCNCommon.refreshed_date = '{{date, YY-M-D ah:mm}}';
frCommon.refreshed_date = '{{date, DD/MM/YY HH:mm}}';
itCommon.refreshed_date = '{{date, DD/MM/YY HH.mm}}';
esCommon.refreshed_date = '{{date, DD/MM/YYYY HH:mm:ss}}';
zhTWCommon.refreshed_date = '{{date, YYYY/M/D ah:mm}}';
koCommon.refreshed_date = '{{date, YY. M. D. a h:mm}}';
ptCommon.refreshed_date = '{{date, DD/MM/YYYY HH:mm:ss}}';
nlCommon.refreshed_date = '{{date, DD-MM-YY HH:mm}}';
svCommon.refreshed_date = '{{date, YYYY-MM-DD HH.mm}}';
jaCommon.refreshed_date = '{{date, YY/MM/DD H:mm}}';
daCommon.refreshed_date = '{{date, DD/MM/YYYY HH.mm.ss}}';

moment.locale('ko-KR', {
  meridiem(hours, minutes, isLowercase) {
    return hours < 12 ? '오전' : '오후';
  },
});
moment.locale('zh-CN', {
  meridiem(hour, minute, isLowercase) {
    if (hour < 9) {
      return '早上';
    } if (hour < 11 && minute < 30) {
      return '上午';
    } if (hour < 13 && minute < 30) {
      return '中午';
    } if (hour < 18) {
      return '下午';
    }
    return '晚上';
  },
});
moment.locale('zh-TW', {
  meridiem(hour, minute, isLowercase) {
    if (hour < 9) {
      return '早上';
    } if (hour < 11 && minute < 30) {
      return '上午';
    } if (hour < 13 && minute < 30) {
      return '中午';
    } if (hour < 18) {
      return '下午';
    }
    return '晚上';
  },
});

const config = {
  resources: {
    'en-US': { common: enCommon, },
    'de-DE': { common: deCommon, },
    'zh-CN': { common: zhCNCommon, },
    'fr-FR': { common: frCommon, },
    'es-ES': { common: esCommon, },
    'it-IT': { common: itCommon, },
    'zh-TW': { common: zhTWCommon, },
    'ko-KR': { common: koCommon, },
    'pt-BR': { common: ptCommon, },
    'nl-NL': { common: nlCommon, },
    'sv-SE': { common: svCommon, },
    'ja-JP': { common: jaCommon, },
    'da-DK': { common: daCommon, },
  },
  lng: 'en-US',
  fallbackLng: 'en-US',
  load: 'all',
  keySeparator: false, // we do not use keys in form messages.welcome

  interpolation: {
    escapeValue: false, // react already safes from xss
    format(value, format, lng) {
      if (value instanceof Date) { return moment(value).format(format); }
      return value;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

if (process.env.NODE_ENV === 'development') {
  config.backend = { addPath: 'https://10.23.6.59/office' };
  config.saveMissing = true;
  config.saveMissingTo = 'en-US';
  i18n.use(XHR);
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(config);

i18n.on('languageChanged', (lng) => moment.locale(lng));

export default i18n;
