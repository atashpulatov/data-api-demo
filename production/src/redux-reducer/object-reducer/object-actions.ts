import { ObjectData } from '../../types/object-types';
import {
  ObjectActionTypes,
  RemoveObjectAction,
  RestoreAllObjectsAction,
  RestoreObjectBackupAction,
  UpdateObjectAction,
} from './object-reducer-types';

export const updateObject = (updatedObject: Partial<ObjectData>): UpdateObjectAction => ({
  type: ObjectActionTypes.UPDATE_OBJECT,
  payload: updatedObject,
});

export const removeObject = (objectWorkingId: number): RemoveObjectAction => ({
  type: ObjectActionTypes.REMOVE_OBJECT,
  payload: objectWorkingId,
});

export const restoreAllObjects = (objects: ObjectData[]): RestoreAllObjectsAction => ({
  type: ObjectActionTypes.RESTORE_ALL_OBJECTS,
  payload: objects,
});

export const restoreObjectBackup = (backupObjectData: ObjectData): RestoreObjectBackupAction => ({
  type: ObjectActionTypes.RESTORE_OBJECT_BACKUP,
  payload: backupObjectData,
});
