import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { dialogController } from '../../dialog/dialog-controller';
import { notificationReducerSelectors } from '../../redux-reducer/notification-reducer/notification-reducer-selectors';
import { selectObjects } from '../../redux-reducer/object-reducer/object-reducer-selectors';
import { officeSelectors } from '../../redux-reducer/office-reducer/office-reducer-selectors';
import { popupStateSelectors } from '../../redux-reducer/popup-state-reducer/popup-state-reducer-selectors';

/**
 * Hook that sends data to the dialog panel
 */
export const useDialogPanelCommunication = (): void => {
  const popupData = useSelector(officeSelectors.selectPopupData);
  const isDialogLoaded = useSelector(officeSelectors.selectIsDialogLoaded);
  const activeCellAddress = useSelector(officeSelectors.selectActiveCellAddress);
  const globalNotification = useSelector(notificationReducerSelectors.selectGlobalNotification);
  const notifications = useSelector(notificationReducerSelectors.selectNotifications);
  const popupType = useSelector(popupStateSelectors.selectPopupType);
  const objects = useSelector(selectObjects);

  useEffect(() => {
    if (isDialogLoaded) {
      dialogController.sendMessageToDialog(
        JSON.stringify({
          popupType,
          objects,
          notifications,
          globalNotification,
          activeCellAddress,
          popupData,
        })
      );
    }
  }, [
    objects,
    notifications,
    globalNotification,
    activeCellAddress,
    isDialogLoaded,
    popupData,
    popupType,
  ]);
};
