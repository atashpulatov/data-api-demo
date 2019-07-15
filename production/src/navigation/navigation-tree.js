import React, {Component} from 'react';
import '../index.css';
import '../home/home.css';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {PopupButtons} from '../popup/popup-buttons.jsx';
import {FolderBrowser, objectTypes} from 'mstr-react-library';
import {connect} from 'react-redux';
import {actions} from './navigation-tree-actions';
import {mstrObjectRestService} from '../mstr-object/mstr-object-rest-service';
import {withTranslation} from 'react-i18next';
import {message} from 'antd';
import {EMPTY_REPORT} from '../error/constants';

export class _NavigationTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: {
        USE_PROXY: false,
        url: this.props.mstrData.envUrl,
        authToken: this.props.mstrData.token,
      },
      reportId: this.props.mstrData.reportId,
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

  handleSecondary = async () => {
    try {
      const response = await mstrObjectRestService.createInstance(this.props.chosenObjectId, this.props.chosenProjectId, this.props.chosenSubtype);
      if (response && response.rows === 0) {
        return message.warning(EMPTY_REPORT);
      }
      this.props.handlePrepare(this.props.chosenProjectId, this.props.chosenObjectId,
          this.props.chosenSubtype, this.props.chosenProjectName, this.props.chosenType);
      this.setState({previewDisplay: true});
    } catch (err) {
      this.props.handlePopupErrors(err);
    }
  };

  handleCancel = () => {
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  };

  // TODO: temporary solution
  onObjectChosen = async (objectId, projectId, subtype) => {
    try {
      this.props.selectObject({
        chosenObjectId: null,
        chosenProjectId: null,
        chosenSubtype: null,
        isPrompted: null,
      });

      // Only check for prompts when it's a report
      let isPrompted = false;
      if (objectTypes.getTypeDescription(3, subtype) === 'Report') {
        isPrompted = await mstrObjectRestService.isPrompted(objectId, projectId);
      }

      this.props.selectObject({
        chosenObjectId: objectId,
        chosenProjectId: projectId,
        chosenSubtype: subtype,
        isPrompted,
      });
    } catch (err) {
      this.props.handlePopupErrors(err);
    }
  };

  render() {
    const {setDataSource, dataSource, chosenObjectId, chosenProjectId, pageSize, changeSearching, changeSorting,
      chosenSubtype, folder, selectFolder, loading, handlePopupErrors, scrollPosition, searchText, sorter,
      updateScroll, updateSize, requestImport, t} = this.props;
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
        t={t}
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
          handleOk={requestImport}
          handleSecondary={this.handleSecondary}
          handleCancel={this.handleCancel}
          previewDisplay={this.state.previewDisplay}
        />
      </FolderBrowser>
    );
  }
}

_NavigationTree.defaultProps = {
  t: (text) => text,
};

export const mapStateToProps = ({officeReducer, navigationTree}) => {
  const object = officeReducer.preLoadReport;
  return {
    ...navigationTree,
    title: !!object ? object.name : undefined,
  };
};

export const NavigationTree = connect(mapStateToProps, actions)(withTranslation('common')(_NavigationTree));
