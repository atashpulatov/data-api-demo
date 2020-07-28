import { addNestedPropertiesToObjects } from '@mstr/connector-components';
import DB from '../../cache/cache-db';
import i18next from '../../i18n';
import { mstrListRestService } from '../../mstr-object/mstr-list-rest-service';
import { navigationTreeActions } from '../navigation-tree-reducer/navigation-tree-actions';
import { filterActions } from '../filter-reducer/filter-actions';

export const CLEAR_CACHE = 'CLEAR_CACHE';
export const REFRESH_CACHE = 'REFRESH_CACHE';
export const SET_OBJECT_LIST_LOADING = 'CACHE_SET_OBJECT_LIST_LOADING';
export const SET_MY_LIBRARY_LOADING = 'CACHE_SET_MY_LIBRARY_LOADING';
export const ADD_MY_LIBRARY_OBJECTS = 'CACHE_ADD_MY_LIBRARY_OBJECTS';
export const ADD_PROJECTS = 'CACHE_ADD_PROJECTS';
export const ADD_ENV_OBJECTS = 'CACHE_ADD_ENV_OBJECTS';
export const REFRESH_CACHE_COMMAND = 'REFRESH_CACHE_COMMAND';

export const PROJECTS_DB_ID = 'projects';
export const MY_LIBRARY_DB_ID = 'my-library';
export const ENV_LIBRARY_DB_ID = 'env-library';
export const LOADING_DB = 'loading-';

const { getObjectList, fetchProjects, getMyLibraryObjectList } = mstrListRestService;

export const objectListLoading = (isLoading) => ({
  type: SET_OBJECT_LIST_LOADING,
  data: isLoading,
});

export const myLibraryLoading = (isLoading) => ({
  type: SET_MY_LIBRARY_LOADING,
  data: isLoading,
});

export const addMyLibraryObjects = (objects) => ({
  type: ADD_MY_LIBRARY_OBJECTS,
  data: objects,
});

export const addEnvObjects = (objects) => ({
  type: ADD_ENV_OBJECTS,
  data: objects,
});

export const addProjects = (objects) => ({
  type: ADD_PROJECTS,
  data: objects,
});

export const clearStateCache = () => ({ type: CLEAR_CACHE, });

export const refreshCacheAction = () => ({ type: REFRESH_CACHE });

export const refreshCacheState = (shouldCleanSelection) => (dispatch) => {
  dispatch(refreshCacheAction());
  if (shouldCleanSelection) { dispatch(navigationTreeActions.clearSelection()); }
};

export function fetchObjects(dispatch, cache) {
  // Projects
  fetchProjects((projects) => {
    cache.putData(PROJECTS_DB_ID, projects);

    // My library
    console.time('Creating my library cache');
    dispatch(myLibraryLoading(true));
    cache.updateData(LOADING_DB + MY_LIBRARY_DB_ID, true);
    getMyLibraryObjectList((objects) => {
      objects = addNestedPropertiesToObjects(objects, projects, i18next.language);
      dispatch(filterActions.saveMyLibraryOwners(objects));
      cache.putData(MY_LIBRARY_DB_ID, objects);
    })
      .catch(console.error)
      .finally(() => {
        console.timeEnd('Creating my library cache');
        cache.updateData(LOADING_DB + MY_LIBRARY_DB_ID, false).then(() => {
          dispatch(myLibraryLoading(false));
        });
      });

    // Environment library
    console.time('Creating environment cache');
    dispatch(objectListLoading(true));
    cache.updateData(LOADING_DB + ENV_LIBRARY_DB_ID, true);
    getObjectList((objects) => {
      objects = addNestedPropertiesToObjects(objects, projects, i18next.language);
      cache.putData(ENV_LIBRARY_DB_ID, objects);
    })
      .catch(console.error)
      .finally(() => {
        console.timeEnd('Creating environment cache');
        cache.updateData(LOADING_DB + ENV_LIBRARY_DB_ID, false).then(() => {
          dispatch(objectListLoading(false));
        });
      });
  }).catch(console.error);
}

export function fetchObjectsFallback() {
  return (dispatch) => {
    // Projects
    fetchProjects((projects) => {
      dispatch(addProjects(projects));

      // My Library
      dispatch(myLibraryLoading(true));
      getMyLibraryObjectList((objects) => {
        dispatch(filterActions.saveMyLibraryOwners(objects));
        objects = { data: addNestedPropertiesToObjects(objects, projects, i18next.language) };
        dispatch(addMyLibraryObjects(objects));
      })
        .catch(console.error)
        .finally(() => dispatch(myLibraryLoading(false)));

      // Environment library
      dispatch(objectListLoading(true));
      getObjectList((objects) => {
        objects = { data: addNestedPropertiesToObjects(objects, projects, i18next.language) };
        dispatch(addEnvObjects(objects));
      })
        .catch(console.error)
        .finally(() => dispatch(objectListLoading(false)));
    })
      .catch(console.error);
  };
}

export function resetLoading(cache) {
  return Promise.all([
    cache.updateData(LOADING_DB + MY_LIBRARY_DB_ID, false),
    cache.updateData(LOADING_DB + ENV_LIBRARY_DB_ID, false),
  ]);
}

export function createCache(initUsername) {
  return (dispatch, getState) => {
    // Create or get DB for current user
    const { sessionReducer } = getState();
    const { userID } = sessionReducer;
    const user = initUsername || userID;
    const cache = new DB(user);
    resetLoading(cache).catch(console.error);
    // We try to purge dbs not of the user and finally
    // start fetching for the current user even if it fails.
    DB.purge(user)
      .catch(console.error)
      .finally(() => {
        cache.callIfTableEmpty(() => {
          fetchObjects(dispatch, cache);
        }).catch(console.error);
      });
  };
}

export function refreshCache() {
  return (dispatch, getState) => {
    // Create or get DB for current user
    const { sessionReducer } = getState();
    const { userID } = sessionReducer;
    const cache = new DB(userID);
    // Overwrite cache
    cache.clearTable().then(() => {
      fetchObjects(dispatch, cache);
    }).catch(console.error);
  };
}

export function dispatchCacheResults({ type, data, uuid }, dispatch) {
  switch (type) {
    case PROJECTS_DB_ID:
      dispatch(addProjects(data));
      break;
    case MY_LIBRARY_DB_ID:
      dispatch(filterActions.saveMyLibraryOwners(data));
      dispatch(addMyLibraryObjects({ data, uuid }));
      break;
    case ENV_LIBRARY_DB_ID:
      dispatch(addEnvObjects({ data, uuid }));
      break;
    case LOADING_DB + MY_LIBRARY_DB_ID:
      dispatch(myLibraryLoading(data));
      break;
    case LOADING_DB + ENV_LIBRARY_DB_ID:
      dispatch(objectListLoading(data));
      break;
    default:
      break;
  }
}

export function connectToCache(isRefresh) {
  return (dispatch, getState) => {
    console.log('cache connected');
    // Create or get DB for current user
    const { sessionReducer } = getState();
    const { userID } = sessionReducer;
    const cache = new DB(userID);
    dispatch(myLibraryLoading(true));
    dispatch(objectListLoading(true));

    return cache.onChange((results) => {
      dispatchCacheResults(results, dispatch);
    }, isRefresh);
  };
}

export function clearCache(userID) {
  return (dispatch) => {
    const cache = new DB(userID);
    dispatch(clearStateCache());
    dispatch(navigationTreeActions.clearSelection());
    console.log('Clearing cache');
    return cache.clearTable().catch(console.error);
  };
}
