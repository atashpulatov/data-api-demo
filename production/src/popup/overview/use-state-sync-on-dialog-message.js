import { useEffect } from 'react';
import { reduxStore } from '../../store';
import { PopupTypeEnum } from '../../home/popup-type-enum';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import { restoreAllNotifications, createGlobalNotification } from '../../redux-reducer/notification-reducer/notification-action-creators';

const useStateSyncOnDialogMessage = () => {
  useEffect(() => {
    // Get Message from Right side panel
    Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, (msg) => {
      const message = JSON.parse(msg.message);
      const { popupType } = message;

      if (popupType === PopupTypeEnum.importedDataOverview) {
        const {
          objects: objectsToSync,
          notifications: notificationsToSync,
          globalNotification: globalNotificationToSync
        } = message;

        reduxStore.dispatch(restoreAllObjects(objectsToSync));
        reduxStore.dispatch(restoreAllNotifications(notificationsToSync));
        reduxStore.dispatch(createGlobalNotification(globalNotificationToSync));
      }
    });
  }, []);
};

export default useStateSyncOnDialogMessage;
