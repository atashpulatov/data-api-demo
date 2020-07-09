import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { ObjectTable, TopFilterPanel } from '@mstr/rc';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupButtons } from '../popup/popup-buttons/popup-buttons';
import { actions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import './navigation-tree.css';
import {
  connectToCache,
  REFRESH_CACHE_COMMAND,
  refreshCacheState,
  fetchObjectsFallback
} from '../redux-reducer/cache-reducer/cache-actions';
import DB from '../cache/cache-db';
import { authenticationHelper } from '../authentication/authentication-helper';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { popupHelper } from '../popup/popup-helper';

const SAFETY_FALLBACK = 7000; // Interval for falling back to network
const { getCubeStatus, isPrompted } = mstrObjectRestService;
const checkIfPrompted = isPrompted;
const isPublishedInMyLibrary = true;

export class NavigationTreeNotConnected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewDisplay: false,
      isPublishedInEnvironment: true,
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
      sorter, mstrObjectType, myLibrary, myLibraryFilter, envFilter
    } = this.props;
    const propsToSave = {
      sorter,
      mstrObjectType,
      myLibrary,
      envFilter,
      myLibraryFilter,
    };
    const { commandBrowseUpdate } = selectorProperties;
    const message = {
      command: commandBrowseUpdate,
      body: propsToSave,
    };
    popupHelper.officeMessageParent(message);
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
      const message = { command: REFRESH_CACHE_COMMAND, };
      popupHelper.officeMessageParent(message);
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
      const mstrObjectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);
      if ((mstrObjectType === mstrObjectEnum.mstrObjectType.report)
      || (mstrObjectType === mstrObjectEnum.mstrObjectType.dossier)) {
        isPromptedResponse = await checkIfPrompted(chosenObjectId, chosenProjectId, mstrObjectType.name);
      }
      if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.dossier.name) {
        requestDossierOpen();
      } else {
        requestImport(isPromptedResponse);
      }
    } catch (e) {
      popupHelper.handlePopupErrors(e);
    }
  };

  onTriggerUpdate = (body) => {
    const { commandOnUpdate } = selectorProperties;
    const message = {
      command: commandOnUpdate,
      body,
    };
    popupHelper.officeMessageParent(message);
  };

  handleSecondary = async () => {
    const {
      chosenProjectId, chosenObjectId, chosenSubtype, handlePrepare, setObjectData
    } = this.props;
    try {
      const mstrObjectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);

      if ((mstrObjectType === mstrObjectEnum.mstrObjectType.report)
      || (mstrObjectType === mstrObjectEnum.mstrObjectType.dossier)) {
        const isPromptedResponse = await checkIfPrompted(chosenObjectId, chosenProjectId, mstrObjectType.name);
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
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    popupHelper.officeMessageParent(message);
  };

  onObjectChosen = async ({
    id: objectId, projectId, subtype, name: objectName, targetId
  }) => {
    const { selectObject, myLibrary } = this.props;
    // If myLibrary is on, then selected object is a dossier.
    const mstrObjectType = myLibrary
      ? mstrObjectEnum.mstrObjectType.dossier : mstrObjectEnum.getMstrTypeBySubtype(subtype);

    let chosenLibraryDossier;
    if (myLibrary) {
      chosenLibraryDossier = objectId;
      objectId = targetId;
    }

    let cubeStatus = true;
    if (mstrObjectType === mstrObjectEnum.mstrObjectType.dataset) {
      try {
        cubeStatus = await getCubeStatus(objectId, projectId) !== '0';
      } catch (error) {
        popupHelper.handlePopupErrors(error);
      }
    }
      if (!myLibrary && objectId) {
        this.setState({ isPublishedInEnvironment: cubeStatus });
    }
    selectObject({
      chosenObjectId: objectId,
      chosenObjectName: objectName,
      chosenProjectId: projectId,
      chosenSubtype: subtype,
      mstrObjectType,
      chosenLibraryDossier,
    });
  };

  render() {
    const {
      chosenObjectId, chosenProjectId, changeSorting, loading, chosenLibraryDossier, searchText, sorter,
      changeSearching, mstrObjectType, cache, envFilter, myLibraryFilter, myLibrary, switchMyLibrary, changeFilter, t,
      i18n, numberOfFiltersActive,
    } = this.props;
    const { previewDisplay, isPublishedInMyLibrary, isPublishedInEnvironment } = this.state;
    const objects = myLibrary ? cache.myLibrary.objects : cache.environmentLibrary.objects;
    const cacheLoading = cache.myLibrary.isLoading || cache.environmentLibrary.isLoading;
    const disableActiveActions = myLibrary ? (!isPublishedInMyLibrary) : (!isPublishedInEnvironment);
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
            onSwitch={switchMyLibrary}
            numberOfFiltersActive={numberOfFiltersActive} />
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
          disableActiveActions={!chosenObjectId || disableActiveActions}
          handleOk={this.handleOk}
          handleSecondary={this.handleSecondary}
          handleCancel={this.handleCancel}
          previewDisplay={previewDisplay}
          disableSecondary={mstrObjectType && mstrObjectType.name === mstrObjectEnum.mstrObjectType.dossier.name}
          isPublished={myLibrary ? isPublishedInMyLibrary : isPublishedInEnvironment}
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
  mstrObjectType: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.shape({})]),
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
  numberOfFiltersActive: PropTypes.number,
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
