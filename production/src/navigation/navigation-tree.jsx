import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { ObjectTable, TopFilterPanel } from '@mstr/rc';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupButtons } from '../popup/popup-buttons';
import { actions } from './navigation-tree-actions';
import { isPrompted as checkIfPrompted } from '../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import './navigation-tree.css';
import { connectToCache, clearCache, createCache, listenToCache, REFRESH_CACHE_COMMAND, refreshCacheState } from '../cache/cache-actions';

const DB_TIMEOUT = 3000; // Interval for checking indexedDB changes on IE

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

  componentWillUnmount() {
    this.DBOnChange.cancel()
  }

  connectToCache = () => {
    const { connectToDB, listenToDB } = this.props;
    if (this.isMSIE) {
      [this.DB, this.DBOnChange] = listenToDB();
      this.DBOnChange.then(this.startDBListener)
    } else {
      [this.DB, this.DBOnChange] = connectToDB();
    }
  };

  startDBListener = () => {
    const { cache, listenToDB } = this.props;
    if (cache.projects.length < 1 || cache.myLibrary.isLoading || cache.environmentLibrary.isLoading) {
      setTimeout(() => {
        [this.DB, this.DBOnChange] = listenToDB(this.DB);
        this.DBOnChange.then(this.startDBListener());
      }, DB_TIMEOUT);
    }
  };

  refresh = () => {
    if (!this.isMSIE && this.DBOnChange) this.DBOnChange.cancel();
    this.props.resetDB();
    window.Office.context.ui.messageParent(JSON.stringify({ command: REFRESH_CACHE_COMMAND }));
    setTimeout(() => {
      this.connectToCache();
    }, 1000);
  };

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
      const { chosenProjectId, chosenObjectId, chosenObjectName, chosenType, chosenSubtype, handlePrepare } = this.props;
      handlePrepare(chosenProjectId, chosenObjectId, chosenSubtype, chosenObjectName, chosenType);
      this.setState({ previewDisplay: true });
    } catch (err) {
      const { handlePopupErrors } = this.props;
      handlePopupErrors(err);
    }
  };

  handleCancel = () => {
    const { stopLoading } = this.props;
    stopLoading();
    const cancelObject = { command: selectorProperties.commandCancel };
    window.Office.context.ui.messageParent(JSON.stringify(cancelObject));
  };

  // TODO: temporary solution
  onObjectChosen = async (objectId, projectId, subtype, objectName) => {
    try {
      const { selectObject } = this.props;
      selectObject({
        chosenObjectId: null,
        chosenObjectName: null,
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
        chosenObjectName: objectName,
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
      chosenObjectId, chosenProjectId, changeSorting, loading, handlePopupErrors, searchText, sorter,
      changeSearching, objectType, cache, filter, myLibrary, switchMyLibrary, changeFilter, t, i18n,
    } = this.props;
    const { triggerUpdate, previewDisplay } = this.state;
    const objects = myLibrary ? cache.myLibrary.objects : cache.environmentLibrary.objects;
    const cacheLoading = cache.myLibrary.isLoading || cache.environmentLibrary.isLoading;
    return (
      <div className="navigation_tree__main_wrapper">
        <div className="navigation_tree__title_bar">
          <span>{t('Import Data')}</span>
          <TopFilterPanel
            locale={i18n.language}
            objects={objects}
            applications={cache.projects}
            onFilterChange={changeFilter}
            onSearch={changeSearching}
            isLoading={cacheLoading}
            myLibrary={myLibrary}
            filter={filter}
            onRefresh={() => this.refresh()}
            onSwitch={switchMyLibrary} />
        </div>
        <ObjectTable
          objects={objects}
          projects={cache.projects}
          selected={{
            id: chosenObjectId,
            projectId: chosenProjectId,
          }}
          onSelect={({ id, projectId, subtype, name }) => this.onObjectChosen(id, projectId, subtype, name)}
          sort={sorter}
          onSortChange={changeSorting}
          locale={i18n.language}
          searchText={searchText}
          filter={filter}
          isLoading={cacheLoading} />
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

_NavigationTree.defaultProps = { t: (text) => text };

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
  listenToDB: listenToCache,
  clearDB: clearCache,
  resetDB: refreshCacheState,
};

export const NavigationTree = connect(mapStateToProps, mapActionsToProps)(withTranslation('common')(_NavigationTree));
