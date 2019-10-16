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

const DB_TIMEOUT = 5000; // Interval for checking indexedDB changes on IE

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
    const { resetDBState } = this.props
    resetDBState();
    this.connectToCache();
  }

  componentDidUpdate() {
    const { sorter, objectType, filter, myLibrary } = this.props;
    const propsToSave = { sorter, objectType, filter, myLibrary };
    window.Office.context.ui.messageParent(JSON.stringify({
      command: selectorProperties.commandBrowseUpdate,
      body: propsToSave,
    }));
  }

  componentWillUnmount() {
    try {
      this.DB.close();
    } catch (error) {
      // Ignoring error
    }
  }

  connectToCache = () => {
    const { connectToDB, listenToDB } = this.props;
    if (this.isMSIE) {
      setTimeout(() => {
        [this.DB, this.DBOnChange] = listenToDB();
        this.DBOnChange.then(this.startDBListener)
      }, 500);
    } else {
      [this.DB, this.DBOnChange] = connectToDB();
    }
  };

  startDBListener = () => {
    const { cache, listenToDB } = this.props;
    console.log(cache.projects.length, cache.myLibrary.objects.length, cache.myLibrary.isLoading, cache.environmentLibrary.objects.length, cache.environmentLibrary.isLoading)
    if (cache.projects.length < 1 || cache.myLibrary.isLoading || cache.environmentLibrary.isLoading) {
      setTimeout(() => {
        [this.DB, this.DBOnChange] = listenToDB(this.DB);
        this.DBOnChange.then(this.startDBListener);
      }, DB_TIMEOUT);
    }
  };

  refresh = () => {
    const { resetDBState } = this.props
    if (!this.isMSIE && this.DBOnChange) this.DBOnChange.cancel();
    resetDBState();
    window.Office.context.ui.messageParent(JSON.stringify({ command: REFRESH_CACHE_COMMAND }));
    this.connectToCache(this.DB);
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
  onObjectChosen = async (objectId, projectId, subtype, objectName, target, myLibrary) => {
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

      // If myLibrary is on, then selected object is a dossier.
      const objectType = myLibrary ? mstrObjectEnum.mstrObjectType.dossier : mstrObjectEnum.getMstrTypeBySubtype(subtype);

      /* If selected object is a dossier from myLibrary then the data of proper item is passed in target object.
      We need to store selected item id (library dossier id) to be able to select that on list */
      let chosenLibraryDossier;
      if (myLibrary) {
        chosenLibraryDossier = objectId;
        objectId = target.id;
      }

      // Only check for prompts when it's a report or dossier
      let isPrompted = false;
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
        chosenLibraryDossier,
      });
    } catch (err) {
      const { handlePopupErrors } = this.props;
      handlePopupErrors(err);
    }
  };

  render() {
    const {
      chosenObjectId, chosenProjectId, changeSorting, loading, chosenLibraryDossier, searchText, sorter,
      changeSearching, objectType, cache, envFilter, myLibraryFilter, myLibrary, switchMyLibrary, changeFilter, t, i18n,
    } = this.props;
    const { previewDisplay } = this.state;
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
            filter={myLibrary ? myLibraryFilter : envFilter}
            onRefresh={() => this.refresh()}
            onSwitch={switchMyLibrary} />
        </div>
        <ObjectTable
          objects={objects}
          projects={cache.projects}
          selected={{
            id: myLibrary ? chosenLibraryDossier : chosenObjectId,
            projectId: chosenProjectId,
          }}
          onSelect={({ id, projectId, subtype, name, target }) => this.onObjectChosen(id, projectId, subtype, name, target, myLibrary)}
          sort={sorter}
          onSortChange={changeSorting}
          locale={i18n.language}
          searchText={searchText}
          myLibrary={myLibrary}
          filter={myLibrary ? myLibraryFilter : envFilter}
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
  resetDBState: refreshCacheState,
};

export const NavigationTree = connect(mapStateToProps, mapActionsToProps)(withTranslation('common')(_NavigationTree));
