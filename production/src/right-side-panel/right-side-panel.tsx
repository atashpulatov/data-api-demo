import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { OfficeApplicationType, SidePanel } from '@mstr/connector-components';
import { SidePanelBannerProps } from '@mstr/connector-components/lib/side-panel/banner/side-panel-banner-types';

import { useGetFilteredObjectListForSidePanelDetails } from '../redux-reducer/settings-reducer/settings-hooks';
import useAutoRefreshObjects from './side-panel-hooks/use-auto-refresh-objects';
import { useDialogPanelCommunication } from './side-panel-hooks/use-dialog-panel-communication';
import { useGetSidePanelPopup } from './side-panel-hooks/use-get-side-panel-popup';
import { useGetUpdatedDuplicatePopup } from './side-panel-hooks/use-get-updated-duplicate-popup';
import useInitializeSidePanel from './side-panel-hooks/use-initialize-side-panel';

import officeReducerHelper from '../office/store/office-reducer-helper';
import { sidePanelNotificationHelper } from './side-panel-services/side-panel-notification-helper';
import { sidePanelService } from './side-panel-services/side-panel-service';

import { reduxStore, RootState } from '../store';

import { ObjectData } from '../types/object-types';

import { dialogController } from '../dialog/dialog-controller';
import {
  dismissAllObjectsNotifications,
  setSidePanelBannerNotification,
} from '../redux-reducer/notification-reducer/notification-action-creators';
import { notificationReducerSelectors } from '../redux-reducer/notification-reducer/notification-reducer-selectors';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { officeSelectors } from '../redux-reducer/office-reducer/office-reducer-selectors';
import { selectOperations } from '../redux-reducer/operation-reducer/operation-reducer-selectors';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { repromptsQueueSelector } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer-selector';
import { Confirmation } from './confirmation/confirmation';
import { SettingsMenu } from './settings-menu/settings-menu';
import SettingsSidePanel from './settings-side-panel/settings-side-panel';

import './right-side-panel.scss';

interface RightSidePanelProps {
  loadedObjects: ObjectData[];
  isConfirm?: boolean;
  isSettings?: boolean;
  settingsPanelLoaded?: boolean;
  toggleIsSettingsFlag?: (flag?: boolean) => void;
  setPrefilteredSourceObjectName?: (objectName: string) => void;
  setIsDataOverviewOpen?: (isDataOverviewOpen: boolean) => void;
}

export const RightSidePanelNotConnected: React.FC<RightSidePanelProps> = ({
  loadedObjects,
  isConfirm,
  isSettings,
  settingsPanelLoaded,
  toggleIsSettingsFlag,
  setPrefilteredSourceObjectName,
  setIsDataOverviewOpen,
}) => {
  const dispatch = useDispatch();
  const [sidePanelPopup, setSidePanelPopup] = useState(null);
  const [loadedObjectsWrapped, setLoadedObjectsWrapped] = useState(loadedObjects);
  const [activeSheetId, setActiveSheetId] = useState('');

  const operations = useSelector(selectOperations);
  const globalNotification = useSelector(notificationReducerSelectors.selectGlobalNotification);
  const notifications = useSelector(notificationReducerSelectors.selectNotifications);
  const isSidePanelBlocked = useSelector(repromptsQueueSelector.doesRepromptQueueContainItems);
  const isDialogOpen = useSelector(officeSelectors.selectIsDialogOpen);
  const popupData = useSelector(officeSelectors.selectPopupData);

  // Represents whether any popup (notifications, Office dialog, sidepanel popup) or settings are visible
  const isAnyPopupOrSettingsDisplayed =
    sidePanelPopup ||
    globalNotification?.type ||
    isDialogOpen ||
    popupData ||
    isSettings ||
    settingsPanelLoaded;
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
    if (operations?.length <= 1 && bannerNotification?.type) {
      reduxStore.dispatch(setSidePanelBannerNotification(null));
    }
  }, [loadedObjects, notifications, operations, bannerNotification]);

  const showOverviewModal = (objectName: string): void => {
    dialogController.runImportedDataOverviewPopup();
    setPrefilteredSourceObjectName(objectName);
    setIsDataOverviewOpen(true);
  };
  return (
    <>
      {isSidePanelBlocked && <div className='block-side-panel-ui' />}
      {settingsPanelLoaded ? (
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
          onSettingsClick={() => toggleIsSettingsFlag(!isSettings)}
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
          banner={bannerNotification as SidePanelBannerProps}
        />
      )}
    </>
  );
};

export const mapStateToProps = (state: RootState): any => {
  const { objects } = state.objectReducer;

  const { isConfirm, isSettings, settingsPanelLoaded } = state.officeReducer;

  return {
    loadedObjects: objects,
    isConfirm,
    isSettings,
    settingsPanelLoaded,
  };
};

const mapDispatchToProps = {
  toggleIsSettingsFlag: officeActions.toggleIsSettingsFlag,
  setPrefilteredSourceObjectName: popupStateActions.setPrefilteredSourceObjectName,
  setIsDataOverviewOpen: popupStateActions.setIsDataOverviewOpen,
};

export const RightSidePanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightSidePanelNotConnected);
