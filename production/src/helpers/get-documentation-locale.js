const documentationLanguages = {
  da: 'en-us',
  de: 'de',
  en: 'en-us',
  es: 'es-es',
  fr: 'fr',
  it: 'it',
  ja: 'ja',
  ko: 'ko',
  nl: 'en-us',
  pl: 'en-us',
  pt: 'pt-br',
  sv: 'en-us',
  zh: 'zh-cn',
};

const languageString = (languageCode = 'en') => {
  const shortCode = languageCode.substring(0, 2).toLowerCase();
  return documentationLanguages[shortCode] || 'en-us';
};

export default languageString;
