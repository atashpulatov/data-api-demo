import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Spinner } from '@mstr/rc';

import { HomeHelper } from './home/home-helper';
import officeReducerHelper from './office/store/office-reducer-helper';
import { sessionHelper } from './storage/session-helper';

import 'core-js/stable';
import { diContainer } from './dependency-container';
import i18next from './i18n';
import { sessionActions } from './redux-reducer/session-reducer/session-actions';

import './index.css';

const LazySidebar = lazy(() => import('./entry-point/sidebar-entry-point'));
const LazyDialog = lazy(() => import('./entry-point/dialog-entry-point'));

function goReact() {
  i18next.changeLanguage(window.Office.context.displayLanguage || 'en-US');

  const container = document.getElementById('root');
  const root = createRoot(container);

  const loadingComponent = (
    <Spinner className='loading-spinner' type='large'>
      {i18next.t('Loading...')}
    </Spinner>
  );

  root.render(
    <Suspense fallback={loadingComponent}>
      {window.location.href.indexOf('popupType') === -1 ? <LazySidebar /> : <LazyDialog />}
    </Suspense>
  );
}

function officeInitialize() {
  window.Office.onReady().then(async () => {
    const homeHelperSingle = diContainer.initilizeSingle(HomeHelper, [
      sessionActions,
      sessionHelper,
    ]);

    if (window.location.href.indexOf('popupType') === -1) {
      // Loading from sidebar
      homeHelperSingle.storeShowHidden();
    } else {
      // Loading from dialog/popup
      // Add handler from dialog (child) window to be triggered when the parent sends a message
      await Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, arg => {
        // This only occurs during Multiple Reprompt, but we replace the dialog window
        // URL location to trigger the next object's Reprompt window.
        const {
          splittedUrl = [],
          popupType = '',
          isRepromptOrOvieviewPopupOpen = false,
          popupData,
        } = JSON.parse(arg.message);

        if (popupData) {
          officeReducerHelper.displayPopup(popupData);
        }
        if (isRepromptOrOvieviewPopupOpen) {
          window.location.replace(
            `${splittedUrl[0]}?popupType=${popupType}&source=addin-mstr-excel`
          );
        }
      });
    }
    goReact();
    diContainer.initializeAll();
  });
}

officeInitialize();
