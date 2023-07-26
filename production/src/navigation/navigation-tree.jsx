import React, {
  useState, useMemo, useEffect, useCallback,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ObjectTable, TopFilterPanel } from '@mstr/connector-components';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupButtons } from '../popup/popup-buttons/popup-buttons';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { filterActions } from '../redux-reducer/filter-reducer/filter-actions';
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

const { isPrompted, getCubeInfo } = mstrObjectRestService;
const checkIfPrompted = isPrompted;
const isPublishedInMyLibrary = true;

export const NavigationTreeNotConnected = (props) => {
  const [previewDisplay, setPreviewDisplay] = useState(false);
  const [isPublishedInEnvironment, setIsPublishedInEnvironment] = useState(true);

  const indexedDBSupport = useMemo(() => DB.getIndexedDBSupport(), []);

  const [t, i18n] = useTranslation();

  const {
    chosenObjectId, chosenProjectId, changeSorting, chosenLibraryDossier, searchText, sorter,
    changeSearching, mstrObjectType, cache, envFilter, myLibraryFilter, myLibrary, changeFilter,
    numberOfFiltersActive, resetDBState, fetchObjectsFromNetwork, connectToDB, selectObject, chosenSubtype,
    requestImport, requestDossierOpen, handlePrepare, setObjectData, switchMyLibrary, restoreSelection, setPromptObjects
  } = props;
  const objects = myLibrary ? cache.myLibrary.objects : cache.environmentLibrary.objects;
  const cacheLoading = cache.myLibrary.isLoading || cache.environmentLibrary.isLoading;
  const disableActiveActions = myLibrary ? (!isPublishedInMyLibrary) : (!isPublishedInEnvironment);

  const projects = useRef(cache.projects);

  useEffect(() => {
    projects.current = cache.projects;
  }, [cache.projects]);

  const startFallbackProtocol = useCallback(() => {
    setTimeout(() => {
      if (projects.current.length === 0) {
        console.log('Cache failed, fetching from network');
        resetDBState(true);
        fetchObjectsFromNetwork();
      }
    }, SAFETY_FALLBACK);
  }, [fetchObjectsFromNetwork, resetDBState]);

  const connectToCacheSafely = useCallback((isRefresh) => {
    startFallbackProtocol();
    connectToDB(isRefresh).catch(() => {
      console.log('Cannot connect to cache, fetching from network');
      fetchObjectsFromNetwork();
    });
  }, [connectToDB, fetchObjectsFromNetwork, startFallbackProtocol]);

  useEffect(() => {
    resetDBState();
    if (indexedDBSupport) {
      connectToCacheSafely();
    } else {
      fetchObjectsFromNetwork();
    }
  }, [connectToCacheSafely, fetchObjectsFromNetwork, indexedDBSupport, resetDBState]);

  useEffect(() => {
    const propsToSave = {
      sorter,
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
  }, [envFilter, myLibrary, myLibraryFilter, sorter]);

  const refresh = async () => {
    try {
      await authenticationHelper.validateAuthToken();
    } catch (error) {
      popupHelper.handlePopupErrors(error);
      return;
    }

    resetDBState(true);
    if (indexedDBSupport) {
      const message = { command: REFRESH_CACHE_COMMAND, };
      popupHelper.officeMessageParent(message);
      connectToCacheSafely(true);
    } else {
      fetchObjectsFromNetwork();
    }
  };

  const handleOk = async () => {
    let isPromptedResponse = false;
    try {
      // If myLibrary is on, then selected object is a dossier.
      const chosenMstrObjectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);
      if ((chosenMstrObjectType === mstrObjectEnum.mstrObjectType.report)
        || (chosenMstrObjectType === mstrObjectEnum.mstrObjectType.dossier)) {
        isPromptedResponse = await checkIfPrompted(chosenObjectId, chosenProjectId, chosenMstrObjectType.name);
      }
      if (chosenMstrObjectType.name === mstrObjectEnum.mstrObjectType.dossier.name) {
        requestDossierOpen(isPromptedResponse);
      } else {
        requestImport(isPromptedResponse);
      }
    } catch (e) {
      popupHelper.handlePopupErrors(e);
    }
  };

  const handleSecondary = async () => {
    try {
      const chosenMstrObjectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);

      if ((chosenMstrObjectType === mstrObjectEnum.mstrObjectType.report)
        || (chosenMstrObjectType === mstrObjectEnum.mstrObjectType.dossier)) {
        const isPromptedResponse = await checkIfPrompted(chosenObjectId, chosenProjectId, chosenMstrObjectType.name);
        setObjectData({ isPrompted: isPromptedResponse.isPrompted });
        setPromptObjects({ promptObjects: isPromptedResponse.promptObjects });
      }
      handlePrepare();
      setPreviewDisplay(true);
    } catch (err) {
      popupHelper.handlePopupErrors(err);
    }
  };

  const handleCancel = () => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    popupHelper.officeMessageParent(message);
  };

  const onObjectChosen = async ({
    id: objectId, projectId, subtype, name: objectName, targetId
  }) => {
    // If myLibrary is on, then selected object is a dossier.
    const chosenMstrObjectType = myLibrary
      ? mstrObjectEnum.mstrObjectType.dossier : mstrObjectEnum.getMstrTypeBySubtype(subtype);

    let chosenDossierFromLibrary;
    if (myLibrary) {
      chosenDossierFromLibrary = objectId;
      objectId = targetId;
    }

    let isCubePublished = true;
    if (chosenMstrObjectType === mstrObjectEnum.mstrObjectType.dataset) {
      try {
        const cubeInfo = await getCubeInfo(objectId, projectId);
        isCubePublished = cubeInfo.status !== 0 || cubeInfo.serverMode === 2;
      } catch (error) {
        popupHelper.handlePopupErrors(error);
      }
    }
    if (!myLibrary && objectId) {
      setIsPublishedInEnvironment(isCubePublished);
    }
    selectObject({
      chosenObjectId: objectId,
      chosenObjectName: objectName,
      chosenProjectId: projectId,
      chosenSubtype: subtype,
      mstrObjectType: chosenMstrObjectType,
      chosenLibraryDossier: chosenDossierFromLibrary,
    });
  };

  const onSwitch = () => {
    restoreSelection({ nextMyLibraryState: !myLibrary });
    switchMyLibrary();
  };

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
          onRefresh={() => refresh()}
          onSwitch={onSwitch}
          numberOfFiltersActive={numberOfFiltersActive} />
      </div>
      <ObjectTable
        objects={objects}
        projects={cache.projects}
        selected={{
          id: myLibrary ? chosenLibraryDossier : chosenObjectId,
          projectId: chosenProjectId,
        }}
        onSelect={onObjectChosen}
        sort={sorter}
        onSortChange={changeSorting}
        locale={i18n.language}
        searchText={searchText}
        myLibrary={myLibrary}
        objectsPreFormatted
        filter={myLibrary ? myLibraryFilter : envFilter}
        isLoading={cacheLoading} />
      <PopupButtons
        disableActiveActions={!chosenObjectId || disableActiveActions}
        handleOk={handleOk}
        handleSecondary={handleSecondary}
        handleCancel={handleCancel}
        previewDisplay={previewDisplay}
        disableSecondary={mstrObjectType && mstrObjectType.name === mstrObjectEnum.mstrObjectType.dossier.name}
        isPublished={myLibrary ? isPublishedInMyLibrary : isPublishedInEnvironment}
      />
    </div>
  );
};

NavigationTreeNotConnected.propTypes = {
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
  switchMyLibrary: PropTypes.func,
  changeFilter: PropTypes.func,
  numberOfFiltersActive: PropTypes.number,
  restoreSelection: PropTypes.func,
  setPromptObjects: PropTypes.func,
};

export const mapStateToProps = ({ navigationTree, filterReducer, cacheReducer }) => ({
  ...navigationTree,
  ...filterReducer,
  cache: cacheReducer,
});

const mapActionsToProps = {
  ...navigationTreeActions,
  ...filterActions,
  connectToDB: connectToCache,
  resetDBState: refreshCacheState,
  fetchObjectsFromNetwork: fetchObjectsFallback,
  handlePrepare: popupStateActions.onPrepareData,
  setObjectData: popupStateActions.setObjectData,
};

export const NavigationTree = connect(mapStateToProps, mapActionsToProps)(NavigationTreeNotConnected);
