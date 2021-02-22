import 'core-js';
import 'whatwg-fetch';

const Office = window.Office;
const OFFICE_PRIVILEGE_ID = '273';
const DssXmlApplicationMicrosoftOffice = '47';
const QUERY = `source=addin-mstr-office&applicationType=${DssXmlApplicationMicrosoftOffice}`;
const libraryUrl = getLibraryUrl();
let popup = null;

function officeInitialize() {
  Office.onReady()
    .then(() => {
      translate();
      if (window.location.protocol !== 'https:') {
        return window.location.replace(encodeURI(`${libraryUrl}/static/loader-mstr-office/no-https-connection.html`));
      }
      if (!canSaveCookies() || !storageAvailable('localStorage')) {
        //TODO: We may need to update the warning to include local storage
        showCookieWarning();
      } else {
        startAuthentication();
      }
    });
}

function startAuthentication() {
  verifyToken()
    .then((isValid) => {
      if (isValid) {
        goToReact(libraryUrl);
      } else {
        showLoginBtn();
        removeStorageItem();
        logout();
      }
    })
    .catch((e) => {
      console.log(e);
      removeStorageItem();
      showLoginBtn();
    });
}

function onLoginClick() {
  openAuthDialog();
}

function goToReact(url) {
  try {
    if (popup) { popup.close(); }
  } finally {
    window.location.replace(`${url}/apps/addin-mstr-office/index.html?${QUERY}`);
  }
}

function getLibraryUrl() {
  const currentPath = window.location.href;
  return currentPath.split('/static/')[0];

}

function verifyToken() {
  const url = `${libraryUrl}/api/sessions/privileges/${OFFICE_PRIVILEGE_ID}`;
  const token = getStorageItem();
  const headers = { 'X-MSTR-AuthToken': token };
  return fetch(url, { credentials: 'include', headers })
    .then(({ ok, status }) => {
      if (ok) {
        // All good
        return true
      } else if (status === 403) {
        // No privileges
        logout().finally(() => {
          const locale = Office.context.displayLanguage || navigator.language;
          window.location.replace(`${libraryUrl}/static/loader-mstr-office/no-privilege.html?locale=${locale}`);
        });
      }
      // Not valid token
      return false
    })
}

function logout() {
  const url = libraryUrl + '/api/auth/logout';
  const token = getStorageItem();
  removeStorageItem();
  const headers = { 'X-MSTR-AuthToken': token };
  return fetch(url, { method: 'POST', credentials: 'include', headers });
}

function openAuthDialog() {
  const popupUrl = encodeURI(`${libraryUrl}/apps/addin-mstr-office/auth/office-add-in.jsp?${QUERY}`);
  const isOfficeOnline = Office.context ? Office.context.platform === Office.PlatformType.OfficeOnline : false;
  const openDialog = isOfficeOnline ? openPopup : openOfficeDialog;
  openDialog(popupUrl, onMessageReceived);
}

function onMessageReceived(payload) {
  popup.close();
  setStorageItem(payload);
  setExcelSettingItem(payload);
  startAuthentication();
}

function openPopup(url, callback) {
  if (popup === null || popup.closed) {
    const height = 650;
    const width = 400;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    popup = window.open(url, 'MicroStrategy_for_Office', `resizable=1,status=1,height=${height},width=${width},top=${top},left=${left},screenX=${left},screenY=${top}location=0,dependent=1,alwaysOnTop=1`);
    const onMessage = (event) => {
      const { type, payload } = event.data || {};
      if (type === 'auth-token' && payload) {
        console.log('Received payload from child window.');
        window.removeEventListener('message', onMessage);
        callback(payload)
      }
    }
    window.addEventListener('message', onMessage);
  } else {
    popup.focus();
  };
}

function openOfficeDialog(url, callback) {
  if (popup != null && popup.closed === false) {
    // if window was already displayed we close it, and open it once again, 
    // because DialogHandler from office doesn't provide refresh or focus methods.
    popup.close();
  }

  Office.context.ui.displayDialogAsync(url, { height: 75, width: 25 }, (asyncResult) => {
    const { error, value } = asyncResult || {};
    if (value) {
      popup = value;
      popup.closed = false;
      const onMessageReceived = (event) => {
        const { message } = event || {};
        if (message && typeof message === 'string') {
          const { type, payload } = JSON.parse(message);
          if (type === 'auth-token' && payload) {
            console.log('Received payload from Office dialog');
            callback(payload);
          }
        }
      }
      popup.addEventHandler(Office.EventType.DialogEventReceived, processDialogEvent);
      popup.addEventHandler(Office.EventType.DialogMessageReceived, onMessageReceived);
    } else {
      console.log(error);
    }
  }
  );
}

function processDialogEvent(arg) {
  switch (arg.error) {
    case 12002:
      console.log('The dialog box has been directed to a page that it cannot find or load, or the URL syntax is invalid.');
      break;
    case 12003:
      console.log('The dialog box has been directed to a URL with the HTTP protocol. HTTPS is required.');
      break;
    case 12006:
      console.log('Dialog closed by user.');
      popup.closed = true;
      break;
    default:
      console.log('Unknown error in dialog box.');
      break;
  }
}

function getStorageItem(key = 'iSession') {
  return window.localStorage.getItem(key) || getExcelSettingValue(key);
}
function setStorageItem(value, key = 'iSession') {
  window.localStorage.setItem(key, value);
}
function removeStorageItem(key = 'iSession') {
  window.localStorage.removeItem(key);
}
function getExcelSettingValue(key) {
  if (Office && Office.context && Office.context.document && Office.context.document.settings){
    return Office.context.document.settings.get(key);
  }
};
function setExcelSettingItem(value, key = 'iSession') {
  try {
    Office.context.document.settings.set(key, value);
    settings.saveAsync((saveAsync) => console.log(`Saving Excel settings ${saveAsync.status}`));
  } catch (error) {
    console.log('Cannot save value in Excel settings');
  }
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
  /* Remove the focus around button after the button is clicked by mouse. Focus was displayed by default.
  We're keeping the default behavior for keyboard-based interactions like click. */
  document.getElementById('login-btn').addEventListener('mousedown', (function (e) { e.preventDefault(); }));
}


function canSaveCookies() {
  const TEMP_COOKIE = 'content_security_check=true';
  try {
    document.cookie = `${TEMP_COOKIE}; SameSite=None; Secure';`;
    return document.cookie.indexOf(TEMP_COOKIE) !== -1;
  } catch (e) {
    return false;
  }
}

function acceptCookies() {
  window.open('cookie-helper.html', 'mstr_helper', "width=1px,height=1px");
}

function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch (e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0);
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
