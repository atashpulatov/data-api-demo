/* eslint-disable camelcase */
import { initReactI18next } from 'react-i18next';
import { changeConnectorLanguage } from '@mstr/connector-components';
import { RC } from '@mstr/rc';
import i18n from 'i18next';
import moment from 'moment';

import daCommon from './locales/da-DK.json';
import deCommon from './locales/de-DE.json';
import enGBCommon from './locales/en-GB.json';
import enUSCommon from './locales/en-US.json';
import esCommon from './locales/es-ES.json';
import frCommon from './locales/fr-FR.json';
import itCommon from './locales/it-IT.json';
import jaCommon from './locales/ja-JP.json';
import koCommon from './locales/ko-KR.json';
import nlCommon from './locales/nl-NL.json';
import plCommon from './locales/pl-PL.json';
import ptCommon from './locales/pt-BR.json';
import svCommon from './locales/sv-SE.json';
import zhCNCommon from './locales/zh-CN.json';
import zhTWCommon from './locales/zh-TW.json';

enUSCommon.refreshed_date = '{{date, YYYY-MM-DD H:mm}}';
enGBCommon.refreshed_date = '{{date, YYYY-MM-DD H:mm}}';
deCommon.refreshed_date = '{{date, DD.MM.YYYY HH:mm:ss}}';
zhCNCommon.refreshed_date = '{{date, YY-M-D ah:mm}}';
frCommon.refreshed_date = '{{date, DD/MM/YY HH:mm}}';
itCommon.refreshed_date = '{{date, DD/MM/YY HH.mm}}';
esCommon.refreshed_date = '{{date, DD/MM/YYYY HH:mm:ss}}';
zhTWCommon.refreshed_date = '{{date, YYYY/M/D ah:mm}}';
koCommon.refreshed_date = '{{date, YY. M. D. a h:mm}}';
plCommon.refreshed_date = '{{date, DD.MM.YYYY HH:mm:ss}}';
ptCommon.refreshed_date = '{{date, DD/MM/YYYY HH:mm:ss}}';
nlCommon.refreshed_date = '{{date, DD-MM-YY HH:mm}}';
svCommon.refreshed_date = '{{date, YYYY-MM-DD HH.mm}}';
jaCommon.refreshed_date = '{{date, YY/MM/DD H:mm}}';
daCommon.refreshed_date = '{{date, DD/MM/YYYY HH.mm.ss}}';

moment.locale('ko-KR', {
  meridiem(hours) {
    return hours < 12 ? '오전' : '오후';
  },
});
moment.locale('zh-CN', {
  meridiem(hour, minute) {
    if (hour < 9) {
      return '早上';
    }
    if (hour < 11 && minute < 30) {
      return '上午';
    }
    if (hour < 13 && minute < 30) {
      return '中午';
    }
    if (hour < 18) {
      return '下午';
    }
    return '晚上';
  },
});
moment.locale('zh-TW', {
  meridiem(hour, minute) {
    if (hour < 9) {
      return '早上';
    }
    if (hour < 11 && minute < 30) {
      return '上午';
    }
    if (hour < 13 && minute < 30) {
      return '中午';
    }
    if (hour < 18) {
      return '下午';
    }
    return '晚上';
  },
});

const config = {
  resources: {
    'en-US': { common: enUSCommon },
    'en-GB': { common: enGBCommon },
    'de-DE': { common: deCommon },
    'zh-CN': { common: zhCNCommon },
    'fr-FR': { common: frCommon },
    'es-ES': { common: esCommon },
    'it-IT': { common: itCommon },
    'zh-TW': { common: zhTWCommon },
    'ko-KR': { common: koCommon },
    'pl-PL': { common: plCommon },
    'pt-BR': { common: ptCommon },
    'nl-NL': { common: nlCommon },
    'sv-SE': { common: svCommon },
    'ja-JP': { common: jaCommon },
    'da-DK': { common: daCommon },
  },
  lng: 'en-US',
  fallbackLng: 'en-US',
  load: 'all',
  keySeparator: false, // we do not use keys in form messages.welcome
  defaultNS: 'common',
  fallbackNS: 'common',
  interpolation: {
    escapeValue: false, // react already safes from xss
    format(value, format) {
      if (value instanceof Date) {
        return moment(value).format(format);
      }
      return value;
    },
  },
};

const mapLanguageToLocale = {
  'en-US': 'en-US',
  'en-GB': 'en-GB',
  'de-DE': 'de',
  'zh-CN': 'zh-CN',
  'fr-FR': 'fr',
  'es-ES': 'es',
  'it-IT': 'it',
  'zh-TW': 'zh-TW',
  'ko-KR': 'ko',
  'pl-PL': 'pl',
  'pt-BR': 'pt',
  'nl-NL': 'nl',
  'sv-SE': 'sv',
  'ja-JP': 'ja',
  'da-DK': 'da',
};

i18n.on('languageChanged', lng => {
  RC.changeLanguage(mapLanguageToLocale[lng]);
  changeConnectorLanguage(mapLanguageToLocale[lng]);
  moment.locale(lng);
});

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(config);

export default i18n;
