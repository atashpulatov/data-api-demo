const Office = window.Office;
const OFFICE_PRIVILEGE_ID = '273';
const libraryUrl = getLibraryUrl();
let popup = null;

function officeInitialize() {
  Office.onReady()
    .then(() => {
      if (!canSaveCookies()) {
        showCookieWarning();
      } else {
        startAuthentication();
      }
    });
}

function startAuthentication() {
  verifyToken(libraryUrl).then(valid => {
    if (valid) {
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
  const headers = {
    'X-MSTR-AuthToken': token
  };
  return fetch(url, {credentials: 'include', headers}).then((res) => res.ok);
}

function openAuthDialog(url) {
  const popupUrl = `${url}/apps/addin-mstr-office/index.html?source=addin-mstr-office`;
  openPopup(popupUrl);
  // Clear old session cookie
  const listenAuthToken = () => {
    verifyToken(url).then(valid => {
      if (valid) {
        popup.close();
        goToReact(url);
      } else {
        !popup.closed && setTimeout(listenAuthToken, 2000)
      }
    }).catch((e) => {
      console.log(e);
      popup.close();
    });
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
  } catch {
    return false;
  }
}

function acceptCookies() {
  window.open('cookie-helper.html', 'mstr_helper', "width=1px,height=1px");
}

officeInitialize();
