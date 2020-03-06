import { UPDATE_OBJECT, DELETE_OBJECT } from './object-actions';
import { IMPORT_REQUESTED } from './operation-actions';

const initialState = [];

export const objectReducer = (state = initialState, action) => {
  switch (action.type) {
  case IMPORT_REQUESTED:
    return importRequested(state, action.payload);
  case UPDATE_OBJECT:
    return updateObject(state, action.payload);
  case DELETE_OBJECT:
    return deleteObject(state, action.payload);
  default:
    return state;
  }
};

function importRequested(state, payload) {
  return {
    objects: [
      ...state.objects,
      payload.object,
    ]
  };
}

function updateObject(state, updatedObject) {
  return {
    objects: state.objects.map((object) => (object.objectWorkingId === updatedObject.objectWorkingId
      ? { ...object, ...updatedObject }
      : object))
  };
}

function deleteObject(state, objectWorkingId) {
  const objectToRemoveIndex = state.objects.findIndex(object => object.objectWorkingId === objectWorkingId);
  if (objectToRemoveIndex !== -1) {
    const newObjects = [...state.objects];
    newObjects.splice(objectToRemoveIndex, 1);
    return { objects: newObjects };
  }
  return state;
}
