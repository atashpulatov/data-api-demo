import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { OfficeApplicationType, SidePanel } from '@mstr/connector-components';

import { useGetFilteredObjectListForSidePanelDetails } from '../redux-reducer/settings-reducer/settings-hooks';
import { useDialogPanelCommunication } from './side-panel-hooks/use-dialog-panel-communication';
import { useGetSidePanelPopup } from './side-panel-hooks/use-get-side-panel-popup';
import { useGetUpdatedDuplicatePopup } from './side-panel-hooks/use-get-updated-duplicate-popup';

import { notificationService } from '../notification/notification-service';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { formattingSettingsHelper } from './settings-side-panel/formatting-settings/formatting-settings-helper';
import { settingsSidePanelHelper } from './settings-side-panel/settings-side-panel-helper';
import { sidePanelEventHelper } from './side-panel-services/side-panel-event-helper';
import { sidePanelHelper } from './side-panel-services/side-panel-helper';
import { sidePanelNotificationHelper } from './side-panel-services/side-panel-notification-helper';
import { sidePanelService } from './side-panel-services/side-panel-service';

import { RootState } from '../store';

import { ObjectData } from '../types/object-types';

import { Confirmation } from '../home/confirmation';
import { SettingsMenu } from '../home/settings-menu';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { notificationReducerSelectors } from '../redux-reducer/notification-reducer/notification-reducer-selectors';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { officeSelectors } from '../redux-reducer/office-reducer/office-reducer-selectors';
import { selectOperations } from '../redux-reducer/operation-reducer/operation-reducer-selectors';
import { repromptsQueueSelector } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer-selector';
import SettingsSidePanel from './settings-side-panel/settings-side-panel';

import './right-side-panel.scss';

interface RightSidePanelProps {
  loadedObjects: ObjectData[];
  isConfirm?: boolean;
  isSettings?: boolean;
  settingsPanelLoaded?: boolean;
  toggleIsSettingsFlag?: (flag?: boolean) => void;
  updateActiveCellAddress?: (cellAddress?: string) => void;
}

export const RightSidePanelNotConnected: React.FC<RightSidePanelProps> = ({
  loadedObjects,
  isConfirm,
  isSettings,
  settingsPanelLoaded,
  toggleIsSettingsFlag,
  updateActiveCellAddress,
}) => {
  const [sidePanelPopup, setSidePanelPopup] = useState(null);
  const [loadedObjectsWrapped, setLoadedObjectsWrapped] = useState(loadedObjects);

  const operations = useSelector(selectOperations);
  const globalNotification = useSelector(notificationReducerSelectors.selectGlobalNotification);
  const notifications = useSelector(notificationReducerSelectors.selectNotifications);
  const isSidePanelBlocked = useSelector(repromptsQueueSelector.doesRepromptQueueContainItems);
  const isDialogOpen = useSelector(officeSelectors.selectIsDialogOpen);

  useEffect(() => {
    // TODO - move this to a separate hook
    async function initializeSidePanel(): Promise<void> {
      try {
        await sidePanelEventHelper.addRemoveObjectListener();
        await sidePanelEventHelper.initializeActiveCellChangedListener(updateActiveCellAddress);
        await formattingSettingsHelper.initImportFormattingSettings();
        await settingsSidePanelHelper.initReusePromptAnswers();
        await settingsSidePanelHelper.initPageByDisplayAnswers();
        await settingsSidePanelHelper.initWorksheetNamingAnswers();
        await settingsSidePanelHelper.initObjectInfoSettings();
        sidePanelHelper.clearRepromptTask();
        sidePanelHelper.initializeClearDataFlags();
      } catch (error) {
        console.error(error);
      }
    }
    initializeSidePanel();
  }, [updateActiveCellAddress]);

  useDialogPanelCommunication();
  useGetSidePanelPopup({ setSidePanelPopup, sidePanelPopup });
  const duplicatePopupParams = useGetUpdatedDuplicatePopup({ sidePanelPopup, setSidePanelPopup });
  const filteredObjects = useGetFilteredObjectListForSidePanelDetails(loadedObjectsWrapped);

  useEffect(() => {
    setLoadedObjectsWrapped(
      sidePanelNotificationHelper.injectNotificationsToObjects(
        loadedObjects,
        notifications,
        operations
      )
    );
  }, [loadedObjects, notifications, operations]);

  return (
    <>
      {isSidePanelBlocked && <div className='block-side-panel-ui' />}
      {settingsPanelLoaded ? (
        <SettingsSidePanel />
      ) : (
        <SidePanel
          activeGroupKey={0}
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
          onSelectAll={notificationService.dismissNotifications}
          shouldDisableActions={!officeReducerHelper.noOperationInProgress()}
          onRefreshAllPagesClick={pageByLinkId =>
            sidePanelService.refreshAllPages(pageByLinkId, setSidePanelPopup, loadedObjects)
          }
          onDeleteAllPagesClick={pageByLinkId =>
            sidePanelService.deleteAllPages(pageByLinkId, setSidePanelPopup, loadedObjects)
          }
          isPopupRendered={isDialogOpen}
          applicationType={OfficeApplicationType.EXCEL}
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
  cancelCurrentImportRequest: navigationTreeActions.cancelImportRequest,
  toggleIsSettingsFlag: officeActions.toggleIsSettingsFlag,
  updateActiveCellAddress: officeActions.updateActiveCellAddress,
};

export const RightSidePanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightSidePanelNotConnected);
