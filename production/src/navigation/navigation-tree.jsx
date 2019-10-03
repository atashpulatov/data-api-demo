import React, { Component } from 'react';
import { FolderBrowser, objectTypes } from '@mstr/mstr-react-library';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupButtons } from '../popup/popup-buttons';
import { actions } from './navigation-tree-actions';
import { isPrompted as checkIfPrompted } from '../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { reduxStore } from '../store';
import { officeProperties } from '../office/office-properties';


export class _NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      triggerUpdate: false,
      previewDisplay: false,
    };
  }

  handleOk = () => {
    const { objectType, requestImport, requestDossierOpen } = this.props;
    if (objectType.name === mstrObjectEnum.mstrObjectType.dossier.name) {
      requestDossierOpen();
    } else {
      requestImport();
    }
  }

  onTriggerUpdate = (body) => {
    const updateObject = {
      command: selectorProperties.commandOnUpdate,
      body,
    };
    window.Office.context.ui.messageParent(JSON.stringify(updateObject));
  };

  handleSecondary = async () => {
    try {
      const { chosenProjectId, chosenObjectId, chosenProjectName, chosenType, chosenSubtype, handlePrepare } = this.props;
      handlePrepare(chosenProjectId, chosenObjectId, chosenSubtype, chosenProjectName, chosenType);
      this.setState({ previewDisplay: true });
    } catch (err) {
      const { handlePopupErrors } = this.props;
      handlePopupErrors(err);
    }
  };

  handleCancel = () => {
    const cancelObject = { command: selectorProperties.commandCancel, };
    window.Office.context.ui.messageParent(JSON.stringify(cancelObject));
    reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
  };

  // TODO: temporary solution
  onObjectChosen = async (objectId, projectId, subtype) => {
    try {
      const { selectObject } = this.props;
      selectObject({
        chosenObjectId: null,
        chosenProjectId: null,
        chosenSubtype: null,
        isPrompted: null,
        objectType: null,
      });

      // Only check for prompts when it's a report or dossier
      let isPrompted = false;
      const objectType = mstrObjectEnum.getMstrTypeBySubtype(subtype);
      if ((objectType === mstrObjectEnum.mstrObjectType.report) || (objectType === mstrObjectEnum.mstrObjectType.dossier)) {
        isPrompted = await checkIfPrompted(objectId, projectId, objectType.name);
      }

      selectObject({
        chosenObjectId: objectId,
        chosenProjectId: projectId,
        chosenSubtype: subtype,
        isPrompted,
        objectType,
      });
    } catch (err) {
      const { handlePopupErrors } = this.props;
      handlePopupErrors(err);
    }
  };

  render() {
    const {
      setDataSource, dataSource, chosenObjectId, chosenProjectId, pageSize, changeSearching, changeSorting,
      chosenSubtype, folder, selectFolder, loading, handlePopupErrors, scrollPosition, searchText, sorter,
      updateScroll, mstrData, updateSize, t, objectType,
    } = this.props;
    const { triggerUpdate, previewDisplay } = this.state;
    return (
      <FolderBrowser
        onSorterChange={changeSorting}
        onSearchChange={changeSearching}
        searchText={searchText}
        sorter={sorter}
        title="Import data"
        session={{ url: mstrData.envUrl, authToken: mstrData.token }}
        triggerUpdate={triggerUpdate}
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
        <div
          id="action-block"
          style={{
            display: loading ? 'block' : 'none',
            position: 'fixed',
            top: '0',
            left: '0',
            height: '100vh',
            width: '100vw',
            zindex: '100',
            backgroundColor: '#fff',
            opacity: '0.5',
          }}
        />
        <PopupButtons
          loading={loading}
          disableActiveActions={!chosenObjectId}
          handleOk={this.handleOk}
          handleSecondary={this.handleSecondary}
          handleCancel={this.handleCancel}
          previewDisplay={previewDisplay}
          disableSecondary={objectType && objectType.name === mstrObjectEnum.mstrObjectType.dossier.name}
        />
      </FolderBrowser>
    );
  }
}

_NavigationTree.defaultProps = { t: (text) => text, };

export const mapStateToProps = ({ officeReducer, navigationTree }) => {
  const object = officeReducer.preLoadReport;
  return {
    ...navigationTree,
    title: object ? object.name : undefined,
  };
};

export const NavigationTree = connect(mapStateToProps, actions)(withTranslation('common')(_NavigationTree));
