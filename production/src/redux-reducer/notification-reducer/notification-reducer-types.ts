import { ReactElement } from 'react';
import type { GlobalNotificationTypes, ObjectNotificationTypes } from '@mstr/connector-components';
import { SidePanelBannerProps } from '@mstr/connector-components/lib/side-panel/banner/side-panel-banner-types';
import type { Action } from 'redux';

import type { OperationData } from '../operation-reducer/operation-reducer-types';

import { OperationSteps } from '../../operation/operation-steps';
import { OperationTypes } from '../../operation/operation-type-names';

// TODO: check and refactor this type if needed.

export type OperationTypesWithNotification = Exclude<
  OperationTypes,
  OperationTypes.HIGHLIGHT_OPERATION
>;

export type OperationTypesWithProgressNotification =
  | 'PENDING_OPERATION'
  | Exclude<OperationTypes, OperationTypes.HIGHLIGHT_OPERATION>;

export interface Notification {
  objectWorkingId: number;
  title: string;
  type: ObjectNotificationTypes;
  operationType: OperationTypes;
  percentage?: number;
  isFetchingComplete?: boolean;
  isIndeterminate?: boolean;
  message?: string;
  details?: string;
  children?: React.ReactNode;
  callback?: () => void;
  dismissNotification?: () => void;
}

export interface GlobalNotification {
  type: string;
  message?: string;
  title?: string;
  details?: string;
}

export interface NotificationState {
  notifications: Notification[];
  globalNotification: GlobalNotification;
  sidePanelBanner: SidePanelBanner | null;
}

export interface SidePanelBanner extends SidePanelBannerProps {
  type?: string;
}

export enum SidePanelBannerType {
  IN_PROGRESS = 'IN_PROGRESS',
  STOPPED = 'STOPPED',
}

export enum NotificationActionTypes {
  IMPORT_OPERATION = 'IMPORT_OPERATION',
  EDIT_OPERATION = 'EDIT_OPERATION',
  REFRESH_OPERATION = 'REFRESH_OPERATION',
  REMOVE_OPERATION = 'REMOVE_OPERATION',
  CLEAR_DATA_OPERATION = 'CLEAR_DATA_OPERATION',
  DUPLICATE_OPERATION = 'DUPLICATE_OPERATION',
  DELETE_NOTIFICATION = 'DELETE_NOTIFICATION',
  MOVE_NOTIFICATION_TO_IN_PROGRESS = 'MOVE_NOTIFICATION_TO_IN_PROGRESS',
  DISPLAY_NOTIFICATION_COMPLETED = 'DISPLAY_NOTIFICATION_COMPLETED',
  CREATE_GLOBAL_NOTIFICATION = 'CREATE_GLOBAL_NOTIFICATION',
  REMOVE_GLOBAL_NOTIFICATION = 'REMOVE_GLOBAL_NOTIFICATION',
  DISPLAY_NOTIFICATION_WARNING = 'DISPLAY_NOTIFICATION_WARNING',
  CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS',
  RESTORE_ALL_NOTIFICATIONS = 'RESTORE_ALL_NOTIFICATIONS',
  MARK_STEP_COMPLETED = 'MARK_STEP_COMPLETED',
  TOGGLE_SECURED_FLAG = 'TOGGLE_SECURED_FLAG',
  SET_SIDE_PANEL_BANNER = 'SET_SIDE_PANEL_BANNER',
}

export enum TitleOperationInProgressMap {
  PENDING_OPERATION = 'Pending',
  IMPORT_OPERATION = 'Importing',
  REFRESH_OPERATION = 'Refreshing',
  EDIT_OPERATION = 'Importing',
  REMOVE_OPERATION = 'Removing',
  DUPLICATE_OPERATION = 'Duplicating',
  CLEAR_DATA_OPERATION = 'Clearing',
}

export enum TitleOperationCompletedMap {
  IMPORT_OPERATION = 'Import successful',
  REFRESH_OPERATION = 'Refresh successful',
  EDIT_OPERATION = 'Import successful',
  REMOVE_OPERATION = 'Object removed successfully',
  DUPLICATE_OPERATION = 'Object duplicated successfully',
  CLEAR_DATA_OPERATION = 'Object cleared successfully',
}

export enum TitleOperationFailedMap {
  IMPORT_OPERATION = 'Failed to import',
  REFRESH_OPERATION = 'Failed to refresh',
  EDIT_OPERATION = 'Failed to edit',
  REMOVE_OPERATION = 'Failed to delete',
  DUPLICATE_OPERATION = 'Failed to duplicate',
  CLEAR_DATA_OPERATION = 'Failed to clear',
}

export interface ImportOperationAction extends Action {
  type: NotificationActionTypes.IMPORT_OPERATION;
  payload: { operation: OperationData };
}

export interface RefreshOperationAction extends Action {
  type: NotificationActionTypes.REFRESH_OPERATION;
  payload: { operation: OperationData };
}

export interface RemoveOperationAction extends Action {
  type: NotificationActionTypes.REMOVE_OPERATION;
  payload: { operation: OperationData };
}

export interface DuplicateOperationAction extends Action {
  type: NotificationActionTypes.DUPLICATE_OPERATION;
  payload: { operation: OperationData };
}

export interface ClearDataOperationAction extends Action {
  type: NotificationActionTypes.CLEAR_DATA_OPERATION;
  payload: { operation: OperationData };
}

export interface EditOperationAction extends Action {
  type: NotificationActionTypes.EDIT_OPERATION;
  payload: { operation: OperationData };
}

export interface MoveNotificationToInProgressAction extends Action {
  type: NotificationActionTypes.MOVE_NOTIFICATION_TO_IN_PROGRESS;
  payload: { objectWorkingId: number };
}

export interface DisplayNotificationCompletedAction extends Action {
  type: NotificationActionTypes.DISPLAY_NOTIFICATION_COMPLETED;
  payload: { objectWorkingId: number };
}

export interface CreateConnectionLostNotificationAction extends Action {
  type: NotificationActionTypes.CREATE_GLOBAL_NOTIFICATION;
  payload: { type: GlobalNotificationTypes.CONNECTION_ERROR };
}

export interface CreateSessionExpiredNotificationAction extends Action {
  type: NotificationActionTypes.CREATE_GLOBAL_NOTIFICATION;
  payload: { type: GlobalNotificationTypes.MSTR_SESSION_EXPIRED };
}

export interface DisplayGlobalNotificationAction extends Action {
  type: NotificationActionTypes.CREATE_GLOBAL_NOTIFICATION;
  payload: {
    type: GlobalNotificationTypes.GLOBAL_WARNING;
    message?: string;
    title?: string;
  };
}

export interface DeleteObjectNotificationAction extends Action {
  type: NotificationActionTypes.DELETE_NOTIFICATION;
  payload: { objectWorkingId: number };
}

export interface DisplayObjectWarningAction extends Action {
  type: NotificationActionTypes.DISPLAY_NOTIFICATION_WARNING;
  payload: { objectWorkingId: number; notification: Notification };
}

export interface ClearNotificationsAction extends Action {
  type: NotificationActionTypes.CLEAR_NOTIFICATIONS;
}

export interface ClearGlobalNotificationAction extends Action {
  type: NotificationActionTypes.REMOVE_GLOBAL_NOTIFICATION;
}

export interface RestoreAllNotificationsAction extends Action {
  type: NotificationActionTypes.RESTORE_ALL_NOTIFICATIONS;
  payload: Notification[];
}

export interface CreateGlobalNotificationAction extends Action {
  type: NotificationActionTypes.CREATE_GLOBAL_NOTIFICATION;
  payload: any; // Replace 'any' with the appropriate type
}

export interface MarkStepCompletedAction extends Action {
  type: NotificationActionTypes.MARK_STEP_COMPLETED;
  payload: { completedStep: OperationSteps; objectWorkingId: number };
}

export interface ToggleSecuredFlagAction extends Action {
  type: NotificationActionTypes.TOGGLE_SECURED_FLAG;
  isSecured: boolean;
}

export interface SetSidePanelBannerAction extends Action {
  type: NotificationActionTypes.SET_SIDE_PANEL_BANNER;
  payload: SidePanelBanner;
}

export type NotificationActions =
  | ImportOperationAction
  | RefreshOperationAction
  | RemoveOperationAction
  | DuplicateOperationAction
  | ClearDataOperationAction
  | EditOperationAction
  | MoveNotificationToInProgressAction
  | DisplayNotificationCompletedAction
  | MarkStepCompletedAction
  | ToggleSecuredFlagAction
  | CreateConnectionLostNotificationAction
  | CreateSessionExpiredNotificationAction
  | DisplayGlobalNotificationAction
  | DeleteObjectNotificationAction
  | DisplayObjectWarningAction
  | ClearNotificationsAction
  | ClearGlobalNotificationAction
  | RestoreAllNotificationsAction
  | CreateGlobalNotificationAction
  | SetSidePanelBannerAction;
