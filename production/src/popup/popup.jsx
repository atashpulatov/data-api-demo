import React from 'react';
import { libraryErrorController } from '@mstr/mstr-react-library';
import { PopupViewSelector } from './popup-view-selector';
import i18next from '../i18n';
import InternetConnectionError from './internet-connection-error';
import { popupHelper } from './popup-helper';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { SessionExtendingWrapper } from './session-extending-wrapper';
/* global Office */

export const Popup = () => {
  React.useEffect(() => {
    libraryErrorController.initializeHttpErrorsHandling(popupHelper.handlePopupErrors);
  }, []);

  i18next.changeLanguage(i18next.options.resources[Office.context.displayLanguage]
    ? Office.context.displayLanguage
    : 'en-US');

  const { commandCancel, } = selectorProperties;
  const message = { command: commandCancel, };
  const closePopup = () => popupHelper.officeMessageParent(message);

  return (
    <SessionExtendingWrapper id="popup-wrapper" onSessionExpire={closePopup}>
      <PopupViewSelector />
      <InternetConnectionError />
    </SessionExtendingWrapper>
  );
};
