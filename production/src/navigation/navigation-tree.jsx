import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { ObjectTable } from '@mstr/rc';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupButtons } from '../popup/popup-buttons';
import { actions } from './navigation-tree-actions';
import { isPrompted as checkIfPrompted } from '../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import './navigation-tree.css';
import { connectToCache, refreshCache, createCache } from '../cache/cache-actions';


export class _NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      triggerUpdate: false,
      previewDisplay: false,
    };
    const ua = window.navigator.userAgent;
    this.isMSIE = ua.indexOf('MSIE ') > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./);
  }

  componentDidMount() {
    this.connectToCache();
  }

  connectToCache = () => {
    const { connectToDB } = this.props;
    this.DBConnection = connectToDB();
    if (this.isMSIE) this.startDBListener();
  }

  startDBListener = () => {
    const { cache, connectToDB } = this.props;
    if (cache.projects.length < 1 || cache.myLibrary.isLoading || cache.environmentLibrary.isLoading) {
      setTimeout(() => {
        connectToDB(true);
        this.startDBListener();
      }, 1000);
    } else {
      this.DBConnection.cancel();
    }
  }

  refresh = () => {
    this.DBConnection.cancel();
    const { refreshDB, initDB } = this.props;
    refreshDB(initDB).then(() => {
      this.connectToCache();
    });
  }

  handleOk = () => {
    const { objectType, requestImport, requestDossierOpen } = this.props;
    if (objectType.name === mstrObjectEnum.mstrObjectType.dossier.name) {
      requestDossierOpen();
    } else {
      requestImport();
    }
  };

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
    const { stopLoading } = this.props;
    stopLoading();
    const cancelObject = { command: selectorProperties.commandCancel, };
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
      updateScroll, mstrData, updateSize, t, objectType, cache, refreshDB, i18n
    } = this.props;
    const { triggerUpdate, previewDisplay } = this.state;

    return (
      <div className="navigation_tree__main_wrapper">
        <div className="navigation_tree__title_bar">{t('Import Data')}</div>
        <ObjectTable
          objects={cache.environmentLibrary.objects}
          projects={cache.projects}
          selected={{
            id: chosenObjectId,
            projectId: chosenProjectId
          }}
          onSelect={({ id, projectId, subtype }) => this.onObjectChosen(id, projectId, subtype)}
          sort={sorter}
          onSortChange={changeSorting}
          locale={i18n.language}
          isLoading={loading} />
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

_NavigationTree.defaultProps = { t: (text) => text, };


export const mapStateToProps = ({ officeReducer, navigationTree, cacheReducer }) => {
  const object = officeReducer.preLoadReport;
  return {
    ...navigationTree,
    title: object ? object.name : undefined,
    cache: cacheReducer,
  };
};

const mapActionsToProps = {
  ...actions,
  initDB: createCache,
  connectToDB: connectToCache,
  refreshDB: refreshCache,
};

export const NavigationTree = connect(mapStateToProps, mapActionsToProps)(withTranslation('common')(_NavigationTree));
