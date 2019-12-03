/* eslint-disable */
import 'core-js/stable';
import 'focus-visible/dist/focus-visible';
import 'proxy-polyfill';
import './index.css';
import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom';
import {authenticationService} from './authentication/auth-rest-service';

import i18next from './i18n';
import * as serviceWorker from './serviceWorker';
import {DIContainer} from './dependency-container';

// Code splitting https://reactjs.org/docs/code-splitting.html
const LazySidebar = lazy(() => import('./entry-point/sidebar-entry-point'));
const LazyDialog = lazy(() => import('./entry-point/dialog-entry-point'));

const {Office} = window;

function goReact() {
  i18next.changeLanguage(i18next.options.resources[Office.context.displayLanguage] ? Office.context.displayLanguage : 'en-US');
  ReactDOM.render((
    <Suspense fallback={null}>
      {(window.location.href.indexOf('popupType') === -1)
        ? <LazySidebar />
        : <LazyDialog />}
    </Suspense>
  ), document.getElementById('root'), () => console.timeEnd('React loading time'));
}

async function handleUnauthorized(envUrl, iSession) {
  try {
    const res = await authenticationService.logout(`${envUrl}/api`, iSession);
    const locale = Office.context.displayLanguage || navigator.language;
    if (res) {
      setInterval(() => {
        window.location.replace(`${envUrl}/static/loader-mstr-office/no-privilege.html?locale=${locale}`);
      }, 200);
    }
  } catch (error) {
    // Ignore error
  }
}

function officeInitialize() {
  Office.onReady()
    .then(async () => {
      console.log({Office, Excel});
      const envUrl = window.location.pathname.split('/apps/')[0];
      // If it is not popup we check user privileges
      const diContainer = new DIContainer();
      diContainer.initializeDependencies();
      const homeHelper = diContainer.get('homeHelper');
      if (window.location.href.indexOf('popupType') === -1) {
        const {iSession} = homeHelper.getParsedCookies();
        const canUseOffice = await authenticationService.getOfficePrivilege(`${envUrl}/api`, iSession);
        if (!canUseOffice) {
          handleUnauthorized(envUrl, iSession);
        }
      }
      goReact();
    });
}

officeInitialize();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
