/* eslint-disable @typescript-eslint/no-use-before-define */
import { ObjectData } from '../../types/object-types';
import { OperationActionTypes } from '../operation-reducer/operation-reducer-types';
import {
  EditRequestedPayload,
  ImportRequestedPayload,
  ObjectActions,
  ObjectActionTypes,
  ObjectState,
} from './object-reducer-types';

import { ObjectImportType } from '../../mstr-object/constants';

const initialState: ObjectState = { objects: [] };

// eslint-disable-next-line default-param-last
export const objectReducer = (state = initialState, action: ObjectActions): ObjectState => {
  switch (action.type) {
    case OperationActionTypes.IMPORT_OPERATION:
    case OperationActionTypes.DUPLICATE_OPERATION:
      return importRequested(state, action.payload);

    case OperationActionTypes.EDIT_OPERATION:
      return editRequested(state, action.payload);

    case ObjectActionTypes.UPDATE_OBJECT:
      return updateObject(state, action.payload);

    case ObjectActionTypes.REMOVE_OBJECT:
      return removeObject(state, action.payload);

    case ObjectActionTypes.RESTORE_ALL_OBJECTS:
      return restoreAllObjects(action.payload);

    case ObjectActionTypes.RESTORE_OBJECT_BACKUP:
      return restoreObjectBackup(state, action.payload);

    default:
      return state;
  }
};

function importRequested(state: ObjectState, payload: ImportRequestedPayload): ObjectState {
  console.log('payload', payload);
  const objectToBeImported = { ...payload.object };

  objectToBeImported.importType = payload.object.importType || ObjectImportType.TABLE;
  return {
    objects: [objectToBeImported, ...state.objects],
  };
}

function editRequested(state: ObjectState, payload: EditRequestedPayload): ObjectState {
  const props = {
    objectWorkingId: payload.operation.objectWorkingId,
    response: payload.operation.objectEditedData,
  };
  return updateObject(state, props);
}

function updateObject(state: ObjectState, updatedObjectProps: Partial<ObjectData>): ObjectState {
  const objectToUpdateIndex = getObjectIndex(state.objects, updatedObjectProps.objectWorkingId);
  const newObjects = [...state.objects];

  // update visualization info explicitly to avoid losing the vizDimensions field
  const oldVisualizationInfo = state.objects[objectToUpdateIndex].visualizationInfo;
  const newVisualizationInfo = updatedObjectProps.visualizationInfo;
  const visualizationInfo = (oldVisualizationInfo || newVisualizationInfo) && {
    ...oldVisualizationInfo,
    ...newVisualizationInfo,
  };

  const updatedObject = {
    ...state.objects[objectToUpdateIndex],
    ...updatedObjectProps,
    visualizationInfo,
  };
  newObjects.splice(objectToUpdateIndex, 1, updatedObject);
  return { objects: newObjects };
}

function removeObject(state: ObjectState, objectWorkingId: number): ObjectState {
  const objectToRemoveIndex = getObjectIndex(state.objects, objectWorkingId);
  if (objectToRemoveIndex !== -1) {
    const newObjects = [...state.objects];
    newObjects.splice(objectToRemoveIndex, 1);
    return { objects: newObjects };
  }
}

function restoreAllObjects(objects: ObjectData[]): ObjectState {
  return { objects: [...objects] };
}

function restoreObjectBackup(state: ObjectState, backupObjectData: ObjectData): ObjectState {
  const objectToUpdateIndex = getObjectIndex(state.objects, backupObjectData.objectWorkingId);
  const newObjects = [...state.objects];
  newObjects.splice(objectToUpdateIndex, 1, backupObjectData);
  return { objects: newObjects };
}

function getObjectIndex(objects: ObjectData[], objectWorkingId: number): number {
  const objectToUpdateIndex = objects.findIndex(
    object => object.objectWorkingId === objectWorkingId
  );
  if (objectToUpdateIndex === -1) {
    // TODO error handling
    throw new Error();
  }
  return objectToUpdateIndex;
}
