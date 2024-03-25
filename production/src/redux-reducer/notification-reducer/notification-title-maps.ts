import type {
  OperationTypesWithNotification,
  OperationTypesWithProgressNotification,
} from './notification-reducer-types';

export const titleOperationInProgressMap: Record<OperationTypesWithProgressNotification, string> = {
  PENDING_OPERATION: 'Pending',
  IMPORT_OPERATION: 'Importing',
  REFRESH_OPERATION: 'Refreshing',
  EDIT_OPERATION: 'Importing',
  REMOVE_OPERATION: 'Removing',
  DUPLICATE_OPERATION: 'Duplicating',
  CLEAR_DATA_OPERATION: 'Clearing',
};

export const titleOperationCompletedMap: Record<OperationTypesWithNotification, string> = {
  IMPORT_OPERATION: 'Import successful',
  REFRESH_OPERATION: 'Refresh successful',
  EDIT_OPERATION: 'Import successful',
  REMOVE_OPERATION: 'Object removed successfully',
  DUPLICATE_OPERATION: 'Object duplicated successfully',
  CLEAR_DATA_OPERATION: 'Object cleared successfully',
};

export const titleOperationFailedMap: Record<OperationTypesWithNotification, string> = {
  IMPORT_OPERATION: 'Failed to import',
  REFRESH_OPERATION: 'Failed to refresh',
  EDIT_OPERATION: 'Failed to edit',
  REMOVE_OPERATION: 'Failed to delete',
  DUPLICATE_OPERATION: 'Failed to duplicate',
  CLEAR_DATA_OPERATION: 'Failed to clear',
};
