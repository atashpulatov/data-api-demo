import DB from './pouch-db';
import getObjectList, { getMyLibraryObjectList, fetchProjects } from '../mstr-object/mstr-list-rest-service';


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

export const PROJECTS_DB_ID = 'projects';
export const MY_LIBRARY_DB_ID = 'my-library';
export const ENV_LIBRARY_DB_ID = 'env-library';
export const LOADING_DB = 'loading-';

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

export const refreshCacheAction = () => ({ type: REFRESH_CACHE, });

export const refreshCacheState = () => (dispatch) => {
  dispatch(refreshCacheAction());
}

export function fetchObjects(dispatch, cache) {
  // Projects
  fetchProjects((objects) => cache.putData(PROJECTS_DB_ID, objects))
    .catch(console.error);

  // My library
  console.time('Fetch my library');
  dispatch(myLibraryLoading(true));
  cache.putData(LOADING_DB + MY_LIBRARY_DB_ID, true);
  getMyLibraryObjectList((objects) => cache.putData(MY_LIBRARY_DB_ID, objects))
    .catch(console.error)
    .finally(() => {
      console.timeEnd('Fetch my library');
      dispatch(myLibraryLoading(false));
      cache.putData(LOADING_DB + MY_LIBRARY_DB_ID, false);
    });

  // Environment library
  console.time('Fetch environment objects');
  dispatch(objectListLoading(true));
  cache.putData(LOADING_DB + ENV_LIBRARY_DB_ID, true);
  getObjectList((objects) => cache.putData(ENV_LIBRARY_DB_ID, objects, true)).catch(console.error)
    .finally(() => {
      console.timeEnd('Fetch environment objects');
      dispatch(objectListLoading(false));
      cache.putData(LOADING_DB + ENV_LIBRARY_DB_ID, false);
    });
}

export function createCache() {
  return (dispatch, getState) => {
    // Create or get DB for current user
    const { sessionReducer } = getState();
    const { username } = sessionReducer;
    const cache = new DB(username || 'cache');
    // Remove PouchDBs from other users
    DB.purgePouchDB(username);
    cache.callIfEmpty(() => {
      fetchObjects(dispatch, cache);
    });
  };
}

export function refreshCache() {
  return (dispatch, getState) => {
    // Create or get DB for current user
    const { sessionReducer } = getState();
    const { username } = sessionReducer;
    const cache = new DB(username || 'cache');
    // Overwrite cache
    cache.reset().then(() => {
      fetchObjects(dispatch, cache);
    });
  };
}

export function dispatchCacheResults(result, dispatch) {
  switch (result.id) {
    case PROJECTS_DB_ID:
      dispatch(addProjects(result.doc.data));
      break;
    case MY_LIBRARY_DB_ID:
      dispatch(addMyLibraryObjects(result.doc.data));
      break;
    case ENV_LIBRARY_DB_ID:
      dispatch(addEnvObjects(result.doc.data));
      break;
    case LOADING_DB + MY_LIBRARY_DB_ID:
      dispatch(myLibraryLoading(result.doc.data));
      break;
    case LOADING_DB + ENV_LIBRARY_DB_ID:
      dispatch(objectListLoading(result.doc.data));
      break;
    default:
      break;
  }
}

export function connectToCache(prevCache) {
  return (dispatch, getState) => {
    // Create or get DB for current user
    const { sessionReducer } = getState();
    const { username } = sessionReducer;
    const cache = prevCache || new DB(username || 'cache');
    if (!prevCache) {
      dispatch(myLibraryLoading(true));
      dispatch(objectListLoading(true));
    }

    const onChange = cache.onChange((results) => {
      dispatchCacheResults(results, dispatch)
    });
    return [cache, onChange]
  };
}

export function listenToCache(prevCache) {
  return (dispatch, getState) => {
    // Create or get DB for current user
    const { sessionReducer } = getState();
    const { username } = sessionReducer;
    const cache = prevCache || new DB(username || 'cache');
    if (!prevCache) {
      dispatch(myLibraryLoading(true));
      dispatch(objectListLoading(true));
    }

    const onChange = cache.getAllObjects()
      .then((results) => {
        results.rows.forEach((result) => {
          dispatchCacheResults(result, dispatch)
        })
      });
    return [cache, onChange];
  };
}

export function clearCache(prevCache) {
  return (dispatch, getState) => {
    const { sessionReducer } = getState();
    const { username } = sessionReducer;
    const cache = prevCache || new DB(username || 'cache');
    dispatch(clearStateCache());
    return cache.clear().catch(console.error);
  };
}
