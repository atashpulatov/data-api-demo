const Office = window.Office;

function officeInitialize() {
  Office.onReady()
    .then(() => {
      translate();
      if (canSaveCookies()) {
        const currentPath = window.location.pathname;
        const pathBeginning = currentPath.split('/static/')[0];
        const loginParams = 'source=addin-mstr-office';
        window.location.replace(`${pathBeginning}/apps/addin-mstr-office/index.html?${loginParams}`);
      } else {
        document.getElementById('cookies-not-needed').style.display = 'none';
        document.getElementById('cookies-needed').style.display = 'block';
        document.getElementById('accept-cookies-btn').addEventListener('click', acceptCookies);
      }
    });
}

function canSaveCookies() {
  const TEMP_COOKIE = 'content_security_check=true';
  try {
    document.cookie = TEMP_COOKIE;
    return document.cookie.indexOf(TEMP_COOKIE) !== -1;
  } catch {
    return false;
  }
}

function translate() {
  const cookiesNotNeededTranslations = {
    'en-US': 'Loading...',
    'de-DE': 'Ladevorgang läuft...',
    'zh-CN': '正在加载...',
    'es-ES': 'Cargando...',
    'fr-FR': 'Chargement...',
    'it-IT': 'Caricamento in corso...',
    'zh-TW': '載入中...',
    'ko-KR': '로딩 중...',
    'pt-BR': 'Carregando...',
    'nl-NL': 'Laden...',
    'sv-SE': 'Läser in ...',
    'ja-JP': 'ロード中...',
    'da-DK': 'Indlæser...'
  }
  const noCookiesTranslations = {
    'en-US': 'Please enable cookies to start using the add-in',
    'de-DE': 'Aktivieren Sie Cookies, um das Add-in zu verwenden',
    'zh-CN': '请启用 Cookies 以使用加载项',
    'es-ES': 'Habilite las cookies para empezar a usar el complemento',
    'fr-FR': 'Veuillez activer les cookies pour pouvoir utiliser le complément',
    'it-IT': 'Per cominciare a utilizzare il componente aggiuntivo è necessario abilitare i cookie',
    'zh-TW': '請啟用 Cookie 以開始使用增益集',
    'ko-KR': '추가 기능을 사용하려면 쿠키를 활성화하십시오',
    'pt-BR': 'Ative os cookies para começar a usar o suplemento',
    'nl-NL': 'Schakel cookies in om de invoegtoepassing te gebruiken',
    'sv-SE': 'Aktivera cookies för att börja använda tillägget',
    'ja-JP': 'アドインを使用するには cookie を有効にする必要があります',
    'da-DK': 'Aktivér cookies for at starte denne add-in'
  }
  const enableButtonTranslations = {
    'en-US': 'Enable',
    'de-DE': 'Aktivieren',
    'zh-CN': '启用',
    'es-ES': 'Habilitar',
    'fr-FR': 'Activer',
    'it-IT': 'Abilita',
    'zh-TW': '啟用',
    'ko-KR': '활성화',
    'pt-BR': 'Permitir',
    'nl-NL': 'Inschakelen',
    'sv-SE': 'Aktivera',
    'ja-JP': '有効化',
    'da-DK': 'Aktiver'
  }
  try {
    const locale = Office.context.displayLanguage || navigator.language;

    if (!!cookiesNotNeededTranslations[locale]) {
      const cookiedNotNeededHeader = document.getElementById('cookies-not-needed');
      const cookiedAreNeededHeader = document.getElementById('cookies-are-needed-header');
      const cookiedAcceptButton = document.getElementById('accept-cookies-btn');
      cookiedNotNeededHeader.innerText = cookiesNotNeededTranslations[locale];
      cookiedAreNeededHeader.innerText = noCookiesTranslations[locale];
      cookiedAcceptButton.innerText = enableButtonTranslations[locale];
    };
  } catch (e) {console.log(e)}
}

function acceptCookies() {
  window.open('cookie-helper.html', 'mstr_helper', "width=1px,height=1px");
}

officeInitialize();
