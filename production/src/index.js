import 'core-js/stable';
import 'focus-visible/dist/focus-visible';
import 'proxy-polyfill';
import './index.css';
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { authenticationService } from './authentication/auth-rest-service';

import i18next from './i18n';
import * as serviceWorker from './serviceWorker';
import { reduxStore } from './store';
import { OfficeApiHelper } from './office/office-api-helper';
import { OfficeStoreService } from './office/store/office-store-service';
import { ErrorService } from './error/error-handler';
import { SessionHelper } from './storage/session-helper';
import { NotificationService } from './notification/notification-service';
import { AuthenticationHelper } from './authentication/authentication-helper';
import { HomeHelper } from './home/home-helper';

const officeApiHelper = new OfficeApiHelper();
officeApiHelper.init(reduxStore);
const officeStoreService = new OfficeStoreService();
officeStoreService.init(reduxStore);
const notificationService = new NotificationService();
notificationService.init(reduxStore);
const sessionHelper = new SessionHelper();
sessionHelper.init(reduxStore);
const errorHandler = new ErrorService();
errorHandler.init(sessionHelper, notificationService);
const authenticationHelper = new AuthenticationHelper();
authenticationHelper.init(reduxStore, sessionHelper);
const homeHelper = new HomeHelper();
homeHelper.init(reduxStore, sessionHelper);

// Code splitting https://reactjs.org/docs/code-splitting.html
const LazySidebar = lazy(() => import('./entry-point/sidebar-entry-point'));
const LazyDialog = lazy(() => import('./entry-point/dialog-entry-point'));

const { Office } = window;

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
      const envUrl = window.location.pathname.split('/apps/')[0];
      // If it is not popup we check user privileges
      if (window.location.href.indexOf('popupType') === -1) {
        const { iSession } = homeHelper.getParsedCookies();
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
