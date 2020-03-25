import { SidePanel } from '@mstr/rc';
import React from 'react';
import { connect } from 'react-redux';
import { fileHistoryContainerHOC } from '../file-history/file-history-container-HOC';
import { popupController } from '../popup/popup-controller';
import { reduxStore } from '../store';
import { officeProperties } from '../office/store/office-properties';
import {
  CANCEL_REQUEST_IMPORT,
  CANCEL_DOSSIER_OPEN
} from '../navigation/navigation-tree-actions';
import { officeApiHelper } from '../office/api/office-api-helper';
import { errorService } from '../error/error-handler';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';

const RightSidePanelNotConnected = (props) => {
  console.log(props);
  const { importRequested, dossierOpenRequested } = props;
  const [allowAddDataClick, setAllowAddDataClick] = React.useState(true);
  const middleWareForAddData = () => {
    console.log('gonna add data');
    addDataAction();
  };
  const mapLoadedObjects = (objects) => objects.map((object) => ({
    bindId: object.newBindingId,
    id: object.objectId,
    name: object.name,
    objectType: object.mstrObjectType,

  }));
  const emptyCallback = (parameters) => {
    console.log(parameters);
  };

  const addDataAction = async () => {
    try {
      // const excelContext = await officeApiHelper.getExcelContext();
      // await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext);

      // // Prevent navigation tree from going straight into importing previously selected item.
      reduxStore.dispatch({ type: CANCEL_REQUEST_IMPORT });
      // // if (navigationTree.myLibrary) reduxStore.dispatch({ type: SWITCH_MY_LIBRARY });
      // if (dossierOpenRequested) { reduxStore.dispatch({ type: CANCEL_DOSSIER_OPEN }); }
      // reduxStore.dispatch({ type: officeProperties.actions.startLoading });
      // if (allowAddDataClick) {
      //   this.setState({ allowAddDataClick: false }, async () => {
      await popupController.runPopupNavigation();
      //     if (this.ismounted) { this.setState({ allowAddDataClick: true }); }
      //   });
      // }
    } catch (error) {
      errorService.handleError(error);
    }
  };

  return (
    <>
      <SidePanel
        loadedObjects={mapLoadedObjects(props.loadedObjects)}
        onAddData={middleWareForAddData}
        onToggleChecked={emptyCallback}
        onCheckAll={emptyCallback}
        onDuplicateClick={emptyCallback}
        onEditClick={emptyCallback}
        onRefreshClick={emptyCallback}
        onRefreshSelected={emptyCallback}
        onRemoveClick={emptyCallback}
        onRemoveSelected={emptyCallback}
        onRename={emptyCallback}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  const { importRequested, dossierOpenRequested } = state.navigationTree;
  return {
    loadedObjects: state.objectReducer.objects,
    importRequested,
    dossierOpenRequested,
  };
};

const mapDispatchToProps = {};

export const RightSidePanel = connect(mapStateToProps, mapDispatchToProps)(RightSidePanelNotConnected);
