import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { OfficeApplicationType, SidePanel } from '@mstr/connector-components';

import { useGetFilteredObjectListForSidePanelDetails } from '../redux-reducer/settings-reducer/settings-hooks';
import { useDialogPanelCommunication } from './side-panel-hooks/use-dialog-panel-communication';
import { useGetSidePanelPopup } from './side-panel-hooks/use-get-side-panel-popup';
import { useGetUpdatedDuplicatePopup } from './side-panel-hooks/use-get-updated-duplicate-popup';
import useInitializeSidePanel from './side-panel-hooks/use-initialize-side-panel';

import officeReducerHelper from '../office/store/office-reducer-helper';
import { sidePanelNotificationHelper } from './side-panel-services/side-panel-notification-helper';
import { sidePanelService } from './side-panel-services/side-panel-service';

import { RootState } from '../store';

import { dialogController } from '../dialog/dialog-controller';
import { dismissAllObjectsNotifications } from '../redux-reducer/notification-reducer/notification-action-creators';
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

interface RightSidePanelProps {
  isConfirm?: boolean;
  isSettings?: boolean;
  settingsPanelLoaded?: boolean;
  toggleIsSettingsFlag?: (flag?: boolean) => void;
  setPrefilteredSourceObjectName?: (objectName: string) => void;
  setIsDataOverviewOpen?: (isDataOverviewOpen: boolean) => void;
}

export const RightSidePanelNotConnected: React.FC<RightSidePanelProps> = ({
  isConfirm,
  isSettings,
  settingsPanelLoaded,
  toggleIsSettingsFlag,
  setPrefilteredSourceObjectName,
  setIsDataOverviewOpen,
}) => {
  const dispatch = useDispatch();

  const operations = useSelector(selectOperations);
  const globalNotification = useSelector(notificationReducerSelectors.selectGlobalNotification);
  const notifications = useSelector(notificationReducerSelectors.selectNotifications);
  const isSidePanelBlocked = useSelector(repromptsQueueSelector.doesRepromptQueueContainItems);
  const isDialogOpen = useSelector(officeSelectors.selectIsDialogOpen);
  const popupData = useSelector(officeSelectors.selectPopupData);
  const loadedObjects = useSelector(selectObjects);

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
    settingsPanelLoaded;
  // Use ref so this value can be used in event listener callback
  const isAnyPopupOrSettingsDisplayedRef = useRef(isAnyPopupOrSettingsDisplayed);

  useInitializeSidePanel(setActiveSheetId, isAnyPopupOrSettingsDisplayedRef);
  useDialogPanelCommunication();
  useGetSidePanelPopup({ setSidePanelPopup, sidePanelPopup });

  const duplicatePopupParams = useGetUpdatedDuplicatePopup({ sidePanelPopup, setSidePanelPopup });
  const filteredObjects = useGetFilteredObjectListForSidePanelDetails(loadedObjectsWrapped);

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
  }, [loadedObjects, notifications, operations]);

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
        />
      )}
    </>
  );
};

export const mapStateToProps = (state: RootState): any => {
  const { isConfirm, isSettings, settingsPanelLoaded } = state.officeReducer;

  return {
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
