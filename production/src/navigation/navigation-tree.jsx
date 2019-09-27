import React, { Component } from 'react';
import { objectTypes } from '@mstr/mstr-react-library';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { ObjectTable } from '@mstr/rc/dist';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupButtons } from '../popup/popup-buttons';
import { actions } from './navigation-tree-actions';
import { isPrompted as checkIfPrompted } from '../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import './navigation-tree.css';

export class _NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      triggerUpdate: false,
      previewDisplay: false,
    };
  }

  handleOk = () => {
    const { objectType, requestImport, handleDossierOpen } = this.props;
    if (objectType.name === mstrObjectEnum.mstrObjectType.dossier.name) {
      handleDossierOpen();
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
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    window.Office.context.ui.messageParent(JSON.stringify(cancelObject));
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

      // Only check for prompts when it's a report
      let isPrompted = false;
      if (objectTypes.getTypeDescription(3, subtype) === 'Report') {
        isPrompted = await checkIfPrompted(objectId, projectId);
      }

      selectObject({
        chosenObjectId: objectId,
        chosenProjectId: projectId,
        chosenSubtype: subtype,
        isPrompted,
        objectType: mstrObjectEnum.getMstrTypeBySubtype(subtype),
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
      updateScroll, mstrData, updateSize, t, objectType, cache,
    } = this.props;
    const { triggerUpdate, previewDisplay } = this.state;

    return (
      <div className="navigation_tree__main_wrapper">
        <div className="navigation_tree__title_bar">{t('Import Data')}</div>
        {/* <div className="navigation_tree__table_wrapper" style={{ fontSize: 12 }}> */}
        <div style={{ padding: 64, fontSize: 20 }}>
          <p>
            Projects:
            {' '}
            {cache.projects.length}
          </p>
          <br />
          <p>
            My Library
            {' '}
            {cache.myLibrary.isLoading ? '(loading):' : ':'}
            {' '}
            {cache.myLibrary.objects.length}
          </p>
          <br />
          <p>
            Environment Library
            {' '}
            {cache.environmentLibrary.isLoading ? '(loading):' : ':'}
            {' '}
            {cache.environmentLibrary.objects.length}
          </p>

        </div>
        <PopupButtons
          loading={loading}
          disableActiveActions={!chosenObjectId}
          handleOk={this.handleOk}
          handleSecondary={this.handleSecondary}
          handleCancel={this.handleCancel}
          previewDisplay={previewDisplay}
          disableSecondary={objectType && objectType.name === mstrObjectEnum.mstrObjectType.dossier.name}
        />
      </div>
    );
  }
}

_NavigationTree.defaultProps = {
  t: (text) => text,
};

export const mapStateToProps = ({ officeReducer, navigationTree, cacheReducer }) => {
  const object = officeReducer.preLoadReport;
  return {
    ...navigationTree,
    title: object ? object.name : undefined,
    cache: cacheReducer,
  };
};

export const NavigationTree = connect(mapStateToProps, actions)(withTranslation('common')(_NavigationTree));
