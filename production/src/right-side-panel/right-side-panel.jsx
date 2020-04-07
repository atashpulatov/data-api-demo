import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  SidePanel, globalNotificationTypes, Button, buttonTypes
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
    isClearDataFailed,
    toggleIsSettingsFlag,
    toggleSecuredFlag,
    toggleIsClearDataFailedFlag,
    globalNotification,
  } = props;

  const [sidePanelPopup, setSidePanelPopup] = React.useState(null);

  React.useEffect(() => {
    try {
      sidePanelService.addRemoveObjectListener();
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

  return (
    <>
      <button type="button" onClick={mockConnectionLost}>Mock Connection lost</button>
      <button type="button" onClick={mockSessionExpired}>Mock Session expired</button>
      <button type="button" onClick={mockGlobalNotification}>Mock Global Notification</button>
      <SidePanel
        loadedObjects={loadedObjects}
        onAddData={sidePanelService.addData}
        onTileClick={sidePanelService.highlightObject}
        onDuplicateClick={sidePanelService.duplicate}
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
