// issue with proptype import
// eslint-disable-next-line simple-import-sort/imports
import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { PopupTypes, SidePanel } from '@mstr/connector-components';
import PropTypes from 'prop-types';
import { notificationService } from '../notification/notification-service';
import { officeApiHelper } from '../office/api/office-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import officeStoreHelper from '../office/store/office-store-helper';
import { sidePanelEventHelper } from './side-panel-event-helper';
import { sidePanelNotificationHelper } from './side-panel-notification-helper';
import { sidePanelService } from './side-panel-service';
import { selectOperations } from '../redux-reducer/operation-reducer/operation-reducer-selectors';
import {
  selectNotifications,
  selectGlobalNotification,
} from '../redux-reducer/notification-reducer/notification-reducer-selectors';

import { Confirmation } from '../home/confirmation';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { SettingsMenu } from '../home/settings-menu';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupController } from '../popup/popup-controller';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';

import './right-side-panel.scss';

export const RightSidePanelNotConnected = ({
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
    async function initializeSidePanel() {
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
   * @param {Function} func Function to be wrapped
   * @param {*} params Parameters to wrapped function
   * @param {String} name Optional new name of an object
   */
  const wrapper = async (func, params, name) => {
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

  const addDataWrapper = async params => {
    await wrapper(sidePanelService.addData, params);
  };
  const highlightObjectWrapper = async params => {
    await wrapper(sidePanelService.highlightObject, params);
  };
  const duplicateWrapper = async objectWorkingId => {
    await wrapper(sidePanelNotificationHelper.setDuplicatePopup, {
      objectWorkingId,
      ...duplicatePopupParams,
    });
  };
  const editWrapper = async params => {
    await wrapper(sidePanelService.edit, params);
  };
  const repromptWrapper = async (...params) => {
    await wrapper(sidePanelService.reprompt, params);
  };
  const refreshWrapper = async (...params) => {
    await wrapper(sidePanelService.refresh, params);
  };
  const removeWrapper = async (...params) => {
    await wrapper(sidePanelService.remove, params);
  };
  const renameWrapper = async (params, name) => {
    await wrapper(sidePanelService.rename, params, name);
  };
  const handleReusePromptAnswers = async () => {
    await wrapper(sidePanelService.toggleReusePromptAnswers, reusePromptAnswers);
  };

  const handleToggleSettingsPanel = () => {
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
        loadedObjects={loadedObjectsWrapped}
        onAddData={addDataWrapper}
        onTileClick={highlightObjectWrapper}
        onDuplicateClick={duplicateWrapper}
        onEditClick={editWrapper}
        onRefreshClick={refreshWrapper}
        onRemoveClick={removeWrapper}
        onRename={renameWrapper}
        popup={!isDialogRendered && sidePanelPopup}
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
      />
    </>
  );
};

export const mapStateToProps = state => {
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
};

export const RightSidePanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightSidePanelNotConnected);

RightSidePanelNotConnected.propTypes = {
  popupData: PropTypes.shape({ objectWorkingId: PropTypes.number }),
  globalNotification: PropTypes.shape({ type: PropTypes.string }),
  loadedObjects: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.shape({}),
      objectWorkingId: PropTypes.number,
      bindId: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      mstrObjectType: PropTypes.shape({
        name: PropTypes.string,
        request: PropTypes.string,
        subtypes: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.number)]),
        type: PropTypes.number || PropTypes.string,
      }),
      refreshDate: PropTypes.number,
      visualizationInfo: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
          chapterKey: PropTypes.string,
          visualizationKey: PropTypes.string,
          dossierStructure: PropTypes.shape({
            chapterName: PropTypes.string,
            dossierName: PropTypes.string,
            pageName: PropTypes.string,
          }),
        }),
      ]),
      isSelected: PropTypes.bool,
    })
  ).isRequired,
  isConfirm: PropTypes.bool,
  isSettings: PropTypes.bool,
  isSecured: PropTypes.bool,
  isClearDataFailed: PropTypes.bool,
  settingsPanelLoaded: PropTypes.bool,
  reusePromptAnswers: PropTypes.bool,
  toggleIsSettingsFlag: PropTypes.func,
  toggleSecuredFlag: PropTypes.func,
  toggleIsClearDataFailedFlag: PropTypes.func,
  updateActiveCellAddress: PropTypes.func,
  isDialogRendered: PropTypes.bool,
  isDialogLoaded: PropTypes.bool,
  toggleCurtain: PropTypes.bool,
  activeCellAddress: PropTypes.string,
  popupType: PropTypes.oneOf(Object.values(PopupTypeEnum)),
  isDataOverviewOpen: PropTypes.bool,
};
