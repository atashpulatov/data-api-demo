import { UPDATE_OBJECT, DELETE_OBJECT, RESTORE_ALL_OBJECTS } from './object-actions';
import { IMPORT_REQUESTED, EDIT_REQUESTED, DUPLICATE_REQUESTED } from './operation-actions';

const initialState = { objects: [] };
export const objectReducer = (state = initialState, action) => {
  switch (action.type) {
    case IMPORT_REQUESTED:
    case DUPLICATE_REQUESTED:
      return importRequested(state, action.payload);

    case EDIT_REQUESTED:
      return editRequested(state, action.payload);

    case UPDATE_OBJECT:
      return updateObject(state, action.payload);

    case DELETE_OBJECT:
      return deleteObject(state, action.payload);

    case RESTORE_ALL_OBJECTS:
      return restoreAllObjects(action.payload);

    default:
      return state;
  }
};

function importRequested(state, payload) {
  return {
    objects: [
      payload.object,
      ...state.objects,
    ]
  };
}

function editRequested(state, payload) {
  const props = { objectWorkingId: payload.objectWorkingId, response: payload.response };
  return updateObject(state, props);
}

function updateObject(state, updatedObjectProps) {
  const objectToUpdateIndex = getObjectIndex(state.objects, updatedObjectProps.objectWorkingId);
  const newObjects = [...state.objects];
  const updatedObject = { ...state.objects[objectToUpdateIndex], ...updatedObjectProps };
  newObjects.splice(objectToUpdateIndex, 1, updatedObject);
  return { objects: newObjects };
}

function deleteObject(state, objectWorkingId) {
  const objectToRemoveIndex = getObjectIndex(state.objects, objectWorkingId);
  const newObjects = [...state.objects];
  newObjects.splice(objectToRemoveIndex, 1);
  return { objects: newObjects };
}

function restoreAllObjects(payload) {
  return { objects: [...payload] };
}

function getObjectIndex(objects, objectWorkingId) {
  const objectToUpdateIndex = objects
    .findIndex(object => object.objectWorkingId === objectWorkingId);
  if (objectToUpdateIndex === -1) {
    // TODO error handling
    throw new Error();
  }
  return objectToUpdateIndex;
}
