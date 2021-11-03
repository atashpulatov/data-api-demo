import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SidePanel, popupTypes } from '@mstr/connector-components';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { SettingsMenu } from '../home/settings-menu';
import { Confirmation } from '../home/confirmation';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import officeStoreHelper from '../office/store/office-store-helper';
import { sidePanelService } from './side-panel-service';
import './right-side-panel.scss';
import { officeApiHelper } from '../office/api/office-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { notificationService } from '../notification-v2/notification-service';
import { sidePanelEventHelper } from './side-panel-event-helper';
import { sidePanelNotificationHelper } from './side-panel-notification-helper';
import {
  IMPORT_OPERATION, REFRESH_OPERATION, EDIT_OPERATION,
  DUPLICATE_OPERATION, CLEAR_DATA_OPERATION, REMOVE_OPERATION,
  HIGHLIGHT_OPERATION
} from '../operation/operation-type-names';

export const RightSidePanelNotConnected = ({
  loadedObjects,
  isConfirm,
  isSettings,
  isSecured,
  isClearDataFailed,
  toggleIsSettingsFlag,
  toggleSecuredFlag,
  toggleIsClearDataFailedFlag,
  globalNotification,
  notifications,
  operations,
  popupData,
  isPopupRendered
}) => {
  const [sidePanelPopup, setSidePanelPopup] = React.useState(null);
  const [activeCellAddress, setActiveCellAddress] = React.useState('...');
  const [duplicatedObjectId, setDuplicatedObjectId] = React.useState(null);
  const [loadedObjectsWrapped, setLoadedObjectsWrapped] = React.useState(loadedObjects);

  const { i18n } = useTranslation('common');

  const duplicatePopupParams = { activeCellAddress, setDuplicatedObjectId, setSidePanelPopup };

  React.useEffect(() => {
    async function initializeSidePanel() {
      try {
        await sidePanelEventHelper.addRemoveObjectListener();
        await sidePanelEventHelper.initializeActiveCellChangedListener(setActiveCellAddress);
      } catch (error) {
        console.error(error);
      }
    }
    initializeSidePanel();
  }, []);

  React.useEffect(() => {
    officeStoreHelper.isFileSecured() && toggleSecuredFlag(true);
    officeStoreHelper.isClearDataFailed() && toggleIsClearDataFailedFlag(true);
  }, [toggleSecuredFlag, toggleIsClearDataFailedFlag]);

  React.useEffect(() => {
    setSidePanelPopup(sidePanelNotificationHelper.setClearDataPopups());
  }, [isSecured, isClearDataFailed]);

  // Updates the activeCellAddress in duplicate popup if this popup is opened.
  React.useEffect(() => {
    if (sidePanelPopup !== null && sidePanelPopup.type === popupTypes.DUPLICATE && duplicatedObjectId !== null) {
      sidePanelNotificationHelper.setDuplicatePopup({ objectWorkingId: duplicatedObjectId, ...duplicatePopupParams });
    }
    // Added disable addition of sidePanelPopup and duplicatedObjectId to dependency array.
    // This effect should be called only if duplicate popup is opened and activeCellAddress changes.
    if (popupData) {
      sidePanelNotificationHelper.setRangeTakenPopup({ ...popupData, setSidePanelPopup, activeCellAddress });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCellAddress, popupData]);

  const handleSettingsClick = () => {
    officeReducerHelper.noOperationInProgress() && toggleIsSettingsFlag(!isSettings);
  };

  React.useEffect(() => {
    setLoadedObjectsWrapped(() => sidePanelNotificationHelper.injectNotificationsToObjects(
      loadedObjects,
      notifications,
      operations
    ));
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

  const addDataWrapper = async (params) => { await wrapper(sidePanelService.addData, params); };
  const highlightObjectWrapper = async (params) => { await wrapper(sidePanelService.highlightObject, params); };
  const duplicateWrapper = async (objectWorkingId) => {
    await wrapper(sidePanelNotificationHelper.setDuplicatePopup, { objectWorkingId, ...duplicatePopupParams });
  };
  const editWrapper = async (params) => { await wrapper(sidePanelService.edit, params); };
  const refreshWrapper = async (...params) => { await wrapper(sidePanelService.refresh, params); };
  const removeWrapper = async (...params) => { await wrapper(sidePanelService.remove, params); };
  const renameWrapper = async (params, name) => { await wrapper(sidePanelService.rename, params, name); };

  return (
    <SidePanel
      locale={i18n.language}
      loadedObjects={loadedObjectsWrapped}
      onAddData={addDataWrapper}
      onTileClick={highlightObjectWrapper}
      onDuplicateClick={duplicateWrapper}
      onEditClick={editWrapper}
      onRefreshClick={refreshWrapper}
      onRemoveClick={removeWrapper}
      onRename={renameWrapper}
      popup={sidePanelPopup}
      settingsMenu={isSettings && <SettingsMenu />}
      onSettingsClick={handleSettingsClick}
      confirmationWindow={isConfirm && <Confirmation />}
      globalNotification={globalNotification}
      onSelectAll={notificationService.dismissNotifications}
      shouldDisableActions={!officeReducerHelper.noOperationInProgress()}
      isPopupRendered={isPopupRendered}
    />
  );
};

export const mapStateToProps = (state) => {
  const { importRequested, dossierOpenRequested } = state.navigationTree;
  const { operations } = state.operationReducer;
  const { globalNotification, notifications } = state.notificationReducer;
  const {
    isConfirm, isSettings, isSecured, isClearDataFailed, popupOpen, popupData
  } = state.officeReducer;
  return {
    loadedObjects: state.objectReducer.objects,
    operations,
    importRequested,
    dossierOpenRequested,
    isConfirm,
    isSettings,
    globalNotification,
    notifications,
    isSecured,
    isClearDataFailed,
    popupData,
    isPopupRendered: popupOpen,
  };
};

const mapDispatchToProps = {
  cancelCurrentImportRequest: navigationTreeActions.cancelImportRequest,
  toggleIsSettingsFlag: officeActions.toggleIsSettingsFlag,
  toggleSecuredFlag: officeActions.toggleSecuredFlag,
  toggleIsClearDataFailedFlag: officeActions.toggleIsClearDataFailedFlag,
};

export const RightSidePanel = connect(mapStateToProps, mapDispatchToProps)(RightSidePanelNotConnected);

RightSidePanelNotConnected.propTypes = {
  popupData: PropTypes.shape({}),
  globalNotification: PropTypes.shape({}),
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
        type: PropTypes.number,
      }),
      refreshDate: PropTypes.number,
      visualizationInfo: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
        chapterKey: PropTypes.string,
        visualizationKey: PropTypes.string,
        dossierStructure: PropTypes.shape({
          chapterName: PropTypes.string,
          dossierName: PropTypes.string,
          pageName: PropTypes.string,
        }),
      })]),
      isSelected: PropTypes.bool,
    })
  ).isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      title: PropTypes.string,
      details: PropTypes.string,
      percentage: PropTypes.number,
      dismissNotification: PropTypes.func
    }),
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
  toggleIsSettingsFlag: PropTypes.func,
  toggleSecuredFlag: PropTypes.func,
  toggleIsClearDataFailedFlag: PropTypes.func,
  isPopupRendered: PropTypes.bool,
};
