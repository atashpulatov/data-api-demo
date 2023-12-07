import i18n from './i18n';

/**
  * It gets the translation of the string for the currently used language
  * otherwise it will return the string for the fallback language
  * specified `fallbackLng` setting in the i18n configuration
  *
  * @param {String} str - String to be translated
  * @returns {String} Translation of the string for the currently used language
  */
export const customT = (str) => i18n.t(str);
