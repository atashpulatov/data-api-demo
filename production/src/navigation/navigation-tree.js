import React, {Component} from 'react';
import '../index.css';
import '../home/home.css';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {PopupButtons} from '../popup/popup-buttons.jsx';
import {FolderBrowser} from 'mstr-react-library';
import {connect} from 'react-redux';
import {selectFolder, selectObject, setDataSource, startImport} from './navigation-tree-actions';

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
    const okObject = {
      command: selectorProperties.commandOk,
      chosenObject: this.props.chosenObjectId,
      chosenProject: this.props.chosenProjectId,
      chosenSubtype: this.props.chosenSubtype,
    };
    this.props.startImport();
    Office.context.ui.messageParent(JSON.stringify(okObject));
  };

  handleSecondary = () => {
    this.props.handlePrepare(this.props.chosenProjectId, this.props.chosenObjectId,
        this.props.chosenSubtype, this.props.chosenProjectName);
  };

  handleCancel = () => {
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  };

  // TODO: temporary solution
  onObjectChosen = (objectId, projectId, subtype) => {
    this.props.selectObject({
      chosenObjectId: objectId,
      chosenProjectId: projectId,
      chosenSubtype: subtype,
    });
  };

  render() {
    const {setDataSource, dataSource, chosenObjectId, chosenProjectId,
      chosenSubtype, folder, selectFolder, loading} = this.props;
    return (
      <FolderBrowser
        title='Import a file'
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
        chosenFolder={folder}
        onChoseFolder={selectFolder}
      >
        {/* Temporary loading user action block */}
        <div style={{
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
        />
      </FolderBrowser>
    );
  }
}

const mapStateToProps = (state) => {
  return {...state.navigationTree};
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectObject: (data) => selectObject(dispatch)(data),
    setDataSource: (data) => setDataSource(dispatch)(data),
    selectFolder: (data) => selectFolder(dispatch)(data),
    startImport: () => startImport(dispatch)(),
  };
};

export const NavigationTree = connect(mapStateToProps, mapDispatchToProps)(_NavigationTree);
