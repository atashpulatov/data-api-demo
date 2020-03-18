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
  return (
    <>
      <SidePanel
        loadedObjects={props.reportArray || []}
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

const mapStateToProps = (state) =>
  // console.log(state);
  ({});
const mapDispatchToProps = {};

const RightSidePanelWrapped = fileHistoryContainerHOC(RightSidePanelNotConnected);

export const RightSidePanel = connect(mapStateToProps, mapDispatchToProps)(RightSidePanelWrapped);
