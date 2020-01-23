import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { ObjectTable, TopFilterPanel } from '@mstr/rc';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupButtons } from '../popup/popup-buttons/popup-buttons';
import { actions } from './navigation-tree-actions';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import './navigation-tree.css';
import {
  connectToCache,
  REFRESH_CACHE_COMMAND,
  refreshCacheState,
  fetchObjectsFallback
} from '../cache/cache-actions';
import DB from '../cache/cache-db';
import { authenticationHelper } from '../authentication/authentication-helper';
import { popupStateActions } from '../popup/popup-state-actions';
import { popupHelper } from '../popup/popup-helper';

const SAFETY_FALLBACK = 7000; // Interval for falling back to network

const { getCubeStatus, isPrompted } = mstrObjectRestService;
const checkIfPrompted = isPrompted;

export class _NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewDisplay: false,
      isPublished: true,
    };
    this.indexedDBSupport = DB.getIndexedDBSupport();
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

  connectToCache = (isRefresh) => {
    const { connectToDB } = this.props;
    this.startFallbackProtocol();
    connectToDB(isRefresh);
  };

  refresh = async () => {
    try {
      await authenticationHelper.validateAuthToken();
    } catch (error) {
      popupHelper.handlePopupErrors(error);
      return;
    }

    const { resetDBState, fetchObjectsFromNetwork } = this.props;
    resetDBState(true);
    if (this.indexedDBSupport) {
      window.Office.context.ui.messageParent(JSON.stringify({ command: REFRESH_CACHE_COMMAND }));
      this.connectToCache(true);
    } else {
      fetchObjectsFromNetwork();
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
    let isPromptedResponse = false;
    try {
      // If myLibrary is on, then selected object is a dossier.
      const objectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);
      if ((objectType === mstrObjectEnum.mstrObjectType.report) || (objectType === mstrObjectEnum.mstrObjectType.dossier)) {
        isPromptedResponse = await checkIfPrompted(chosenObjectId, chosenProjectId, objectType.name);
      }
      if (objectType.name === mstrObjectEnum.mstrObjectType.dossier.name) {
        requestDossierOpen();
      } else {
        requestImport(isPromptedResponse);
      }
    } catch (e) {
      popupHelper.handlePopupErrors(e);
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
    const { chosenProjectId, chosenObjectId, chosenSubtype, handlePrepare, setObjectData } = this.props;
    try {
      const objectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);
      if ((objectType === mstrObjectEnum.mstrObjectType.report) || (objectType === mstrObjectEnum.mstrObjectType.dossier)) {
        const isPromptedResponse = await checkIfPrompted(chosenObjectId, chosenProjectId, objectType.name);
        setObjectData({ isPrompted: isPromptedResponse });
      }
      handlePrepare();
      this.setState({ previewDisplay: true });
    } catch (err) {
      popupHelper.handlePopupErrors(err);
    }
  };

  handleCancel = () => {
    const { stopLoading } = this.props;
    stopLoading();
    const cancelObject = { command: selectorProperties.commandCancel };
    window.Office.context.ui.messageParent(JSON.stringify(cancelObject));
  };

  // TODO: temporary solution
  onObjectChosen = async (objectId, projectId, subtype, objectName, targetId, myLibrary) => {
    const { selectObject } = this.props;
    // If myLibrary is on, then selected object is a dossier.
    const objectType = myLibrary ? mstrObjectEnum.mstrObjectType.dossier : mstrObjectEnum.getMstrTypeBySubtype(subtype);
    let chosenLibraryDossier;
    if (myLibrary) {
      chosenLibraryDossier = objectId;
      objectId = targetId;
    }

    let cubeStatus = true;
    if (objectType === mstrObjectEnum.mstrObjectType.dataset) {
      try {
        cubeStatus = await getCubeStatus(objectId, projectId) !== '0';
      } catch (error) {
        popupHelper.handlePopupErrors(error);
      }
    }
    this.setState({ isPublished: cubeStatus });

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
          <span>{t('Import Data')}</span>
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
          onSelect={({ id, projectId, subtype, name, targetId }) => this.onObjectChosen(id, projectId, subtype, name, targetId, myLibrary)}
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
  resetDBState: refreshCacheState,
  fetchObjectsFromNetwork: fetchObjectsFallback,
  handlePrepare: popupStateActions.onPrepareData,
  setObjectData: popupStateActions.setObjectData,
};

export const NavigationTree = connect(mapStateToProps, mapActionsToProps)(withTranslation('common')(_NavigationTree));
