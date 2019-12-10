import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { ObjectTable, TopFilterPanel } from '@mstr/rc';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupButtons } from '../popup/popup-buttons';
import { actions } from './navigation-tree-actions';
import { getCubeStatus, isPrompted as checkIfPrompted } from '../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import './navigation-tree.css';
import {
  connectToCache,
  listenToCache,
  REFRESH_CACHE_COMMAND,
  refreshCacheState,
  fetchObjectsFallback
} from '../cache/cache-actions';
import DB from '../cache/cache-db';
import { authenticationHelper } from '../authentication/authentication-helper';

const DB_TIMEOUT = 5000; // Interval for checking indexedDB changes on IE
const SAFETY_FALLBACK = 7000; // Interval for falling back to network

export class _NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewDisplay: false,
      isPublished: true,
    };
    this.indexedDBSupport = DB.getIndexedDBSupport();
    const ua = window.navigator.userAgent;
    this.isMSIE = ua.indexOf('MSIE ') > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./);
  }

  componentDidMount() {
    const { resetDBState, fetchObjectsFromNetwork } = this.props;
    resetDBState();
    if (this.indexedDBSupport) {
      this.connectToCache();
    } else {
      fetchObjectsFromNetwork();
    }
  }


  componentDidUpdate() {
    const { sorter, objectType, myLibrary, myLibraryFilter, envFilter } = this.props;
    const propsToSave = {
      sorter,
      objectType,
      myLibrary,
      envFilter,
      myLibraryFilter,
    };
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

  connectToCache = (isRefresh) => {
    const { connectToDB, listenToDB } = this.props;
    this.startFallbackProtocol();
    setTimeout(() => {
      if (this.isMSIE) {
        [this.DB, this.DBOnChange] = listenToDB();
        this.DBOnChange.then(this.startDBListener);
      } else {
        [this.DB, this.DBOnChange] = connectToDB();
      }
    }, isRefresh ? 900 : 0);
    // Timeout to avoid reading old cache while it's cleared in the sidebar (IE)
  };

  refresh = async () => {
    try {
      await authenticationHelper.validateAuthToken();
    } catch (error) {
      const { handlePopupErrors } = this.props;
      handlePopupErrors(error);
      return;
    }

    const { resetDBState, fetchObjectsFromNetwork } = this.props;
    resetDBState(true);
    if (this.indexedDBSupport) {
      if (!this.isMSIE && this.DBOnChange) this.DBOnChange.cancel();
      window.Office.context.ui.messageParent(JSON.stringify({ command: REFRESH_CACHE_COMMAND }));
      this.connectToCache(true);
    } else {
      fetchObjectsFromNetwork();
    }
  };

  startDBListener = () => {
    const { cache, listenToDB } = this.props;
    const { projects, myLibrary, environmentLibrary } = cache;
    console.log(projects.length, myLibrary.objects.length, myLibrary.isLoading, environmentLibrary.objects.length, environmentLibrary.isLoading);
    if (projects.length < 1 || myLibrary.isLoading || environmentLibrary.isLoading) {
      setTimeout(() => {
        [this.DB, this.DBOnChange] = listenToDB(this.DB);
        this.DBOnChange.then(this.startDBListener);
      }, DB_TIMEOUT);
    }
  };

  startFallbackProtocol = () => {
    setTimeout(() => {
      const { cache, fetchObjectsFromNetwork, resetDBState } = this.props;
      const { projects } = cache;
      if (projects.length === 0) {
        console.log('Cache failed, fetching from network');
        resetDBState(true);
        fetchObjectsFromNetwork();
      }
    }, SAFETY_FALLBACK);
  }

  handleOk = async () => {
    const { chosenSubtype, chosenObjectId, chosenProjectId, requestImport, requestDossierOpen } = this.props;
    let isPrompted = false;
    try {
      // If myLibrary is on, then selected object is a dossier.
      const objectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);
      if ((objectType === mstrObjectEnum.mstrObjectType.report) || (objectType === mstrObjectEnum.mstrObjectType.dossier)) {
        isPrompted = await checkIfPrompted(chosenObjectId, chosenProjectId, objectType.name);
      }
      if (objectType.name === mstrObjectEnum.mstrObjectType.dossier.name) {
        requestDossierOpen();
      } else {
        requestImport(isPrompted);
      }
    } catch (e) {
      const { handlePopupErrors } = this.props;
      handlePopupErrors(e);
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
    const { chosenProjectId, chosenObjectId, chosenObjectName, chosenType, chosenSubtype, handlePrepare } = this.props;
    let isPrompted = false;
    try {
      const objectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);
      if ((objectType === mstrObjectEnum.mstrObjectType.report) || (objectType === mstrObjectEnum.mstrObjectType.dossier)) {
        isPrompted = await checkIfPrompted(chosenObjectId, chosenProjectId, objectType.name);
      }
      handlePrepare(chosenProjectId, chosenObjectId, chosenSubtype, chosenObjectName, chosenType, isPrompted);
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
    const { selectObject, handlePopupErrors } = this.props;
    // If myLibrary is on, then selected object is a dossier.
    const objectType = myLibrary ? mstrObjectEnum.mstrObjectType.dossier : mstrObjectEnum.getMstrTypeBySubtype(subtype);
    let chosenLibraryDossier;
    if (myLibrary) {
      chosenLibraryDossier = objectId;
      objectId = target.id;
    }

    let cubeStatus = true;
    if (objectType === mstrObjectEnum.mstrObjectType.dataset) {
      try {
        cubeStatus = await getCubeStatus(objectId, projectId) !== '0';
      } catch (error) {
        handlePopupErrors(error);
      }
    }
    this.setState({ isPublished:cubeStatus });

    selectObject({
      chosenObjectId: objectId,
      chosenObjectName: objectName,
      chosenProjectId: projectId,
      chosenSubtype: subtype,
      objectType,
      chosenLibraryDossier,
    });
  };

  render() {
    const {
      chosenObjectId, chosenProjectId, changeSorting, loading, chosenLibraryDossier, searchText, sorter,
      changeSearching, objectType, cache, envFilter, myLibraryFilter, myLibrary, switchMyLibrary, changeFilter, t, i18n,
    } = this.props;
    const { previewDisplay, isPublished } = this.state;
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
          objectsPreFormatted
          filter={myLibrary ? myLibraryFilter : envFilter}
          isLoading={cacheLoading} />
        <PopupButtons
          loading={loading}
          disableActiveActions={!chosenObjectId || !isPublished}
          handleOk={this.handleOk}
          handleSecondary={this.handleSecondary}
          handleCancel={this.handleCancel}
          previewDisplay={previewDisplay}
          disableSecondary={objectType && objectType.name === mstrObjectEnum.mstrObjectType.dossier.name}
          isPublished={isPublished}
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
  connectToDB: connectToCache,
  listenToDB: listenToCache,
  resetDBState: refreshCacheState,
  fetchObjectsFromNetwork: fetchObjectsFallback
};

export const NavigationTree = connect(mapStateToProps, mapActionsToProps)(withTranslation('common')(_NavigationTree));
