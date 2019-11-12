/* eslint-disable import/no-cycle */
import { addNestedPropertiesToObjects } from '@mstr/rc';
import DB from './pouch-db';
import getObjectList, { fetchProjects, getMyLibraryObjectList } from '../mstr-object/mstr-list-rest-service';


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
export const CURRENT_USER = 'user';

export const objectListLoading = (isLoading) => ({
  type: SET_OBJECT_LIST_LOADING,
  data: isLoading,
});

export const myLibraryLoading = (isLoading) => ({
  type: SET_MY_LIBRARY_LOADING,
  data: isLoading,
});

export const addMyLibraryObjects = (objects, append = false) => ({
  type: ADD_MY_LIBRARY_OBJECTS,
  data: { objects, append },
});

export const addEnvObjects = (objects, append = false) => ({
  type: ADD_ENV_OBJECTS,
  data: { objects, append },
});

export const addProjects = (objects) => ({
  type: ADD_PROJECTS,
  data: objects,
});

export const clearStateCache = () => ({ type: CLEAR_CACHE, });

export const refreshCacheAction = () => ({ type: REFRESH_CACHE, });

export const refreshCacheState = () => (dispatch) => {
  dispatch(refreshCacheAction());
};

export function fetchObjects(dispatch, cache) {
  // Projects
  fetchProjects((projects) => {
    cache.putData(PROJECTS_DB_ID, projects, true).catch(console.error);

    // My library
    console.time('Creating my library cache');
    dispatch(myLibraryLoading(true));
    cache.putData(LOADING_DB + MY_LIBRARY_DB_ID, true);
    getMyLibraryObjectList((objects) => cache.putData(MY_LIBRARY_DB_ID, objects, true))
      .catch(console.error)
      .finally(() => {
        console.timeEnd('Creating my library cache');
        cache.putData(LOADING_DB + MY_LIBRARY_DB_ID, false).then(() => {
          dispatch(myLibraryLoading(false));
        });
      });

    // Environment library
    console.time('Creating environment cache');
    dispatch(objectListLoading(true));
    cache.putData(LOADING_DB + ENV_LIBRARY_DB_ID, true);
    getObjectList((objects) => {
      objects = addNestedPropertiesToObjects(objects, projects);
      return cache.putData(ENV_LIBRARY_DB_ID, objects, true);
    })
      .catch(console.error)
      .finally(() => {
        console.timeEnd('Creating environment cache');
        cache.putData(LOADING_DB + ENV_LIBRARY_DB_ID, false).then(() => {
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
      getMyLibraryObjectList((objects) => dispatch(addMyLibraryObjects(objects, true)))
        .catch(console.error)
        .finally(() => dispatch(myLibraryLoading(false)));

      // Environment library
      dispatch(objectListLoading(true));
      getObjectList((objects) => {
        objects = addNestedPropertiesToObjects(objects, projects);
        dispatch(addEnvObjects(objects, true));
      })
        .catch(console.error)
        .finally(() => dispatch(objectListLoading(false)));
    })
      .catch(console.error);
  };
}

export function initCache(cache, loading = false) {
  console.log('Initializing cache');
  return Promise.all([
    cache.putData(PROJECTS_DB_ID, []),
    cache.putData(LOADING_DB + MY_LIBRARY_DB_ID, loading),
    cache.putData(MY_LIBRARY_DB_ID, []),
    cache.putData(LOADING_DB + ENV_LIBRARY_DB_ID, loading),
    cache.putData(ENV_LIBRARY_DB_ID, []),
  ]);
}

export function resetLoading(cache) {
  return Promise.all([
    cache.putData(LOADING_DB + MY_LIBRARY_DB_ID, false),
    cache.putData(LOADING_DB + ENV_LIBRARY_DB_ID, false),
  ]);
}

export function createCache(initUsername) {
  return (dispatch, getState) => {
    // Create or get DB for current user
    const { sessionReducer } = getState();
    const { userID } = sessionReducer;
    const user = initUsername || userID;
    const cache = new DB();
    // Clear PouchDB if user is different
    cache.get(CURRENT_USER).then((doc) => {
      if (doc.data !== userID) {
        console.log('Creating cache for user', user);
        return initCache(cache).then(() => {
          cache.putData(CURRENT_USER, user).then(() => {
            fetchObjects(dispatch, cache);
          });
        });
      }
      // If loading is active when starting the add-in with the same user,
      // we disable loading to allow refresh.
      return resetLoading(cache).catch(console.error);
    }).catch((error) => {
      if (error.name === 'not_found') {
        console.log('Creating new cache for user', user);
        return cache.instance
          .put({ _id: CURRENT_USER, data: user })
          .then(() => {
            fetchObjects(dispatch, cache);
          });
      }
      console.error(error);
    });
  };
}

export function refreshCache() {
  return (dispatch) => {
    const cache = new DB();
    // Overwrite cache
    initCache(cache, true).then(() => {
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
  return (dispatch) => {
    const cache = prevCache || new DB();
    if (!prevCache) {
      dispatch(myLibraryLoading(true));
      dispatch(objectListLoading(true));
    }

    const onChange = cache.onChange((results) => {
      dispatchCacheResults(results, dispatch);
    });
    return [cache, onChange];
  };
}

export function listenToCache(prevCache) {
  return (dispatch) => {
    const cache = prevCache || new DB();
    if (!prevCache) {
      dispatch(myLibraryLoading(true));
      dispatch(objectListLoading(true));
    }

    const onChange = cache.get(PROJECTS_DB_ID).then((projects) => {
      dispatch(addProjects(projects.data));
      cache.get(ENV_LIBRARY_DB_ID).then((objects) => {
        dispatch(addEnvObjects(objects.data));
        cache.get(LOADING_DB + ENV_LIBRARY_DB_ID).then((loading) => {
          dispatch(objectListLoading(loading.data));
        });
      });
      cache.get(MY_LIBRARY_DB_ID).then((objects) => {
        dispatch(addMyLibraryObjects(objects.data));
        cache.get(LOADING_DB + MY_LIBRARY_DB_ID).then((loading) => {
          dispatch(myLibraryLoading(loading.data));
        });
      });
    });

    return [cache, onChange];
  };
}

export function clearCache(prevCache) {
  return (dispatch) => {
    const cache = prevCache || new DB();
    dispatch(clearStateCache());
    console.log('Clearing cache');
    return cache.putData(CURRENT_USER, null).then(() => {
      initCache(cache);
    }).catch(console.error);
  };
}
