import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SidePanel } from '@mstr/rc';
import { popupController } from '../popup/popup-controller';
import { cancelImportRequest, } from '../navigation/navigation-tree-actions';
import { errorService } from '../error/error-handler';
import { SettingsMenu } from '../home/settings-menu';
import { Confirmation } from '../home/confirmation';
import * as officeActions from '../office/store/office-actions';
import { officeStoreService } from '../office/store/office-store-service';
import { sidePanelService } from './side-panel-service';

import './right-side-panel.scss';

export const RightSidePanelNotConnected = (props) => {
  const {
    loadedObjects,
    isConfirm,
    isSettings,
    isSecured,
    cancelCurrentImportRequest,
    toggleIsSettingsFlag,
    toggleSecuredFlag,
  } = props;

  const [sidePanelPopup, setSidePanelPopup] = React.useState(null);

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

  React.useEffect(() => {
    setSidePanelPopup(sidePanelService.getSidePanelPopup());
  }, [isSecured]);

  const handleSettingsClick = () => toggleIsSettingsFlag(!isSettings);

  return (
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
    />
  );
};

export const mapStateToProps = (state) => {
  const { importRequested, dossierOpenRequested } = state.navigationTree;
  const { isConfirm, isSettings, isSecured } = state.officeReducer;
  return {
    loadedObjects: state.objectReducer.objects,
    importRequested,
    dossierOpenRequested,
    isConfirm,
    isSettings,
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
  cancelCurrentImportRequest: PropTypes.func,
};
