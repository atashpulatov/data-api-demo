import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { PopupTypes, SidePanel } from '@mstr/connector-components';

import { notificationService } from '../notification/notification-service';
import { officeApiHelper } from '../office/api/office-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import officeStoreHelper from '../office/store/office-store-helper';
import { sidePanelEventHelper } from './side-panel-event-helper';
import { sidePanelNotificationHelper } from './side-panel-notification-helper';
import { sidePanelService } from './side-panel-service';

import { RootState } from '../store';

import { ObjectData } from '../redux-reducer/object-reducer/object-reducer-types';

import { Confirmation } from '../home/confirmation';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { SettingsMenu } from '../home/settings-menu';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupController } from '../popup/popup-controller';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import {
  selectGlobalNotification,
  selectNotifications,
} from '../redux-reducer/notification-reducer/notification-reducer-selectors';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { selectOperations } from '../redux-reducer/operation-reducer/operation-reducer-selectors';

import './right-side-panel.scss';

interface RightSidePanelProps {
  popupData?: { objectWorkingId: number; callback: Function };
  loadedObjects: ObjectData[];
  isConfirm?: boolean;
  isSettings?: boolean;
  isSecured?: boolean;
  isClearDataFailed?: boolean;
  settingsPanelLoaded?: boolean;
  reusePromptAnswers?: boolean;
  toggleIsSettingsFlag?: (flag?: boolean) => void;
  toggleSecuredFlag?: (flag?: boolean) => void;
  toggleIsClearDataFailedFlag?: (flag?: boolean) => void;
  updateActiveCellAddress?: (cellAddress?: string) => void;
  isDialogRendered?: boolean;
  isDialogLoaded?: boolean;
  toggleCurtain?: boolean;
  activeCellAddress?: string;
  popupType?: PopupTypeEnum;
  isDataOverviewOpen?: boolean;
  setIsDataOverviewOpen: (isDataOverviewOpen: boolean) => void;
  setFilteredPageByLinkId: (filteredPageByLinkId: string) => void;
}

export const RightSidePanelNotConnected: React.FC<RightSidePanelProps> = ({
  loadedObjects,
  isConfirm,
  isSettings,
  isSecured,
  isClearDataFailed,
  settingsPanelLoaded,
  reusePromptAnswers,
  toggleIsSettingsFlag,
  toggleSecuredFlag,
  toggleIsClearDataFailedFlag,
  updateActiveCellAddress,
  popupData,
  isDialogRendered,
  isDialogLoaded,
  toggleCurtain,
  activeCellAddress,
  popupType,
  isDataOverviewOpen,
  setIsDataOverviewOpen,
  setFilteredPageByLinkId,
}) => {
  const [sidePanelPopup, setSidePanelPopup] = useState(null);
  const [duplicatedObjectId, setDuplicatedObjectId] = useState(null);
  const [loadedObjectsWrapped, setLoadedObjectsWrapped] = useState(loadedObjects);

  const operations = useSelector(selectOperations);
  const globalNotification = useSelector(selectGlobalNotification);
  const notifications = useSelector(selectNotifications);

  const duplicatePopupParams = {
    activeCellAddress,
    setDuplicatedObjectId,
    setSidePanelPopup,
  };

  useEffect(() => {
    async function initializeSidePanel(): Promise<void> {
      try {
        await sidePanelEventHelper.addRemoveObjectListener();
        await sidePanelEventHelper.initializeActiveCellChangedListener(updateActiveCellAddress);
        await sidePanelService.initReusePromptAnswers();
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

  useEffect(() => {
    setSidePanelPopup(sidePanelNotificationHelper.setClearDataPopups());
  }, [isSecured, isClearDataFailed]);

  // Updates the activeCellAddress in duplicate popup if this popup is opened.
  useEffect(() => {
    if (
      sidePanelPopup !== null &&
      sidePanelPopup.type === PopupTypes.DUPLICATE &&
      duplicatedObjectId !== null
    ) {
      sidePanelNotificationHelper.setDuplicatePopup({
        objectWorkingId: duplicatedObjectId,
        ...duplicatePopupParams,
      });
    }
    // Added disable addition of sidePanelPopup and duplicatedObjectId to dependency array.
    // This effect should be called only if duplicate popup is opened and activeCellAddress changes.
    // TODO: Move logic for controlling popup visibility to Redux
    if (popupData) {
      sidePanelNotificationHelper.setRangeTakenPopup({
        ...popupData,
        setSidePanelPopup,
        activeCellAddress,
      });

      // For the mulitiple reprompt workflow from the side panel, pass the popupData to the native dialog
      const { objectWorkingId } = popupData;
      const objectData =
        officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
      const isDossier =
        objectData.mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name;
      const isReport = objectData.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
      if ((isDossier || isReport) && toggleCurtain && !isDataOverviewOpen) {
        popupController.sendMessageToDialog(JSON.stringify({ popupData }));
      }
    } else if (sidePanelPopup?.type === PopupTypes.RANGE_TAKEN) {
      setSidePanelPopup(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCellAddress, popupData]);

  useEffect(() => {
    setLoadedObjectsWrapped(() =>
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
  const handleReusePromptAnswers = async (): Promise<void> => {
    await wrapper(sidePanelService.toggleReusePromptAnswers, reusePromptAnswers);
  };

  const handleToggleSettingsPanel = (): void => {
    sidePanelService.toggleSettingsPanel(settingsPanelLoaded);
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
      {toggleCurtain && <div className='block-side-panel-ui' />}
      <SidePanel
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
        reusePromptAnswers={reusePromptAnswers}
        settingsPanelLoaded={settingsPanelLoaded}
        handleReusePromptAnswers={handleReusePromptAnswers}
        handleToggleSettingsPanel={handleToggleSettingsPanel}
        onRepromptClick={repromptWrapper}
        onPageByClick={pageByLinkId => {
          popupController.runImportedDataOverviewPopup();
          setFilteredPageByLinkId(pageByLinkId);
          setIsDataOverviewOpen(true);
        }}
      />
    </>
  );
};

export const mapStateToProps = (state: RootState): any => {
  const { importRequested, dossierOpenRequested } = state.navigationTree;
  const { repromptsQueue } = state.repromptsQueueReducer;
  const { popupType, isDataOverviewOpen } = state.popupStateReducer;
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
    activeCellAddress,
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
    toggleCurtain: repromptsQueue?.length > 0,
    activeCellAddress,
    popupType,
    isDataOverviewOpen,
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
