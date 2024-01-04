import 'core-js/stable';
import 'focus-visible/dist/focus-visible';
import './index.css';
import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
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

  const container = document.getElementById('root');
  const root = createRoot(container);

  root.render((
    <Suspense fallback={<Empty isLoading />}>
      {(window.location.href.indexOf('popupType') === -1)
        ? <LazySidebar />
        : <LazyDialog />}
    </Suspense>
  ));
}

function officeInitialize() {
  window.Office.onReady()
    .then(async () => {
      const homeHelperSingle = diContainer.initilizeSingle(HomeHelper, [reduxStore, sessionHelper]);

      if (window.location.href.indexOf('popupType') === -1) {
        // Loading from sidebar
        homeHelperSingle.storeShowHidden();
      } else {
        // Loading from dialog/popup
        // Add handler from dialog (child) window to be triggered when the parent sends a message
        await Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived,
          (arg) => {
            // This only occurs during Multiple Reprompt, but we replace the dialog window
            // URL location to trigger the next object's Reprompt window.
            const { splittedUrl = [], popupType = '' } = JSON.parse(arg.message);
            window.location.replace(`${splittedUrl[0]}?popupType=${popupType}&source=addin-mstr-excel`);
          });
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
