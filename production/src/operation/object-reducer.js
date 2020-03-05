import { UPDATE_OBJECT, GET_OBJECT_DATA, DELETE_OBJECT } from './object-actions';
import { IMPORT_REQUESTED } from './operation-actions';

const initialState = [];

export const objectReducer = (state = initialState, action) => {
  switch (action.type) {
  case IMPORT_REQUESTED:
    return importRequested(state, action.payload);
  case UPDATE_OBJECT:
    return updateObject(state, action.payload);
  case GET_OBJECT_DATA:
    return getObjectData(state, action.payload);
  case DELETE_OBJECT:
    return deleteObject(state, action.payload);
  default:
    return state;
  }
};

function importRequested(state, payload) {
  return [
    ...state,
    payload.object,
  ];
}

function updateObject(state, updatedObject) {
  return state.map((object) => (object.objectWorkingId === updatedObject.objectWorkingId
    ? { ...object, ...updatedObject }
    : object));
}

function getObjectData(state, objectWorkingId) {
  return state.find((object) => object.objectWorkingId === objectWorkingId);
}

function deleteObject(state, objectWorkingId) {
  return state.splice(state.findIndex(object => object.objectWorkingId === objectWorkingId), 1);
}
