import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PopupProps, PopupTypes } from '@mstr/connector-components';

import officeReducerHelper from '../office/store/office-reducer-helper';
import { sidePanelNotificationHelper } from './side-panel-notification-helper';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupController } from '../popup/popup-controller';
import { officeSelectors } from '../redux-reducer/office-reducer/office-reducer-selectors';
import { popupStateSelectors } from '../redux-reducer/popup-state-reducer/popup-state-reducer-selectors';
import { repromptsQueueSelector } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer-selector';

interface UseGetSidePanelPopupProps {
  sidePanelPopup: PopupProps;
  setSidePanelPopup: React.Dispatch<PopupProps>;
}

/**
 * Gets the relevant side panel popup
 * @param setSidePanelPopup - the function to set the side panel popup
 * @param sidePanelPopup - the current side panel popup
 */
export const useGetSidePanelPopup = ({
  setSidePanelPopup,
  sidePanelPopup,
}: UseGetSidePanelPopupProps): void => {
  const popupData = useSelector(officeSelectors.selectPopupData);
  const activeCellAddress = useSelector(officeSelectors.selectActiveCellAddress);
  const isSecured = useSelector(officeSelectors.selectIsSecured);
  const isClearDataFailed = useSelector(officeSelectors.selectIsClearDataFailed);
  const isDataOverviewOpen = useSelector(popupStateSelectors.selectIsDataOverviewOpen);
  const isSidePanelBlocked = useSelector(repromptsQueueSelector.doesRepromptQueueContainItems);

  useEffect(() => {
    setSidePanelPopup(sidePanelNotificationHelper.setClearDataPopups());
  }, [isSecured, isClearDataFailed, setSidePanelPopup]);

  useEffect(() => {
    if (popupData) {
      sidePanelNotificationHelper.setRangeTakenPopup({
        ...popupData,
        setSidePanelPopup,
        activeCellAddress,
      });
      // TODO: Add implementation to call setPageByRefreshErrorPopup for Page by refresh errors

      // For the mulitiple reprompt workflow from the side panel, pass the popupData to the native dialog
      const { objectWorkingId } = popupData;
      const objectData =
        officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
      const isDossier =
        objectData.mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name;
      const isReport = objectData.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
      if ((isDossier || isReport) && isSidePanelBlocked && !isDataOverviewOpen) {
        popupController.sendMessageToDialog(JSON.stringify({ popupData }));
      }
    }
    // TODO: Add case for Page by refresh error popup
    else if (sidePanelPopup?.type === PopupTypes.RANGE_TAKEN) {
      setSidePanelPopup(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCellAddress, popupData, isSecured, isClearDataFailed]);
};
