import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SidePanel, objectNotificationTypes } from '@mstr/rc';
import { cancelImportRequest, } from '../navigation/navigation-tree-actions';
import { SettingsMenu } from '../home/settings-menu';
import { Confirmation } from '../home/confirmation';
import * as officeActions from '../office/store/office-actions';
import { officeStoreService } from '../office/store/office-store-service';
import { sidePanelService } from './side-panel-service';

import './right-side-panel.scss';
import { calculateLoadingProgress, operationStepsMap } from '../operation/operation-steps';

export const RightSidePanelNotConnected = (props) => {
  const {
    loadedObjects,
    isConfirm,
    isSettings,
    isSecured,
    toggleIsSettingsFlag,
    toggleSecuredFlag,
    globalNotification,
    notifications,
    operations,
  } = props;

  const [sidePanelPopup, setSidePanelPopup] = React.useState(null);
  const [loadedObjectsWrapped, setLoadedObjectsWrapped] = React.useState(loadedObjects);

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
  console.log(operationStepsMap.IMPORT_OPERATION);

  React.useEffect(() => {
    // console.log({ loadedObjects, operationReducer: operations, notifications });
    setLoadedObjectsWrapped(loadedObjects.map((object) => {
      const operation = operations.find((operation) => operation.objectWorkingId === object.objectWorkingId);
      const notification = notifications.find((notification) => notification.objectWorkingId === object.objectWorkingId);
      // console.log(operation);
      const obj = operation ? {
        ...object,
        notification: {
          ...notification,
          percentageComplete: operation.totalRows !== 0 ? calculateLoadingProgress(operation.operationType, operation.stepsQueue[0], operation.loadedRows, operation.totalRows) : 0,
          itemsTotal: operation.totalRows,
          itemsComplete: operation.loadedRows,
        }
      }
        : object;
      return obj;
    }));
  }, [loadedObjects, notifications, operations]);

  return (
    <SidePanel
      loadedObjects={loadedObjectsWrapped}
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
      globalNotificationType={globalNotification}
    />
  );
};

export const mapStateToProps = (state) => {
  const { importRequested, dossierOpenRequested } = state.navigationTree;
  const { operations } = state.operationReducer;
  const { globalNotification, notifications } = state.notificationReducer;
  const { isConfirm, isSettings, isSecured } = state.officeReducer;
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
