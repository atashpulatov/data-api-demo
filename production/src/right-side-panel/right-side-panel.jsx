import { SidePanel } from '@mstr/rc';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { popupController } from '../popup/popup-controller';
import { reduxStore } from '../store';
import { CANCEL_REQUEST_IMPORT, } from '../navigation/navigation-tree-actions';
import { errorService } from '../error/error-handler';
import { sidePanelService } from './side-panel-service';

export const RightSidePanelNotConnected = (props) => {
  const { loadedObjects } = props;
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

  return (
    <SidePanel
      loadedObjects={loadedObjects}
      onAddData={sidePanelService.addData}
      onToggleChecked={emptyCallback}
      onCheckAll={emptyCallback}
      onDuplicateClick={emptyCallback}
      onEditClick={emptyCallback}
      onRefreshClick={sidePanelService.refresh}
      onRefreshSelected={emptyCallback}
      onRemoveClick={sidePanelService.remove}
      onRemoveSelected={emptyCallback}
      onRename={emptyCallback}
    />
  );
};

export const mapStateToProps = (state) => {
  const { importRequested, dossierOpenRequested } = state.navigationTree;
  return {
    loadedObjects: state.objectReducer.objects,
    importRequested,
    dossierOpenRequested,
  };
};

const mapDispatchToProps = {};

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
};
