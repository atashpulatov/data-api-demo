import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SidePanel, popupTypes } from '@mstr/rc';
import { cancelImportRequest, } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { SettingsMenu } from '../home/settings-menu';
import { Confirmation } from '../home/confirmation';
import * as officeActions from '../redux-reducer/office-reducer/office-actions';
import officeStoreHelper from '../office/store/office-store-helper';
import { sidePanelService } from './side-panel-service';
import './right-side-panel.scss';
import { officeApiHelper } from '../office/api/office-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import {
  IMPORT_OPERATION, REFRESH_OPERATION, EDIT_OPERATION, DUPLICATE_OPERATION, CLEAR_DATA_OPERATION, REMOVE_OPERATION
} from '../operation/operation-type-names';
import { errorService } from '../error/error-handler';

export const RightSidePanelNotConnected = (props) => {
  const {
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
  } = props;

  const [sidePanelPopup, setSidePanelPopup] = React.useState(null);
  const [activeCellAddress, setActiveCellAddress] = React.useState('...');
  const [duplicatedObjectId, setDuplicatedObjectId] = React.useState(null);
  const [loadedObjectsWrapped, setLoadedObjectsWrapped] = React.useState(loadedObjects);

  const duplicatePopupParams = { activeCellAddress, setDuplicatedObjectId, setSidePanelPopup };

  React.useEffect(() => {
    try {
      sidePanelService.addRemoveObjectListener();
      sidePanelService.initializeActiveCellChangedListener(setActiveCellAddress);
    } catch (error) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    officeStoreHelper.isFileSecured() && toggleSecuredFlag(true);
    officeStoreHelper.isClearDataFailed() && toggleIsClearDataFailedFlag(true);
  }, [toggleSecuredFlag, toggleIsClearDataFailedFlag]);

  React.useEffect(() => {
    setSidePanelPopup(sidePanelService.getSidePanelPopup());
  }, [isSecured, isClearDataFailed]);

  // Updates the activeCellAddress in duplicate popup if this popup is opened.
  React.useEffect(() => {
    if (sidePanelPopup !== null && sidePanelPopup.type === popupTypes.DUPLICATE && duplicatedObjectId !== null) {
      sidePanelService.setDuplicatePopup({ objectWorkingId: duplicatedObjectId, ...duplicatePopupParams });
    }
    // Added disable addition of sidePanelPopup and duplicatedObjectId to dependency array.
    // This effect should be called only if duplicate popup is opened and activeCellAddress changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCellAddress]);

  const handleSettingsClick = () => {
    officeReducerHelper.noOperationInProgress() && toggleIsSettingsFlag(!isSettings);
  };

  React.useEffect(() => {
    setLoadedObjectsWrapped(() => sidePanelService.injectNotificationsToObjects(
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
      await officeApiHelper.checkStatusOfSessions();
      if (officeReducerHelper.noOperationInProgress()) {
        await func(params, name);
      }
    } catch (error) {
      errorService.handleError(error);
    }
  };

  const addDataWrapper = async (params) => { await wrapper(sidePanelService.addData, params); };
  const highlightObjectWrapper = async (params) => { await wrapper(sidePanelService.highlightObject, params); };
  const duplicateWrapper = async (objectWorkingId) => {
    await wrapper(sidePanelService.setDuplicatePopup, { objectWorkingId, ...duplicatePopupParams });
  };
  const editWrapper = async (params) => { await wrapper(sidePanelService.edit, params); };
  const refreshWrapper = async (...params) => { await wrapper(sidePanelService.refresh, params); };
  const removeWrapper = async (...params) => { await wrapper(sidePanelService.remove, params); };
  const renameWrapper = async (params, name) => { await wrapper(sidePanelService.rename, params, name); };

  return (
    <SidePanel
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
    />
  );
};

export const mapStateToProps = (state) => {
  const { importRequested, dossierOpenRequested } = state.navigationTree;
  const { operations } = state.operationReducer;
  const { globalNotification, notifications } = state.notificationReducer;
  const {
    isConfirm, isSettings, isSecured, isClearDataFailed
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
    isClearDataFailed
  };
};

const mapDispatchToProps = {
  cancelCurrentImportRequest: cancelImportRequest,
  toggleIsSettingsFlag: officeActions.toggleIsSettingsFlag,
  toggleSecuredFlag: officeActions.toggleSecuredFlag,
  toggleIsClearDataFailedFlag: officeActions.toggleIsClearDataFailedFlag
};

export const RightSidePanel = connect(mapStateToProps, mapDispatchToProps)(RightSidePanelNotConnected);

RightSidePanelNotConnected.propTypes = {
  globalNotification: PropTypes.string,
  loadedObjects:
    PropTypes.shape({
      body: PropTypes.shape({}),
      objectWorkingId: PropTypes.string,
      bindId: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      mstrObjectType: PropTypes.shape({
        name: PropTypes.string,
        request: PropTypes.string,
        subtypes: PropTypes.arrayOf(PropTypes.number),
        type: PropTypes.number,
      }),
      refreshDate: PropTypes.instanceOf(Date),
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
    }).isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      title: PropTypes.string,
      details: PropTypes.string,
      percentage: PropTypes.number,
      onHover: PropTypes.func
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
        REMOVE_OPERATION,
      ]),
      objectWorkingId: PropTypes.number,
      stepsQueue: PropTypes.oneOf([{}]),
      backupObjectData: PropTypes.shape({}),
      objectEditedData: PropTypes.shape({}),
      instanceDefinition: PropTypes.shape({}),
      startCell: PropTypes.string,
      excelContext: PropTypes.shape({}),
      officeTable: PropTypes.shape({}),
      tableColumnsChanged: PropTypes.shape({}),
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
  toggleIsClearDataFailedFlag: PropTypes.func
};
