import { UPDATE_OBJECT, DELETE_OBJECT } from './object-actions';
import { IMPORT_REQUESTED } from './operation-actions';

const initialState = { objects: [] };
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

function updateObject(state, updatedObjectProps) {
  const objectToUpdateIndex = state.objects
    .findIndex(object => object.objectWorkingId === updatedObjectProps.objectWorkingId);
  if (objectToUpdateIndex === -1) { throw new Error(); }
  const newObjects = [...state.objects];
  const updatedObject = { ...state.objects[objectToUpdateIndex], ...updatedObjectProps };
  newObjects.splice(objectToUpdateIndex, 1, updatedObject);
  return { objects:newObjects };
}

function deleteObject(state, objectWorkingId) {
  const objectToRemoveIndex = state.objects
    .findIndex(object => object.objectWorkingId === objectWorkingId);
  if (objectToRemoveIndex === -1) { throw new Error(); }
  const newObjects = [...state.objects];
  newObjects.splice(objectToRemoveIndex, 1);
  return { objects: newObjects };
}
