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

export const RightSidePanelNotConnected = (props) => {
  const {
    loadedObjects,
    isConfirm,
    isSettings,
    isSecured,
    toggleIsSettingsFlag,
    toggleSecuredFlag,
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
    // toggleSecuredFlag(false);
    if (officeStoreHelper.isFileSecured()) {
      toggleSecuredFlag(true);
    }
  }, [toggleSecuredFlag]);

  React.useEffect(() => {
    setSidePanelPopup(sidePanelService.getSidePanelPopup());
  }, [isSecured]);

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
        onAddData={sidePanelService.addData}
        onTileClick={sidePanelService.highlightObject}
        onDuplicateClick={openDuplicatePopup}
        onEditClick={sidePanelService.edit}
        onRefreshClick={sidePanelService.refresh}
        onRemoveClick={sidePanelService.remove}
        onRename={sidePanelService.rename}
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
  const { isConfirm, isSettings, isSecured } = state.officeReducer;
  return {
    loadedObjects: state.objectReducer.objects,
    importRequested,
    dossierOpenRequested,
    isConfirm,
    isSettings,
    globalNotification,
    isSecured,
  };
};

const mapDispatchToProps = {
  cancelCurrentImportRequest: cancelImportRequest,
  toggleIsSettingsFlag: officeActions.toggleIsSettingsFlag,
  toggleSecuredFlag: officeActions.toggleSecuredFlag,
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
  toggleIsSettingsFlag: PropTypes.func,
  toggleSecuredFlag: PropTypes.func,
};
