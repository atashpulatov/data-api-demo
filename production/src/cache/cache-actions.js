import DB from './pouch-db';
import getObjectList, { getMyLibraryObjectList, fetchProjects } from '../mstr-object/mstr-list-rest-service';


export const CREATE_CACHE = 'CREATE_CACHE';
export const CLEAR_CACHE = 'CLEAR_CACHE';
export const SET_OBJECT_LIST_LOADING = 'SET_OBJECT_LIST_LOADING';
export const SET_MY_LIBRARY_LOADING = 'SET_MY_LIBRARY_LOADING';
export const SET_PROJECTS_LOADING = 'SET_PROJECTS_LOADING';
export const ADD_MY_LIBRARY_OBJECTS = 'ADD_MY_LIBRARY_OBJECTS';
export const ADD_PROJECTS = 'ADD_PROJECTS';
export const ADD_ENV_OBJECTS = 'ADD_ENV_OBJECTS';

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

export const clearStateCache = () => ({
  type: CLEAR_CACHE,
});

export function fetchObjects() {
  return (dispatch, getState) => {
    // Projects
    fetchProjects((objects) => {
      dispatch(addProjects(objects));
    });

    // My library
    dispatch(myLibraryLoading(true));
    getMyLibraryObjectList((objects) => {
      dispatch(addMyLibraryObjects(objects));
    }).finally(() => {
      dispatch(myLibraryLoading(false));
    });

    // Environment library
    dispatch(objectListLoading(true));
    getObjectList((objects) => {
      dispatch(addEnvObjects(objects));
    }).finally(() => {
      dispatch(objectListLoading(false));
    });
  };
}

export function createCache() {
  return (dispatch, getState) => {
    // Create or get DB for current user
    const { sessionReducer } = getState();
    const { username } = sessionReducer;
    const cache = new DB(username || 'cache');
    // Remove PouchDBs from other users
    DB.purgePouchDB(username);
    dispatch(objectListLoading(true));
    cache.addObjectsAsync(getObjectList)
      .then((allObjects) => {
        // Add to cache
        dispatch(objectListLoading(false));
      })
      .catch(console.error);
  };
}

export function clearCache() {
  return (dispatch, getState) => {
    const { sessionReducer } = getState();
    const { username } = sessionReducer;
    const cache = new DB(username || 'cache');
    dispatch(clearStateCache());
    return cache.clear().catch(console.error);
  };
}
