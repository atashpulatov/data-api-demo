const Office = window.Office;

function officeInitialize() {
  Office.onReady()
    .then(() => {
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
    return document.cookie.includes(TEMP_COOKIE);
  } catch{
    return false;
  }
}

function acceptCookies() {
  window.open('cookie-helper.html', 'mstr_helper', "width=1px,height=1px");
}

officeInitialize();
