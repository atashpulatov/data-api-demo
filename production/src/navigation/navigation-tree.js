import React, {Component} from 'react';
import '../index.css';
import '../home/home.css';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {PopupButtons} from '../popup/popup-buttons.jsx';
import {FolderBrowser} from 'mstr-react-library';
import {connect} from 'react-redux';
import {actions} from './navigation-tree-actions';
import {mstrObjectRestService} from '../mstr-object/mstr-object-rest-service';

export class _NavigationTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: {
        USE_PROXY: false,
        url: this.props.parsed.envUrl,
        authToken: this.props.parsed.token,
      },
      reportId: this.props.parsed.reportId,
      triggerUpdate: false,
      chosenObjectId: this.props.chosenObjectId,
      chosenProjectId: this.props.chosenProjectId,
      chosenSubtype: this.props.chosenSubtype,
      previewDisplay: false,
    };
  }

  onTriggerUpdate = (body) => {
    const updateObject = {
      command: selectorProperties.commandOnUpdate,
      body,
    };
    Office.context.ui.messageParent(JSON.stringify(updateObject));
  };

  handleOk = () => {
    this.props.requestImport();
  };

  handleSecondary = () => {
    this.props.handlePrepare(this.props.chosenProjectId, this.props.chosenObjectId,
        this.props.chosenSubtype, this.props.chosenProjectName, this.props.chosenType);
    this.setState({previewDisplay: true});
  };

  handleCancel = () => {
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  };

  // TODO: temporary solution
  onObjectChosen = async (objectId, projectId, subtype) => {
    this.props.selectObject({
      chosenObjectId: undefined,
      chosenProjectId: undefined,
      chosenSubtype: undefined,
      isPrompted: undefined,
    });

    const isPrompted = await mstrObjectRestService.isPrompted(objectId);

    this.props.selectObject({
      chosenObjectId: objectId,
      chosenProjectId: projectId,
      chosenSubtype: subtype,
      isPrompted,
    });
  };

  render() {
    const {setDataSource, dataSource, chosenObjectId, chosenProjectId, pageSize, changeSearching, changeSorting,
      chosenSubtype, folder, selectFolder, loading, handlePopupErrors, scrollPosition, searchText, sorter,
      updateScroll, updateSize} = this.props;
    return (
      <FolderBrowser
        onSorterChange={changeSorting}
        onSearchChange={changeSearching}
        searchText={searchText}
        sorter={sorter}
        title='Import data'
        session={this.state.session}
        triggerUpdate={this.state.triggerUpdate}
        onTriggerUpdate={this.onTriggerUpdate}
        onObjectChosen={this.onObjectChosen}
        setDataSource={setDataSource}
        dataSource={dataSource}
        chosenItem={{
          objectId: chosenObjectId,
          projectId: chosenProjectId,
          subtype: chosenSubtype,
        }}
        scrollPosition={scrollPosition}
        pageSize={pageSize}
        chosenFolder={folder}
        onChoseFolder={selectFolder}
        handlePopupErrors={handlePopupErrors}
        onSizeUpdated={updateSize}
        onScrollUpdated={updateScroll}
      >
        {/* Temporary loading user action block */}
        <div id="action-block" style={{
          display: loading ? 'block' : 'none',
          position: 'fixed',
          top: '0',
          left: '0',
          height: '100vh',
          width: '100vw',
          zindex: '100',
          backgroundColor: '#fff',
          opacity: '0.5',
        }}>
        </div>
        <PopupButtons
          loading={loading}
          disableActiveActions={!chosenObjectId}
          handleOk={this.handleOk}
          handleSecondary={this.handleSecondary}
          handleCancel={this.handleCancel}
          previewDisplay={this.state.previewDisplay}
        />
      </FolderBrowser>
    );
  }
}

export const mapStateToProps = (state) => {
  return {...state.navigationTree};
};

export const NavigationTree = connect(mapStateToProps, actions)(_NavigationTree);
