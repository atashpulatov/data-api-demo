import 'core-js/stable';
import 'focus-visible/dist/focus-visible';
import './index.css';
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Empty } from '@mstr/connector-components/lib/empty/empty';

import i18next from './i18n';
import * as serviceWorker from './serviceWorker';
import { diContainer } from './dependency-container';
import { HomeHelper } from './home/home-helper';
import { reduxStore } from './store';
import { sessionHelper } from './storage/session-helper';

// Code splitting https://reactjs.org/docs/code-splitting.html
const LazySidebar = lazy(() => import('./entry-point/sidebar-entry-point'));
const LazyDialog = lazy(() => import('./entry-point/dialog-entry-point'));

function goReact() {
  i18next.changeLanguage(window.Office.context.displayLanguage || 'en-US');

  console.log(`Running react in ${sessionHelper.isDevelopment() ? 'development' : 'production'} mode`);

  ReactDOM.render((
    <Suspense fallback={<Empty isLoading />}>
      {(window.location.href.indexOf('popupType') === -1)
        ? <LazySidebar />
        : <LazyDialog />}
    </Suspense>
  ), document.getElementById('root'), () => console.timeEnd('React loading time'));
}

function officeInitialize() {
  window.Office.onReady()
    .then(async () => {
      const homeHelperSingle = diContainer.initilizeSingle(HomeHelper, [reduxStore, sessionHelper]);

      if (window.location.href.indexOf('popupType') === -1) {
        homeHelperSingle.storeShowHidden();
      }
      goReact();
      diContainer.initializeAll();
    });
}

officeInitialize();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
