// issue with proptype import
// eslint-disable-next-line simple-import-sort/imports
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { PopupTypes, SidePanel } from '@mstr/connector-components';

import PropTypes from 'prop-types';
import { notificationService } from '../notification/notification-service';
import { officeApiHelper } from '../office/api/office-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import officeStoreHelper from '../office/store/office-store-helper';
import { sidePanelEventHelper } from './side-panel-event-helper';
import { sidePanelNotificationHelper } from './side-panel-notification-helper';
import { sidePanelService } from './side-panel-service';

import { Confirmation } from '../home/confirmation';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { SettingsMenu } from '../home/settings-menu';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import {
  CLEAR_DATA_OPERATION,
  DUPLICATE_OPERATION,
  EDIT_OPERATION,
  HIGHLIGHT_OPERATION,
  IMPORT_OPERATION,
  REFRESH_OPERATION,
  REMOVE_OPERATION,
} from '../operation/operation-type-names';
import { popupController } from '../popup/popup-controller';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';

import './right-side-panel.scss';
import { objectImportType } from '../mstr-object/constants';

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
  globalNotification,
  notifications,
  operations,
  popupData,
  isDialogRendered,
  isDialogLoaded,
  toggleCurtain,
  activeCellAddress,
  popupType,
  isDataOverviewOpen,
  isShapeAPISupported,
}) => {
  const [sidePanelPopup, setSidePanelPopup] = React.useState(null);
  const [duplicatedObjectId, setDuplicatedObjectId] = React.useState(null);
  const [loadedObjectsWrapped, setLoadedObjectsWrapped] = React.useState(loadedObjects);

  const duplicatePopupParams = {
    activeCellAddress,
    setDuplicatedObjectId,
    setSidePanelPopup,
  };

  React.useEffect(() => {
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

  React.useEffect(() => {
    officeStoreHelper.isFileSecured() && toggleSecuredFlag(true);
    officeStoreHelper.isClearDataFailed() && toggleIsClearDataFailedFlag(true);
  }, [toggleSecuredFlag, toggleIsClearDataFailedFlag]);

  React.useEffect(() => {
    setSidePanelPopup(sidePanelNotificationHelper.setClearDataPopups());
  }, [isSecured, isClearDataFailed]);

  // Updates the activeCellAddress in duplicate popup if this popup is opened.
  React.useEffect(() => {
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

  React.useEffect(() => {
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

  // DE288915: Before rendering SidePanel, determine whether or not to filter out
  // the image objects if the shape api is not supported instead of
  // doing it in mapStateToProps when mapping state properties as it could cause sending
  // extra notifications.
  const sidePanelLoadedObjects = isShapeAPISupported ? loadedObjectsWrapped
    : loadedObjectsWrapped.filter(object => object?.importType !== objectImportType.IMAGE);

  return (
    <>
      {toggleCurtain && <div className='block-side-panel-ui' />}
      <SidePanel
        loadedObjects={sidePanelLoadedObjects}
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
  const { operations } = state.operationReducer;
  const { globalNotification, notifications } = state.notificationReducer;
  const { repromptsQueue } = state.repromptsQueueReducer;
  const { popupType, isDataOverviewOpen } = state.popupStateReducer;

  // TODO: Discuss with team to filter the objects based on images to avoid
  // re-rendering of the side panel when the images are loaded and notifications
  // sending more messages conflicting with Re-prompt and Edit workflows.
  //
  // const objects = officeReducerHelper.getObjectsListFromObjectReducer();
  const { objects } = state.objectReducer;
  const { isShapeAPISupported } = state.officeReducer;

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
    operations,
    importRequested,
    dossierOpenRequested,
    isConfirm,
    isSettings,
    globalNotification,
    notifications,
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
    isShapeAPISupported,
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
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      title: PropTypes.string,
      details: PropTypes.string,
      percentage: PropTypes.number,
      dismissNotification: PropTypes.func,
    })
  ),
  operations: PropTypes.arrayOf(
    PropTypes.shape({
      operationType: PropTypes.oneOf([
        IMPORT_OPERATION,
        REFRESH_OPERATION,
        EDIT_OPERATION,
        DUPLICATE_OPERATION,
        CLEAR_DATA_OPERATION,
        HIGHLIGHT_OPERATION,
        REMOVE_OPERATION,
      ]),
      objectWorkingId: PropTypes.number,
      stepsQueue: PropTypes.arrayOf(PropTypes.string),
      backupObjectData: PropTypes.shape({}),
      objectEditedData: PropTypes.shape({}),
      instanceDefinition: PropTypes.shape({}),
      startCell: PropTypes.string,
      excelContext: PropTypes.shape({}),
      officeTable: PropTypes.shape({}),
      tableChanged: PropTypes.boolean,
      totalRows: PropTypes.number,
      loadedRows: PropTypes.number,
      shouldFormat: PropTypes.bool,
    })
  ),
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
  isShapeAPISupported: PropTypes.bool,
};
