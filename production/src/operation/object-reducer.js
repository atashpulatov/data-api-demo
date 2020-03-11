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
  const objectToUpdateIndex = getObjectIndex(state.objects, updatedObjectProps.objectWorkingId);
  const newObjects = [...state.objects];
  const updatedObject = { ...state.objects[objectToUpdateIndex], ...updatedObjectProps };
  newObjects.splice(objectToUpdateIndex, 1, updatedObject);
  return { objects:newObjects };
}

function deleteObject(state, objectWorkingId) {
  const objectToRemoveIndex = getObjectIndex(state.objects, objectWorkingId);
  const newObjects = [...state.objects];
  newObjects.splice(objectToRemoveIndex, 1);
  return { objects: newObjects };
}

function getObjectIndex(objects, objectWorkingId) {
  console.log('getObjectIndexobjectWorkingId:', objectWorkingId);
  console.log('getObjectIndexobjects:', objects);
  const objectToUpdateIndex = objects
    .findIndex(object => object.objectWorkingId === objectWorkingId);
  if (objectToUpdateIndex === -1) {
    throw new Error();
  }
  return objectToUpdateIndex;
}
