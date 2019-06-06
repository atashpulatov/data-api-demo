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

// TODO: Additional languages setup for moment;
moment.locale('en', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse : /PD|MD/,
    isPM : function (input) {
        return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // Used to determine first week of the year.
    }
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
