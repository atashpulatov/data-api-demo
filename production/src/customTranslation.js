import i18n from './i18n';

/**
  * It gets the translation of the string (if available)
  *
  * It is using the translation stored in json file from i18n
  * to get the translated version of the string for the currently used language
  *
  * @param {String} str - String to be translated
  * @returns {String} Translation of the string for the currently used language
  */
export const customT = (str) => i18n.t(str);
