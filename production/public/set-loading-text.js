function setLoadingText() {
  const loadingTranslations = {
    'en-US': 'Loading...',
    'de-DE': 'Ladevorgang läuft...',
    'fr-FR': 'Chargement...',
    'it-IT': 'Caricamento in corso...',
    'es-ES': 'Cargando...',
    'zh-CN': '正在加载...',
    'zh-TW': '載入中...',
    'ko-KR': '로딩 중...',
    'pt-BR': 'Carregando...',
    'nl-NL': 'Laden...',
    'sv-SE': 'Läser in...',
    'ja-JP': 'ロード中...',
    'da-DK': 'Indlæser...',
  };

  try {
    const locale = Office.context.displayLanguage;
    if (loadingTranslations[locale]) {
      // eslint-disable-next-line no-undef
      loadingSpan.innerText = loadingTranslations[locale];
    }
  } catch (e) {
    /* empty */
  }
}

Office.onReady(() => {
  setLoadingText();
});
