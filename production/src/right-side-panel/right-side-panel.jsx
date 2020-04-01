import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SidePanel, globalNotificationTypes } from '@mstr/rc';
import { cancelImportRequest, } from '../navigation/navigation-tree-actions';
import { SettingsMenu } from '../home/settings-menu';
import { Confirmation } from '../home/confirmation';
import * as officeActions from '../office/store/office-actions';
import { officeStoreService } from '../office/store/office-store-service';
import { sidePanelService } from './side-panel-service';
import { notificationService } from '../notification-v2/notification-service';

export const RightSidePanelNotConnected = (props) => {
  const {
    loadedObjects,
    isConfirm,
    isSettings,
    toggleIsSettingsFlag,
    toggleSecuredFlag,
    globalNotification,
  } = props;

  const emptyCallback = (parameters) => {
    console.log(parameters);
    throw new Error('Not implemented yet');
  };

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

  const handleSettingsClick = () => toggleIsSettingsFlag(!isSettings);

  const simulateConnectionLost = async () => {
    notificationService.connectionLost();
    setTimeout(() => {
      notificationService.connectionRestored();
    }, 2000);
  };

  const simulateSessionExpired = async () => {
    notificationService.sessionExpired();
    setTimeout(() => {
      notificationService.sessionRestored();
    }, 2000);
  };

  return (
    <>
      <button type="button" onClick={simulateConnectionLost}>Test connection lost</button>
      <button type="button" onClick={simulateSessionExpired}>Test session expired</button>
      <SidePanel
        loadedObjects={loadedObjects}
        onAddData={sidePanelService.addData}
        onToggleChecked={emptyCallback}
        onCheckAll={sidePanelService.refreshSelected}
        onDuplicateClick={sidePanelService.highlightObject}
        onEditClick={emptyCallback}
        onRefreshClick={sidePanelService.refresh}
        onRefreshSelected={sidePanelService.refreshSelected}
        onRemoveClick={sidePanelService.remove}
        onRemoveSelected={sidePanelService.removeSelected}
        onRename={sidePanelService.rename}
        settingsMenu={isSettings && <SettingsMenu />}
        onSettingsClick={handleSettingsClick}
        confirmationWindow={isConfirm && <Confirmation />}
        globalNotificationType={globalNotification}
      />
    </>
  );
};

export const mapStateToProps = (state) => {
  const { importRequested, dossierOpenRequested } = state.navigationTree;
  const { isConfirm, isSettings } = state.officeReducer;
  const { globalNotification } = state.notificationReducer;
  return {
    loadedObjects: state.objectReducer.objects,
    importRequested,
    dossierOpenRequested,
    isConfirm,
    isSettings,
    globalNotification,
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
  toggleIsSettingsFlag: PropTypes.func,
  toggleSecuredFlag: PropTypes.func,
};
