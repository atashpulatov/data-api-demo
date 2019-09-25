import DB from './pouch-db';
import getObjectList, { getMyLibraryObjectList } from '../mstr-object/mstr-list-rest-service';


export const CREATE_CACHE = 'CREATE_CACHE';
export const CLEAR_CACHE = 'CLEAR_CACHE';
export const SET_OBJECT_LIST_LOADING = 'SET_OBJECT_LIST_LOADING';
export const SET_MY_LIBRARY_LOADING = 'SET_MY_LIBRARY_LOADING';

export const objectListLoading = (isLoading) => ({
  type: SET_OBJECT_LIST_LOADING,
  isLoading,
});

export const myLibraryLoading = (isLoading) => ({
  type: SET_MY_LIBRARY_LOADING,
  isLoading,
});

export function createCache() {
  return (dispatch, getState) => {
    // Create or get DB for current user
    const { sessionReducer } = getState();
    const { username } = sessionReducer;
    const objectsDB = new DB(`${username || 'cache'}-objects`);
    const myLibraryDB = new DB(`${username || 'cache'}-my-library`);
    // Remove PouchDBs from other users
    DB.purgePouchDB(username);
    dispatch(objectListLoading(true));
    objectsDB.addObjectsAsync(getObjectList)
      .then(() => { dispatch(objectListLoading(false)); })
      .catch(console.error);

    dispatch(myLibraryLoading(true));
    myLibraryDB.addObjectsAsync(getMyLibraryObjectList)
      .then(() => { dispatch(myLibraryLoading(false)); })
      .catch(console.error);
  };
}

export function clearCache() {
  return (dispatch, getState) => {
    const { sessionReducer } = getState();
    const { username } = sessionReducer;
    const objectsDB = new DB(`${username}-objects`);
    const myLibraryDB = new DB(`${username}-my-library`);
    const objectsPromise = objectsDB.clear().catch(console.error);
    const myLibraryPromise = myLibraryDB.clear().catch(console.error);
    return Promise.all([objectsPromise, myLibraryPromise]);
  };
}
