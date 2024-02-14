import { useEffect } from 'react';
import { reduxStore } from '../../store';
import { PopupTypeEnum } from '../../home/popup-type-enum';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import { restoreAllNotifications, createGlobalNotification } from '../../redux-reducer/notification-reducer/notification-action-creators';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { popupHelper } from '../popup-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';

const useStateSyncOnDialogMessage = () => {
  useEffect(() => {
    // Get Message from Right side panel
    Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, (msg) => {
      const message = JSON.parse(msg.message);
      const { popupType, popupData } = message;
      const { setActiveCellAddress } = officeActions;

      if (popupType === PopupTypeEnum.importedDataOverview) {
        const {
          objects: objectsToSync,
          notifications: notificationsToSync,
          globalNotification: globalNotificationToSync,
          activeCellAddress: activeCellAddressToSync
        } = message;

        reduxStore.dispatch(restoreAllObjects(objectsToSync));
        reduxStore.dispatch(restoreAllNotifications(notificationsToSync));
        reduxStore.dispatch(createGlobalNotification(globalNotificationToSync));
        reduxStore.dispatch(setActiveCellAddress(activeCellAddressToSync));
      }

      if (popupData) {
        officeReducerHelper.dispayPopupOnSidePanel(popupData);
      }
    });
  }, []);

  useEffect(() => {
    // Send message to the Right side panel when overview dialog is loaded
    const message = { command: selectorProperties.commandPopupLoaded };
    popupHelper.officeMessageParent(message);
  }, []);
};

export default useStateSyncOnDialogMessage;
