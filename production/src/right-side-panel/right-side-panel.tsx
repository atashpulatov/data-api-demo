import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  OfficeApplicationType,
  SidePanel,
  SidePanelBannerStatus,
} from '@mstr/connector-components';

import { useGetFilteredObjectListForSidePanelDetails } from '../redux-reducer/settings-reducer/settings-hooks';
import useAutoRefreshObjects from './side-panel-hooks/use-auto-refresh-objects';
import { useDialogPanelCommunication } from './side-panel-hooks/use-dialog-panel-communication';
import { useGetSidePanelPopup } from './side-panel-hooks/use-get-side-panel-popup';
import { useGetUpdatedDuplicatePopup } from './side-panel-hooks/use-get-updated-duplicate-popup';
import useInitializeSidePanel from './side-panel-hooks/use-initialize-side-panel';

import officeReducerHelper from '../office/store/office-reducer-helper';
import { sidePanelNotificationHelper } from './side-panel-services/side-panel-notification-helper';
import { sidePanelService } from './side-panel-services/side-panel-service';

import { dialogController } from '../dialog/dialog-controller';
import {
  dismissAllObjectsNotifications,
  setSidePanelBannerNotification,
} from '../redux-reducer/notification-reducer/notification-action-creators';
import { notificationReducerSelectors } from '../redux-reducer/notification-reducer/notification-reducer-selectors';
import { selectObjects } from '../redux-reducer/object-reducer/object-reducer-selectors';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { officeSelectors } from '../redux-reducer/office-reducer/office-reducer-selectors';
import { selectOperations } from '../redux-reducer/operation-reducer/operation-reducer-selectors';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { repromptsQueueSelector } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer-selector';
import { Confirmation } from './confirmation/confirmation';
import { SettingsMenu } from './settings-menu/settings-menu';
import SettingsSidePanel from './settings-side-panel/settings-side-panel';

import './right-side-panel.scss';

export const RightSidePanel: React.FC = () => {
  const dispatch = useDispatch();

  const operations = useSelector(selectOperations);
  const globalNotification = useSelector(notificationReducerSelectors.selectGlobalNotification);
  const notifications = useSelector(notificationReducerSelectors.selectNotifications);
  const isSidePanelBlocked = useSelector(repromptsQueueSelector.doesRepromptQueueContainItems);
  const isDialogOpen = useSelector(officeSelectors.selectIsDialogOpen);
  const popupData = useSelector(officeSelectors.selectPopupData);
  const loadedObjects = useSelector(selectObjects);
  const isConfirm = useSelector(officeSelectors.selectIsConfirm);
  const isSettings = useSelector(officeSelectors.selectIsSettings);
  const isSettingsPanelLoaded = useSelector(officeSelectors.selectIsSettingsPanelLoaded);

  const [sidePanelPopup, setSidePanelPopup] = useState(null);
  const [activeSheetId, setActiveSheetId] = useState('');
  const [loadedObjectsWrapped, setLoadedObjectsWrapped] = useState(loadedObjects);

  // Represents whether any popup (notifications, Office dialog, sidepanel popup) or settings are visible
  const isAnyPopupOrSettingsDisplayed =
    sidePanelPopup ||
    globalNotification?.type ||
    isDialogOpen ||
    popupData ||
    isSettings ||
    isSettingsPanelLoaded;
  // Use ref so this value can be used in event listener callback
  const isAnyPopupOrSettingsDisplayedRef = useRef(isAnyPopupOrSettingsDisplayed);

  useInitializeSidePanel(setActiveSheetId, isAnyPopupOrSettingsDisplayedRef);
  useDialogPanelCommunication();
  useGetSidePanelPopup({ setSidePanelPopup, sidePanelPopup });

  // Trigger auto-refresh when data auto-refresh user setting is enabled.
  // and objects (working items) are fully restored.
  useAutoRefreshObjects();

  const duplicatePopupParams = useGetUpdatedDuplicatePopup({ sidePanelPopup, setSidePanelPopup });
  const filteredObjects = useGetFilteredObjectListForSidePanelDetails(loadedObjectsWrapped);
  // Get side panel notification used to display the notification in the side panel, either
  // to show banner to allow user to stop refresh all operations (Multiple objects or auto-refresh).
  const bannerNotification = useSelector(
    notificationReducerSelectors.selectSidePanelBannerNotification
  );

  // Update ref when value changes
  useEffect(() => {
    isAnyPopupOrSettingsDisplayedRef.current = isAnyPopupOrSettingsDisplayed;
  }, [isAnyPopupOrSettingsDisplayed]);

  useEffect(() => {
    setLoadedObjectsWrapped(
      sidePanelNotificationHelper.injectNotificationsToObjects(
        loadedObjects,
        notifications,
        operations
      )
    );
    // If operations are empty, remove the side panel notification banner.
    if (operations?.length <= 1 && bannerNotification?.type !== SidePanelBannerStatus.NONE) {
      dispatch(setSidePanelBannerNotification({ type: SidePanelBannerStatus.NONE }));
    }
  }, [loadedObjects, notifications, operations, bannerNotification, dispatch]);

  const showOverviewModal = (objectName: string): void => {
    dialogController.runImportedDataOverviewPopup();
    popupStateActions.setPrefilteredSourceObjectName(objectName);
    popupStateActions.setIsDataOverviewOpen(true);
  };
  return (
    <>
      {isSidePanelBlocked && <div className='block-side-panel-ui' />}
      {isSettingsPanelLoaded ? (
        <SettingsSidePanel />
      ) : (
        <SidePanel
          activeGroupKey={activeSheetId}
          loadedObjects={filteredObjects as any}
          onAddData={sidePanelService.addData}
          onTileClick={sidePanelService.highlightObject}
          onDuplicateClick={objectWorkingId =>
            sidePanelService.duplicate(objectWorkingId, duplicatePopupParams)
          }
          onEditClick={sidePanelService.edit}
          onRefreshClick={sidePanelService.refresh}
          onRemoveClick={sidePanelService.remove}
          onRename={sidePanelService.rename}
          onRepromptClick={(...objectWorkingIds) =>
            sidePanelService.reprompt(objectWorkingIds, false)
          }
          popup={!isDialogOpen && sidePanelPopup}
          // @ts-expect-error
          settingsMenu={isSettings && <SettingsMenu />}
          onSettingsClick={() => officeActions.toggleIsSettingsFlag(!isSettings)}
          confirmationWindow={isConfirm && <Confirmation />}
          globalNotification={globalNotification}
          onSelectAll={() => {
            // @ts-expect-error
            dispatch(dismissAllObjectsNotifications());
          }}
          shouldDisableActions={!officeReducerHelper.noOperationInProgress()}
          onRefreshAllPagesClick={pageByLinkId =>
            sidePanelService.refreshAllPages(pageByLinkId, setSidePanelPopup, loadedObjects)
          }
          onDeleteAllPagesClick={pageByLinkId =>
            sidePanelService.deleteAllPages(pageByLinkId, setSidePanelPopup, loadedObjects)
          }
          onShowInOverviewClick={showOverviewModal}
          isPopupRendered={isDialogOpen}
          applicationType={OfficeApplicationType.EXCEL}
          banner={
            bannerNotification.type === SidePanelBannerStatus.NONE ? undefined : bannerNotification
          }
        />
      )}
    </>
  );
};
