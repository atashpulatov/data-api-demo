import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

export class NavigationTreeNotConnected extends Component {
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
      this.connectToCacheSafely();
    } else {
      fetchObjectsFromNetwork();
    }
  }

  componentDidUpdate() {
    const {
      sorter, objectType, myLibrary, myLibraryFilter, envFilter
    } = this.props;
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

  connectToCacheSafely = (isRefresh) => {
    const { connectToDB, fetchObjectsFromNetwork } = this.props;
    this.startFallbackProtocol();
    connectToDB(isRefresh).catch(() => {
      console.log('Cannot connect to cache, fetching from network');
      fetchObjectsFromNetwork();
    });
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
      this.connectToCacheSafely(true);
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
    const {
      chosenSubtype, chosenObjectId, chosenProjectId, requestImport, requestDossierOpen
    } = this.props;
    let isPromptedResponse = false;
    try {
      // If myLibrary is on, then selected object is a dossier.
      const objectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);
      if ((objectType === mstrObjectEnum.mstrObjectType.report)
      || (objectType === mstrObjectEnum.mstrObjectType.dossier)) {
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
    const {
      chosenProjectId, chosenObjectId, chosenSubtype, handlePrepare, setObjectData
    } = this.props;
    try {
      const objectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);

      if ((objectType === mstrObjectEnum.mstrObjectType.report)
      || (objectType === mstrObjectEnum.mstrObjectType.dossier)) {
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

  onObjectChosen = async ({
    id:objectId, projectId, subtype, name:objectName, targetId, myLibrary
  }) => {
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
            searchText={searchText}
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
          onSelect={this.onObjectChosen}
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

NavigationTreeNotConnected.propTypes = {
  stopLoading: PropTypes.func,
  loading: PropTypes.bool,
  cache: PropTypes.shape({
    chosenObjectId: PropTypes.string,
    projects: PropTypes.arrayOf(PropTypes.shape({})),
    myLibrary: PropTypes.PropTypes.shape({
      objects: PropTypes.arrayOf(PropTypes.shape({})),
      isLoading: PropTypes.bool,
    }),
    environmentLibrary: PropTypes.PropTypes.shape({
      objects: PropTypes.arrayOf(PropTypes.shape({})),
      isLoading: PropTypes.bool,
    }),
  }),
  resetDBState: PropTypes.func,
  fetchObjectsFromNetwork: PropTypes.func,
  sorter: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.shape({})]),
  objectType: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.shape({})]),
  myLibrary: PropTypes.bool,
  myLibraryFilter: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.shape({})]),
  envFilter: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.shape({})]),
  connectToDB: PropTypes.func,
  chosenSubtype: PropTypes.number,
  chosenObjectId: PropTypes.string,
  chosenProjectId: PropTypes.string,
  requestImport: PropTypes.func,
  requestDossierOpen: PropTypes.func,
  handlePrepare: PropTypes.func,
  setObjectData: PropTypes.func,
  selectObject: PropTypes.func,
  changeSorting: PropTypes.func,
  chosenLibraryDossier: PropTypes.string,
  searchText: PropTypes.string,
  changeSearching: PropTypes.func,
  i18n: PropTypes.PropTypes.shape({ language: PropTypes.string }),
  switchMyLibrary: PropTypes.func,
  changeFilter: PropTypes.func,
  t: PropTypes.func,
};


NavigationTreeNotConnected.defaultProps = { t: (text) => text };

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

export const NavigationTree = connect(mapStateToProps, mapActionsToProps)(withTranslation('common')(NavigationTreeNotConnected));
