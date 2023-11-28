import React, { useEffect, useCallback } from 'react';
import { libraryErrorController } from '@mstr/mstr-react-library';
import i18n from '../i18n';
import { PopupViewSelector } from './popup-view-selector';
import InternetConnectionError from './internet-connection-error';
import { popupHelper } from './popup-helper';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { SessionExtendingWrapper } from './session-extending-wrapper';
/* global Office */

export const Popup = () => {
  useEffect(() => {
    libraryErrorController.initializeHttpErrorsHandling(popupHelper.handlePopupErrors);
  }, []);

  useEffect(() => {
    i18n.changeLanguage(Office.context.displayLanguage || 'en-US');
  }, []);

  const closePopup = useCallback(() => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    popupHelper.officeMessageParent(message);
  }, []);

  return (
    <SessionExtendingWrapper id="popup-wrapper" onSessionExpire={closePopup}>
      <InternetConnectionError />
      <PopupViewSelector />
    </SessionExtendingWrapper>
  );
};
