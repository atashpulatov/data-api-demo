import { IMPORT_REQUESTED, EDIT_REQUESTED, DUPLICATE_REQUESTED } from './operation-actions';
import {
  UPDATE_OBJECT, REMOVE_OBJECT, RESTORE_ALL_OBJECTS, RESTORE_OBJECT_BACKUP
} from './object-actions';

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

    case REMOVE_OBJECT:
      return removeObject(state, action.payload);

    case RESTORE_ALL_OBJECTS:
      return restoreAllObjects(action.payload);

    case RESTORE_OBJECT_BACKUP:
      return restoreObjectBackup(state, action.payload);

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

function removeObject(state, objectWorkingId) {
  const objectToRemoveIndex = getObjectIndex(state.objects, objectWorkingId);
  const newObjects = [...state.objects];
  newObjects.splice(objectToRemoveIndex, 1);
  return { objects: newObjects };
}

function restoreAllObjects(payload) {
  return { objects: [...payload] };
}

function restoreObjectBackup(state, backupObjectData) {
  const objectToUpdateIndex = getObjectIndex(state.objects, backupObjectData.objectWorkingId);
  const newObjects = [...state.objects];
  newObjects.splice(objectToUpdateIndex, 1, backupObjectData);
  return { objects: newObjects };
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
