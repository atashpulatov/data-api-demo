import { Action } from 'redux';

import { ObjectData } from '../../types/object-types';
import { OperationActionTypes, OperationData } from '../operation-reducer/operation-reducer-types';

export interface ObjectState {
  objects: ObjectData[];
}

export enum ObjectActionTypes {
  UPDATE_OBJECT = 'UPDATE_OBJECT',
  REMOVE_OBJECT = 'REMOVE_OBJECT',
  RESTORE_ALL_OBJECTS = 'RESTORE_ALL_OBJECTS',
  RESTORE_OBJECT_BACKUP = 'RESTORE_OBJECT_BACKUP',
  UPDATE_OBJECTS = 'UPDATE_OBJECTS',
}

export interface ImportRequestedPayload {
  object: ObjectData;
}

export interface EditRequestedPayload {
  operation: OperationData;
}

interface RestoreObjectBackupPayload extends ObjectData {}

export interface ImportRequestedAction extends Action {
  type: OperationActionTypes.IMPORT_OPERATION | OperationActionTypes.DUPLICATE_OPERATION;
  payload: ImportRequestedPayload;
}

export interface EditRequestedAction extends Action {
  type: OperationActionTypes.EDIT_OPERATION;
  payload: EditRequestedPayload;
}

export interface UpdateObjectAction extends Action {
  type: ObjectActionTypes.UPDATE_OBJECT;
  payload: Partial<ObjectData>;
}

export interface UpdateObjectsAction extends Action {
  type: ObjectActionTypes.UPDATE_OBJECTS;
  payload: Partial<ObjectData>[];
}

export interface RemoveObjectAction extends Action {
  type: ObjectActionTypes.REMOVE_OBJECT;
  payload: number;
}

export interface RestoreAllObjectsAction extends Action {
  type: ObjectActionTypes.RESTORE_ALL_OBJECTS;
  payload: ObjectData[];
}

export interface RestoreObjectBackupAction extends Action {
  type: ObjectActionTypes.RESTORE_OBJECT_BACKUP;
  payload: RestoreObjectBackupPayload;
}

export type ObjectActions =
  | ImportRequestedAction
  | EditRequestedAction
  | UpdateObjectAction
  | UpdateObjectsAction
  | RemoveObjectAction
  | RestoreAllObjectsAction
  | RestoreObjectBackupAction;
