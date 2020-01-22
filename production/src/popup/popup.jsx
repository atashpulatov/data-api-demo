import React from 'react';
import { libraryErrorController } from '@mstr/mstr-react-library';
import { PopupViewSelector } from './popup-view-selector';
import i18next from '../i18n';
import InternetConnectionError from './internet-connection-error';
import { popupHelper } from './popup-helper';

/* global Office */

export const Popup = () => {
  libraryErrorController.initializeHttpErrorsHandling(popupHelper.handlePopupErrors);

  i18next.changeLanguage(i18next.options.resources[Office.context.displayLanguage]
    ? Office.context.displayLanguage
    : 'en-US');
  return (
    <>
      <PopupViewSelector />
      <InternetConnectionError />
    </>
  );
};
