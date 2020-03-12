import { addNestedPropertiesToObjects } from '@mstr/rc';
import DB from './cache-db';
import i18next from '../i18n';
import { mstrListRestService } from '../mstr-object/mstr-list-rest-service';

export const CREATE_CACHE = 'CREATE_CACHE';
export const CLEAR_CACHE = 'CLEAR_CACHE';
export const REFRESH_CACHE = 'REFRESH_CACHE';
export const SET_OBJECT_LIST_LOADING = 'SET_OBJECT_LIST_LOADING';
export const SET_MY_LIBRARY_LOADING = 'SET_MY_LIBRARY_LOADING';
export const SET_PROJECTS_LOADING = 'SET_PROJECTS_LOADING';
export const ADD_MY_LIBRARY_OBJECTS = 'ADD_MY_LIBRARY_OBJECTS';
export const ADD_PROJECTS = 'ADD_PROJECTS';
export const ADD_ENV_OBJECTS = 'ADD_ENV_OBJECTS';
export const REFRESH_CACHE_COMMAND = 'REFRESH_COMMAND';
export const SAVE_MY_LIBRARY_OWNERS = 'SAVE_MY_LIBRARY_OWNERS';

export const PROJECTS_DB_ID = 'projects';
export const MY_LIBRARY_DB_ID = 'my-library';
export const ENV_LIBRARY_DB_ID = 'env-library';
export const LOADING_DB = 'loading-';
export const CURRENT_USER = 'user';

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

export const refreshCacheAction = (shouldCleanSelection) => ({ type: REFRESH_CACHE, data: shouldCleanSelection });

export const refreshCacheState = (shouldCleanSelection) => (dispatch) => {
  dispatch(refreshCacheAction(shouldCleanSelection));
};

export const saveMyLibraryOwners = (objects) => ({
  type: SAVE_MY_LIBRARY_OWNERS,
  data: objects.map(item => item.ownerId),
});

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
      dispatch(saveMyLibraryOwners(objects));
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
        dispatch(saveMyLibraryOwners(objects));
        objects = { data: addNestedPropertiesToObjects(objects, projects, i18next.language) };
        dispatch(addMyLibraryObjects(objects, true));
      })
        .catch(console.error)
        .finally(() => dispatch(myLibraryLoading(false)));

      // Environment library
      dispatch(objectListLoading(true));
      getObjectList((objects) => {
        objects = { data: addNestedPropertiesToObjects(objects, projects, i18next.language) };
        dispatch(addEnvObjects(objects, true));
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
      dispatch(saveMyLibraryOwners(data));
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
    console.log('Clearing cache');
    return cache.clearTable().catch(console.error);
  };
}
