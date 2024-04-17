import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { OfficeApplicationType, SidePanel } from '@mstr/connector-components';

import { useGetSidePanelPopup } from './use-get-side-panel-popup';
import { useGetUpdatedDuplicatePopup } from './use-get-updated-duplicate-popup';

import { notificationService } from '../notification/notification-service';
import { officeApiHelper } from '../office/api/office-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import officeStoreHelper from '../office/store/office-store-helper';
import { settingsSidePanelHelper } from './settings-panel/settings-side-panel-helper';
import { sidePanelEventHelper } from './side-panel-event-helper';
import { sidePanelNotificationHelper } from './side-panel-notification-helper';
import { sidePanelService } from './side-panel-service';

import { RootState } from '../store';

import { ObjectData } from '../types/object-types';

import { Confirmation } from '../home/confirmation';
import { SettingsMenu } from '../home/settings-menu';
import { popupController } from '../popup/popup-controller';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import {
  selectGlobalNotification,
  selectNotifications,
} from '../redux-reducer/notification-reducer/notification-reducer-selectors';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { officeSelectors } from '../redux-reducer/office-reducer/office-reducer-selectors';
import { selectOperations } from '../redux-reducer/operation-reducer/operation-reducer-selectors';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { popupStateSelectors } from '../redux-reducer/popup-state-reducer/popup-state-reducer-selectors';
import { repromptsQueueSelector } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer-selector';
import SettingsSidePanel from './settings-panel/settings-side-panel';

import './right-side-panel.scss';

interface RightSidePanelProps {
  popupData?: { objectWorkingId: number; callback: Function };
  loadedObjects: ObjectData[];
  isConfirm?: boolean;
  isSettings?: boolean;
  settingsPanelLoaded?: boolean;
  toggleIsSettingsFlag?: (flag?: boolean) => void;
  toggleSecuredFlag?: (flag?: boolean) => void;
  toggleIsClearDataFailedFlag?: (flag?: boolean) => void;
  updateActiveCellAddress?: (cellAddress?: string) => void;
  isDialogRendered?: boolean;
  isDialogLoaded?: boolean;
  setIsDataOverviewOpen: (isDataOverviewOpen: boolean) => void;
  setFilteredPageByLinkId: (filteredPageByLinkId: string) => void;
}

export const RightSidePanelNotConnected: React.FC<RightSidePanelProps> = ({
  loadedObjects,
  isConfirm,
  isSettings,
  settingsPanelLoaded,
  toggleIsSettingsFlag,
  toggleSecuredFlag,
  toggleIsClearDataFailedFlag,
  updateActiveCellAddress,
  popupData,
  isDialogRendered,
  isDialogLoaded,
  setIsDataOverviewOpen,
  setFilteredPageByLinkId,
}) => {
  const [sidePanelPopup, setSidePanelPopup] = useState(null);
  const [loadedObjectsWrapped, setLoadedObjectsWrapped] = useState(loadedObjects);

  const operations = useSelector(selectOperations);
  const globalNotification = useSelector(selectGlobalNotification);
  const notifications = useSelector(selectNotifications);
  const popupType = useSelector(popupStateSelectors.selectPopupType);
  const isSidePanelBlocked = useSelector(repromptsQueueSelector.doesRepromptQueueContainItems);
  const activeCellAddress = useSelector(officeSelectors.selectActiveCellAddress);

  useEffect(() => {
    async function initializeSidePanel(): Promise<void> {
      try {
        await sidePanelEventHelper.addRemoveObjectListener();
        await sidePanelEventHelper.initializeActiveCellChangedListener(updateActiveCellAddress);
        await settingsSidePanelHelper.initReusePromptAnswers();
      } catch (error) {
        console.error(error);
      }
    }
    initializeSidePanel();
    sidePanelService.clearRepromptTask();
  }, [updateActiveCellAddress]);

  useEffect(() => {
    officeStoreHelper.isFileSecured() && toggleSecuredFlag(true);
    officeStoreHelper.isClearDataFailed() && toggleIsClearDataFailedFlag(true);
  }, [toggleSecuredFlag, toggleIsClearDataFailedFlag]);

  const duplicatePopupParams = useGetUpdatedDuplicatePopup({
    sidePanelPopup,
    setSidePanelPopup,
  });

  useGetSidePanelPopup({
    setSidePanelPopup,
    sidePanelPopup,
  });

  useEffect(() => {
    setLoadedObjectsWrapped(
      sidePanelNotificationHelper.injectNotificationsToObjects(
        loadedObjects,
        notifications,
        operations
      )
    );
  }, [loadedObjects, notifications, operations]);

  /**
   * Wraps a function to be called when user clicks an action icon.
   *
   * Function will be called when:
   *
   * - session is valid,
   * - no operation is in progress.
   *
   * @param func Function to be wrapped
   * @param params Parameters to wrapped function
   * @param name Optional new name of an object
   */
  const wrapper = async (func: Function, params: any, name?: string): Promise<void> => {
    try {
      const { onLine } = window.navigator;
      if (onLine) {
        await officeApiHelper.checkStatusOfSessions();
        if (officeReducerHelper.noOperationInProgress()) {
          await func(params, name);
        }
      }
    } catch (error) {
      sidePanelNotificationHelper.handleSidePanelActionError(error);
    }
  };

  const addDataWrapper = async (params: any): Promise<void> => {
    await wrapper(sidePanelService.addData, params);
  };
  const highlightObjectWrapper = async (params: any): Promise<void> => {
    await wrapper(sidePanelService.highlightObject, params);
  };
  const duplicateWrapper = async (objectWorkingId: number): Promise<void> => {
    await wrapper(sidePanelNotificationHelper.setDuplicatePopup, {
      objectWorkingId,
      ...duplicatePopupParams,
    });
  };
  const editWrapper = async (params: any): Promise<void> => {
    await wrapper(sidePanelService.edit, params);
  };
  const repromptWrapper = async (...params: any): Promise<void> => {
    await wrapper(sidePanelService.reprompt, params);
  };
  const refreshWrapper = async (...params: any): Promise<void> => {
    await wrapper(sidePanelService.refresh, params);
  };
  const removeWrapper = async (...params: any): Promise<void> => {
    await wrapper(sidePanelService.remove, params);
  };
  const renameWrapper = async (params: any, name: string): Promise<void> => {
    await wrapper(sidePanelService.rename, params, name);
  };

  useEffect(() => {
    if (isDialogLoaded) {
      popupController.sendMessageToDialog(
        JSON.stringify({
          popupType,
          objects: loadedObjects,
          notifications,
          globalNotification,
          activeCellAddress,
          popupData,
        })
      );
    }
  }, [
    loadedObjects,
    notifications,
    globalNotification,
    activeCellAddress,
    isDialogLoaded,
    popupData,
    popupType,
  ]);

  return (
    <>
      {isSidePanelBlocked && <div className='block-side-panel-ui' />}
      {settingsPanelLoaded ? (
        <SettingsSidePanel />
      ) : (
        <SidePanel
          activeGroupKey={0}
          loadedObjects={loadedObjectsWrapped as any}
          onAddData={addDataWrapper}
          onTileClick={highlightObjectWrapper}
          onDuplicateClick={duplicateWrapper}
          onEditClick={editWrapper}
          onRefreshClick={refreshWrapper}
          onRemoveClick={removeWrapper}
          onRename={renameWrapper}
          popup={!isDialogRendered && sidePanelPopup}
          // @ts-expect-error
          settingsMenu={isSettings && <SettingsMenu />}
          onSettingsClick={() => toggleIsSettingsFlag(!isSettings)}
          confirmationWindow={isConfirm && <Confirmation />}
          globalNotification={globalNotification}
          onSelectAll={notificationService.dismissNotifications}
          shouldDisableActions={!officeReducerHelper.noOperationInProgress()}
          isPopupRendered={isDialogRendered}
          onRepromptClick={repromptWrapper}
          onPageByClick={(pageByLinkId: any) => {
            popupController.runImportedDataOverviewPopup();
            setFilteredPageByLinkId(pageByLinkId);
            setIsDataOverviewOpen(true);
          }}
          applicationType={OfficeApplicationType.EXCEL}
        />
      )}
    </>
  );
};

export const mapStateToProps = (state: RootState): any => {
  const { importRequested, dossierOpenRequested } = state.navigationTree;
  const { objects } = state.objectReducer;

  const {
    isConfirm,
    isSettings,
    isSecured,
    isClearDataFailed,
    settingsPanelLoaded,
    reusePromptAnswers,
    popupData,
    isDialogOpen,
    isDialogLoaded,
  } = state.officeReducer;

  return {
    loadedObjects: objects,
    importRequested,
    dossierOpenRequested,
    isConfirm,
    isSettings,
    isSecured,
    isClearDataFailed,
    settingsPanelLoaded,
    reusePromptAnswers,
    popupData,
    isDialogRendered: isDialogOpen,
    isDialogLoaded,
  };
};

const mapDispatchToProps = {
  cancelCurrentImportRequest: navigationTreeActions.cancelImportRequest,
  toggleIsSettingsFlag: officeActions.toggleIsSettingsFlag,
  toggleSecuredFlag: officeActions.toggleSecuredFlag,
  toggleIsClearDataFailedFlag: officeActions.toggleIsClearDataFailedFlag,
  updateActiveCellAddress: officeActions.updateActiveCellAddress,
  setIsDataOverviewOpen: popupStateActions.setIsDataOverviewOpen,
  setFilteredPageByLinkId: popupStateActions.setFilteredPageByLinkId,
};

export const RightSidePanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightSidePanelNotConnected);
