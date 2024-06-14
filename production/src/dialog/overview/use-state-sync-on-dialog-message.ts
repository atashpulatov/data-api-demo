import { useEffect } from 'react';

import officeReducerHelper from '../../office/store/office-reducer-helper';
import { dialogHelper } from '../dialog-helper';

import { reduxStore } from '../../store';

import { DialogType } from '../../redux-reducer/popup-state-reducer/popup-state-reducer-types';

import { selectorProperties } from '../../attribute-selector/selector-properties';
import {
  createGlobalNotification,
  restoreAllNotifications,
} from '../../redux-reducer/notification-reducer/notification-action-creators';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';

const useStateSyncOnDialogMessage = (): void => {
  useEffect(() => {
    // Get Message from Right side panel
    Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, msg => {
      const message = JSON.parse(msg.message);
      const { popupType } = message;
      const { setActiveCellAddress } = officeActions;

      if (popupType === DialogType.importedDataOverview) {
        const {
          objects: objectsToSync,
          notifications: notificationsToSync,
          globalNotification: globalNotificationToSync,
          activeCellAddress: activeCellAddressToSync,
          popupData: popupDataToSync,
        } = message;

        reduxStore.dispatch(restoreAllObjects(objectsToSync));
        reduxStore.dispatch(restoreAllNotifications(notificationsToSync));
        reduxStore.dispatch(createGlobalNotification(globalNotificationToSync));
        reduxStore.dispatch(setActiveCellAddress(activeCellAddressToSync));

        officeReducerHelper.displayPopup(popupDataToSync);
      }
    });
  }, []);

  useEffect(() => {
    // Send message to the Right side panel when overview dialog is loaded
    const message = { command: selectorProperties.commandDialogLoaded };
    dialogHelper.officeMessageParent(message);
  }, []);
};

export default useStateSyncOnDialogMessage;
