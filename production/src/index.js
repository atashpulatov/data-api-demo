import 'focus-visible/dist/focus-visible';
import 'core-js';
import 'proxy-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Home} from './home/home.jsx';
import {reduxStore, reduxPersistor} from './store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import './index.css';
import {authenticationService} from './authentication/auth-rest-service.js';
import {homeHelper} from './home/home-helper.js';
import i18next from './i18n';

const Office = window.Office;

function officeInitialize() {
  Office.onReady()
      .then(async () => {
        const envUrl = window.location.pathname.split('/apps/')[0];
        const {iSession} = homeHelper.getParsedCookies();
        const canUseOffice = await authenticationService.getOfficePrivilege(envUrl + '/api', iSession);

        if (!canUseOffice) {
          handleUnauthorized(envUrl, iSession);
        } else {
          goReact();
        }
      });
}

async function handleUnauthorized(envUrl, iSession) {
  try {
    const res = await authenticationService.logout(envUrl + '/api', iSession);
    const locale = Office.context.displayLanguage || navigator.language;
    res && setInterval(() => {
      window.location.replace(`${envUrl}/static/loader-mstr-office/no-privilege.html?locale=${locale}`);
    }, 200);
  } catch (error) {
    // Ignore error
  }
}

function goReact() {
  i18next.changeLanguage(Office.context.displayLanguage);
  ReactDOM.render(
      <Provider store={reduxStore}>
        <PersistGate persistor={reduxPersistor}>
          <Home loading={false} />
        </PersistGate>
      </Provider>
      , document.getElementById('root')
  );
}

/**
 * This function adds a # value to iframe URL and modifies it n times
 * This should prevent navigating back to login page via browser 'Back' button
 * @param {number} count Amount of attempts
 */
function disableBackNavigation(count) {
  if (count) {
    window.setTimeout(function() {
      window.location.hash = count;
      disableBackNavigation(count - 1);
    }, 50);
  }
}

// goReact();
disableBackNavigation(10);
officeInitialize();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
