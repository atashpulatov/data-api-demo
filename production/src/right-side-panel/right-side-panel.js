import { SidePanel } from '@mstr/rc';
import React from 'react';
import { connect } from 'react-redux';
import { fileHistoryContainerHOC } from '../file-history/file-history-container-HOC';

const RightSidePanelNotConnected = (props) => {
  console.log(props);
  const middleWareForAddData = () => {
    console.log('gonna add data');
    props.addDataAction();
  };
  const mapLoadedObjects = (objects) => objects.map((object) => ({
    bindId: object.newBindingId,
    id: object.objectId,
    name: getName(object),
    objectType: object.mstrObjectType,
  }));
  // PropTypes.shape({
  //   bindId: PropTypes.string,
  //   body: PropTypes.shape({}),
  //   crosstabHeaderDimensions: PropTypes.shape({}),
  //   envUrl: PropTypes.string,
  //   id: PropTypes.string,
  //   isCrosstab: PropTypes.bool,
  //   isPrompted: PropTypes.bool,
  //   manipulationsXML: PropTypes.shape({}),
  //   name: PropTypes.string,
  //   objectType: PropTypes.shape({
  //     name: PropTypes.string,
  //     request: PropTypes.string,
  //     subtypes: PropTypes.arrayOf(PropTypes.number),
  //     type: PropTypes.number,
  //   }),
  //   isSelected: PropTypes.bool,
  //   projectId: PropTypes.string,
  //   promptsAnswers: PropTypes.shape({}),
  //   refreshDate: PropTypes.instanceOf(Date),
  //   subtotalInfo: PropTypes.shape({}),
  //   visualizationInfo: PropTypes.shape({}),
  //   loadingState: PropTypes.shape({}),
  //   actionType: PropTypes.string,
  //   totalRows: PropTypes.number,
  //   loadedRows: PropTypes.number,
  //   locale: PropTypes.string,
  // })
  return (
    <>
      <SidePanel
        loadedObjects={mapLoadedObjects(props.loadedObjects)}
        onAddData={middleWareForAddData}
        onToggleChecked={() => {}}
        onCheckAll={() => {}}
        onDuplicateClick={() => {}}
        onEditClick={() => {}}
        onRefreshClick={() => {}}
        onRefreshSelected={() => {}}
        onRemoveClick={() => {}}
        onRemoveSelected={() => {}}
        onRename={() => {}}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return { loadedObjects: state.objectReducer.objects, };
};

const mapDispatchToProps = {};

const RightSidePanelWrapped = fileHistoryContainerHOC(RightSidePanelNotConnected);

export const RightSidePanel = connect(mapStateToProps, mapDispatchToProps)(RightSidePanelWrapped);
function getName(object) {
  return object.instanceDefinition && object.instanceDefinition.mstrTable && object.instanceDefinition.mstrTable.name;
}
