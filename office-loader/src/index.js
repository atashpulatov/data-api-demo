import 'core-js';
import 'whatwg-fetch';

const Office = window.Office;
const OFFICE_PRIVILEGE_ID = '273';
const libraryUrl = getLibraryUrl();
let popup = null;

function officeInitialize() {
    Office.onReady()
        .then(() => {
            translate();
            if (window.location.protocol !== 'https:') {
                return window.location.replace(`${libraryUrl}/static/loader-mstr-office/no-https-connection.html`);
            }
            if (!canSaveCookies()) {
                showCookieWarning();
            } else {
                startAuthentication();
            }
        });
}

function startAuthentication() {
    verifyToken(libraryUrl).then(({ ok }) => {
        if (ok) {
            goToReact(libraryUrl);
        }
        else {
            showLoginBtn();
        }
    }).catch((e) => {
        console.log(e);
        showLoginBtn();
    });
}

function onLoginClick() {
    openAuthDialog(libraryUrl);
    verifyToken(libraryUrl)
        .then(({ ok }) => ok && goToReact(libraryUrl))
        .catch((e) => console.log(e))
}

function goToReact(url) {
    const loginParams = 'source=addin-mstr-office';
    try {
        popup && popup.close();
    } finally {
        window.location.replace(`${url}/apps/addin-mstr-office/index.html?${loginParams}`);
    }
}

function getLibraryUrl() {
    const currentPath = window.location.href;
    return currentPath.split('/static/')[0];

}

function verifyToken(libraryUrl) {
    const url = libraryUrl + '/api/sessions/privileges/' + OFFICE_PRIVILEGE_ID;
    const token = getCookie(window);
    const headers = { 'X-MSTR-AuthToken': token };
    return fetch(url, { credentials: 'include', headers });
}

function logout(libraryUrl) {
    const url = libraryUrl + '/api/auth/logout';
    const token = getCookie(window);
    const headers = { 'X-MSTR-AuthToken': token };
    return fetch(url, { method: 'POST', credentials: 'include', headers });
}

function openAuthDialog(url) {
    const popupUrl = `${url}/apps/addin-mstr-office/auth.html?source=addin-mstr-office`;
    const isOfficeOnline = Office.context ? Office.context.platform === Office.PlatformType.OfficeOnline : false;
    const popupPromise = isOfficeOnline ? openPopup : openOfficeDialog;
    const currentUuid = window.localStorage.getItem('uuid');
    const listenAuthToken = () => {
        verifyToken(url).then(({ ok, status }) => {
            if (ok) {
                popup.close();
                goToReact(url);
            } else if (status === 403 && getCookie(window) !== currentUuid) {
                popup.close();
                logout(url).finally(() => {
                    const locale = Office.context.displayLanguage || navigator.language;
                    window.location.replace(`${url}/static/loader-mstr-office/no-privilege.html?locale=${locale}`);
                });
            } else {
                if (!popup.closed)setTimeout(listenAuthToken, 1000)
            }
        }).catch((e) => {
            console.log(e);
            popup.close();
        }).finally(() => {
            window.localStorage.setItem('uuid', getCookie(window));
        });
    }
    popupPromise(popupUrl).then(() => {
        listenAuthToken();
    }).catch((error) => {
        console.log(error);
    });
}

function openPopup(url) {
    if (popup === null || popup.closed) {
        const height = 650;
        const width = 400;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        popup = window.open(url, 'MicroStrategy_for_Office', `resizable=1,status=1,height=${height},width=${width},top=${top},left=${left},screenX=${left},screenY=${top}location=0,dependent=1,alwaysOnTop=1`);
        return Promise.resolve(popup);
    } else {
        return Promise.resolve(popup.focus());
    };
}

function openOfficeDialog(url) {
    if (popup != null && popup.closed === false) {
        /* if window was already displayed we close it, and open it once again, becouse DialogHandler from office doesn't provide refresh or focus methods. */
        Promise.resolve(popup.close());
    }

    return new Promise((resolve) => {
        Office.context.ui.displayDialogAsync(url, { height: 75, width: 25 },
            function (asyncResult) {
                popup = asyncResult.value;
                popup.addEventHandler(Office.EventType.DialogEventReceived, processDialogEvent);
                popup.closed = false;
                resolve();
            }
        );
    });
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
    /* Remove the focus around button after the button is clicked by mouse. Focus was displayed by default.
    We're keeping the default behavior for keyboard-based interactions like click. */
    document.getElementById('login-btn').addEventListener('mousedown', (function (e) { e.preventDefault(); }));
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
