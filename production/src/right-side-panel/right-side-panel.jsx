import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  SidePanel, globalNotificationTypes, Button, buttonTypes, popupTypes
} from '@mstr/rc';
import { cancelImportRequest, } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { SettingsMenu } from '../home/settings-menu';
import { Confirmation } from '../home/confirmation';
import * as officeActions from '../redux-reducer/office-reducer/office-actions';
import officeStoreHelper from '../office/store/office-store-helper';
import { sidePanelService } from './side-panel-service';
import { notificationService } from '../notification-v2/notification-service';
import './right-side-panel.scss';
import { getNotificationButtons } from '../notification-v2/notification-buttons';
import { officeApiHelper } from '../office/api/office-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';

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
  } = props;

  const [sidePanelPopup, setSidePanelPopup] = React.useState(null);
  const [activeCellAddress, setActiveCellAddress] = React.useState('...');
  const [duplicatedObjectId, setDuplicatedObjectId] = React.useState(null);

  React.useEffect(() => {
    try {
      sidePanelService.addRemoveObjectListener();
      getInitialCellAdrress();
      addActiveCellAdrressChangedListener();
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
      setDuplicatePopup(duplicatedObjectId);
    }
    // Added disable addition of sidePanelPopup and duplicatedObjectId to dependency array.
    // This effect should be called only if duplicate popup is opened and activeCellAddress changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCellAddress]);

  const handleSettingsClick = () => toggleIsSettingsFlag(!isSettings);

  const mockConnectionLost = () => {
    notificationService.connectionLost();
    setTimeout(() => { notificationService.connectionRestored(); }, 3000);
  };

  const mockSessionExpired = () => {
    notificationService.sessionExpired();
    setTimeout(() => { notificationService.sessionRestored(); }, 3000);
  };

  const mockGlobalNotification = () => {
    const buttons = [
      {
        title: 'Ok',
        type: 'basic',
        label: 'Ok',
        onClick: () => { notificationService.globalNotificationDissapear(); },
      },
    ];
    const payload = {
      title: 'sum title',
      details: 'sum details',
      children: getNotificationButtons(buttons),
    };

    notificationService.globalWarningAppeared(payload);
  };

  /**
   * Wraps a function to be called when user clicks an action icon.
   *
   * Function will be called when:
   *
   * - session is valid,
   * - operation is not in progress.
   *
   * @param {Function} func Function to be wrapped
   * @param {*} params Parameters to wrapped function
   */
  const wrapper = async (func, params) => {
    await officeApiHelper.checkStatusOfSessions();

    if (officeReducerHelper.noOperationInProgress()) {
      await func(params);
    }
  };

  const addDataWrapper = async (params) => { await wrapper(sidePanelService.addData, params); };
  const highlightObjectWrapper = async (params) => { await wrapper(sidePanelService.highlightObject, params); };
  const duplicateWrapper = async (params) => { await wrapper(openDuplicatePopup, params); };
  const editWrapper = async (params) => { await wrapper(sidePanelService.edit, params); };
  const refreshWrapper = async (params) => { await wrapper(sidePanelService.refresh, params); };
  const removeWrapper = async (params) => { await wrapper(sidePanelService.remove, params); };
  const renameWrapper = async (params) => { await wrapper(sidePanelService.rename, params); };

  console.log(globalNotification);

  /**
   * Handles user click on duplicate icon.
   * Stores objectWorkingId in state of component as duplicatedObjectId.
   * Calls function responsible for displaying the duplicate popup.
   *
   * @param {Number} objectWorkingId - Uniqe id of source object for duplication.
   */
  const openDuplicatePopup = (objectWorkingId) => {
    setDuplicatedObjectId(objectWorkingId);
    setDuplicatePopup(objectWorkingId);
  };

  /**
   * Prepares the props and displays the side panel popup as duplicate popup.
   *
   * @param {*} objectWorkingId - Uniqe id of source object for duplication.
   */
  const setDuplicatePopup = (objectWorkingId) => {
    setSidePanelPopup({
      type: popupTypes.DUPLICATE,
      activeCell: activeCellAddress,
      onImport: (isActiveCellOptionSelected) => {
        sidePanelService.duplicate(objectWorkingId, !isActiveCellOptionSelected, false);
        setSidePanelPopup(null);
        setDuplicatedObjectId(null);
      },
      onEdit: (isActiveCellOptionSelected) => {
        sidePanelService.duplicate(objectWorkingId, !isActiveCellOptionSelected, true);
        setSidePanelPopup(null);
        setDuplicatedObjectId(null);
      },
      onClose: () => {
        setSidePanelPopup(null);
        setDuplicatedObjectId(null);
      }
    });
  };

  /**
   * Get initial excel active cell adrres value and store result in state of component.
   * Called once - after component mounts.
   *
   */
  const getInitialCellAdrress = async () => {
    const initialCellAdrress = await sidePanelService.getActiveCellAddress();
    setActiveCellAddress(initialCellAdrress);
  };

  /**
   * Attach event listener for selection changed and pass a state setter callback to event handler.
   * Callback is modyfying the activeCellAddress in state of component.
   * Called once - after component mounts.
   *
   */
  const addActiveCellAdrressChangedListener = async () => {
    await sidePanelService.addOnSelectionChangedListener(setActiveCellAddress);
  };

  return (
    <>
      <button type="button" onClick={mockConnectionLost}>Mock Connection lost</button>
      <button type="button" onClick={mockSessionExpired}>Mock Session expired</button>
      <button type="button" onClick={mockGlobalNotification}>Mock Global Notification</button>
      <SidePanel
        loadedObjects={loadedObjects}
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
    </>
  );
};

export const mapStateToProps = (state) => {
  const { importRequested, dossierOpenRequested } = state.navigationTree;
  const { globalNotification } = state.notificationReducer;
  const {
    isConfirm, isSettings, isSecured, isClearDataFailed
  } = state.officeReducer;
  return {
    loadedObjects: state.objectReducer.objects,
    importRequested,
    dossierOpenRequested,
    isConfirm,
    isSettings,
    globalNotification,
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
  isConfirm: PropTypes.bool,
  isSettings: PropTypes.bool,
  isSecured: PropTypes.bool,
  isClearDataFailed: PropTypes.bool,
  toggleIsSettingsFlag: PropTypes.func,
  toggleSecuredFlag: PropTypes.func,
  toggleIsClearDataFailedFlag: PropTypes.func
};
