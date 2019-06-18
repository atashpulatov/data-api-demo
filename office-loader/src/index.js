const Office = window.Office;
const OFFICE_PRIVILEGE_ID = '273';
const libraryUrl = getLibraryUrl();
let popup = null;

function officeInitialize() {
  Office.onReady()
    .then(() => {
      translate();
      return canSaveCookies() ? startAuthentication() : showCookieWarning();
    });
}

function startAuthentication() {
  verifyToken(libraryUrl)
    .then(valid => valid ? goToReact(libraryUrl) : showLoginBtn())
    .catch((e) => console.log(e) || showLoginBtn());
}

function onLoginClick() {
  verifyToken(libraryUrl)
    .then((valid) => valid ? goToReact(libraryUrl) : openAuthDialog(libraryUrl))
    .catch((e) => console.log(e) || openAuthDialog(libraryUrl))
}

function goToReact(url) {
  const loginParams = 'source=addin-mstr-office';
  window.location.replace(`${url}/apps/addin-mstr-office/index.html?${loginParams}`);
}

function getLibraryUrl() {
  const currentPath = window.location.href;
  return currentPath.split('/static/')[0];

}

function verifyToken(libraryUrl) {
  const url = libraryUrl + '/api/sessions/privileges/' + OFFICE_PRIVILEGE_ID;
  const token = getCookie(window);
  const headers = {'X-MSTR-AuthToken': token};
  return fetch(url, {credentials: 'include', headers});
}

function openAuthDialog(url) {
  const popupUrl = `${url}/apps/addin-mstr-office/index.html?source=addin-mstr-office`;
  openPopup(popupUrl);
  const listenAuthToken = () => {
    verifyToken(url).then((res) => {
      if (res.ok) {
        popup.close();
        goToReact(url);
      } else {
        !popup.closed && setTimeout(listenAuthToken, 2000)
      }
    }).catch((e) => console.log(e) || popup.close());
  }
  listenAuthToken();
}

function openPopup(url) {
  if (popup === null || popup.closed) {
    popup = window.open(url, 'MicroStrategy_for_Office', 'resizable=1,status=1,height=600,width=400,location=0,chrome=1,centerscreen=1,dependent=1,minimizable=0,alwaysRaised=1,alwaysOnTop=1');
  } else {
    popup.focus();
  };
}

function getCookie(win) {
  return win.document.cookie.replace(/(?:(?:^|.*;\s*)iSession\s*=\s*([^;]*).*$)|^.*$/, '$1');
}

function showCookieWarning() {
  document.getElementById('cookies-not-needed').style.display = 'none';
  document.getElementById('cookies-needed').style.display = 'block';
  document.getElementById('accept-cookies-btn').addEventListener('click', acceptCookies);
}

function showLoginBtn() {
  document.getElementById('cookies-not-needed').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
  document.getElementById('login-btn').addEventListener('click', onLoginClick);
}

function canSaveCookies() {
  const TEMP_COOKIE = 'content_security_check=true';
  try {
    document.cookie = TEMP_COOKIE;
    return document.cookie.indexOf(TEMP_COOKIE) !== -1;
  } catch (e) {
    return false;
  }
}

function acceptCookies() {
  window.open('cookie-helper.html', 'mstr_helper', "width=1px,height=1px");
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
  var loginTranslations = {
    'en-US': 'Log in',
    'de-DE': 'Anmelden',
    'zh-CN': '登录',
    'es-ES': 'Iniciar sesión',
    'fr-FR': 'Connexion',
    'it-IT': 'Accedi',
    'zh-TW': '登入',
    'ko-KR': '로그인',
    'pt-BR': 'Fazer login',
    'nl-NL': 'Inloggen',
    'sv-SE': 'Logga in',
    'ja-JP': 'ログイン',
    'da-DK': 'Log på'
  }

  try {
    const locale = Office.context.displayLanguage || navigator.language;
    if (!!cookiesNotNeededTranslations[locale]) {
      noCookiesHeader.innerText = noCookiesTranslations[locale];
      enableSpan.innerText = enableButtonTranslations[locale];
      loadingSpan.innerText = cookiesNotNeededTranslations[locale];
      loginSpan.innerText = loginTranslations[locale];
    };
  } catch (e) {
    console.log(e)
  }
}

officeInitialize();
