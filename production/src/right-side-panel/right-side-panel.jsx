import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  SidePanel, globalNotificationTypes, Button, buttonTypes
} from '@mstr/rc';
import { cancelImportRequest, } from '../navigation/navigation-tree-actions';
import { SettingsMenu } from '../home/settings-menu';
import { Confirmation } from '../home/confirmation';
import * as officeActions from '../office/store/office-actions';
import { officeStoreService } from '../office/store/office-store-service';
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

  React.useEffect(() => {
    try {
      sidePanelService.addRemoveObjectListener();
    } catch (error) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    // toggleSecuredFlag(false);
    if (officeStoreService.isFileSecured()) {
      toggleSecuredFlag(true);
    }
  }, [toggleSecuredFlag]);

  React.useEffect(() => {
    setSidePanelPopup(sidePanelService.getSidePanelPopup());
  }, [isSecured]);

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
