import 'core-js/stable';
import 'focus-visible/dist/focus-visible';
import 'proxy-polyfill';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Home } from './home/home.jsx';
import { reduxStore, reduxPersistor } from './store';
import { authenticationService } from './authentication/auth-rest-service.js';
import { homeHelper } from './home/home-helper.js';
import i18next from './i18n';
import { Popup } from './popup/popup';

const { Office } = window;

function officeInitialize() {
  Office.onReady()
    .then(async () => {
      const envUrl = window.location.pathname.split('/apps/')[0];
      const { iSession } = homeHelper.getParsedCookies();
      const canUseOffice = await authenticationService.getOfficePrivilege(`${envUrl}/api`, iSession);

      if (!canUseOffice) {
        handleUnauthorized(envUrl, iSession);
      } else {
        goReact();
      }
    });
}

async function handleUnauthorized(envUrl, iSession) {
  try {
    const res = await authenticationService.logout(`${envUrl}/api`, iSession);
    const locale = Office.context.displayLanguage || navigator.language;
    res && setInterval(() => {
      window.location.replace(`${envUrl}/static/loader-mstr-office/no-privilege.html?locale=${locale}`);
    }, 200);
  } catch (error) {
    // Ignore error
  }
}

function goReact() {
  i18next.changeLanguage(i18next.options.resources[Office.context.displayLanguage] ? Office.context.displayLanguage : 'en-US');

  if (window.location.href.indexOf('popupType') === -1) {
    ReactDOM.render(<Provider store={reduxStore}>
      <PersistGate persistor={reduxPersistor}>
        <Home loading={false} />
      </PersistGate>
                    </Provider>,
    document.getElementById('root'), () => console.timeEnd('React loading time'));
  } else {
    ReactDOM.render(<Provider store={reduxStore}><Popup /></Provider>,
      document.getElementById('root'), () => console.timeEnd('React loading time'));
  }
}

officeInitialize();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
