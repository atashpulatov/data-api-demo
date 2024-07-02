import React, { useCallback, useEffect } from 'react';
// @ts-expect-error mstr-react-library is a js codebase
import { libraryErrorController } from '@mstr/mstr-react-library';

import { dialogHelper } from './dialog-helper';

import { DialogCommands } from './dialog-controller-types';

import i18n from '../i18n';
import { DialogViewSelector } from './dialog-view-selector';
import InternetConnectionError from './internet-connection-error';
import { SessionExtendingWrapper } from './session-extending-wrapper';

export const Dialog: React.FC = () => {
  useEffect(() => {
    libraryErrorController.initializeHttpErrorsHandling(dialogHelper.handlePopupErrors);
  }, []);

  useEffect(() => {
    i18n.changeLanguage(Office.context.displayLanguage || 'en-US');
  }, []);

  const closePopup = useCallback(() => {
    const message = { command: DialogCommands.COMMAND_CANCEL };
    dialogHelper.officeMessageParent(message);
  }, []);

  return (
    <SessionExtendingWrapper id='dialog-wrapper' onSessionExpire={closePopup}>
      <InternetConnectionError />
      <DialogViewSelector />
    </SessionExtendingWrapper>
  );
};
