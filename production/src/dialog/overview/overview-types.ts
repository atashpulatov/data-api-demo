import { PageByRefreshFailedOptions, PopupTypes } from '@mstr/connector-components';
import { LoadedObject } from '@mstr/connector-components/lib/loaded-objects/object-tile/object-tile-types';

export enum OverviewActionCommands {
  IMPORT = 'overview-import',
  EDIT = 'overview-edit',
  REFRESH = 'overview-refresh',
  REMOVE = 'overview-remove',
  DUPLICATE = 'overview-duplicate',
  REPROMPT = 'overview-reprompt',
  RANGE_TAKEN_OK = 'overview-range-taken-ok',
  RANGE_TAKEN_CLOSE = 'overview-range-taken-close',
  PAGE_BY_REFRESH_FAILED_CLOSE = 'overview-page-by-refresh-failed-close',
  PAGE_BY_DUPLICATE_FAILED_CLOSE = 'overview-page-by-duplicate-failed-close',
  PAGE_BY_IMPORT_FAILED_CLOSE = 'overview-page-by-import-failed-close',
  PAGE_BY_REFRESH_FAILED_EDIT = 'overview-page-by-refresh-failed-edit',
  PAGE_BY_REFRESH_FAILED_REMOVE = 'overview-page-by-refresh-failed-remove',
  RENAME = 'overview-rename',
  GO_TO_WORKSHEET = 'overview-go-to-worksheet',
  DISMISS_NOTIFICATION = 'overview-dismiss-notification',
  DISMISS_GLOBAL_NOTIFICATION = 'overview-dismiss-global-notification',
  DISMISS_REMOVED_OBJECT = 'overview-dismiss-removed-object',
}

export interface DuplicatePopup {
  type: PopupTypes;
  activeCell: string;
  onImport: (isActiveCellOptionSelected: boolean) => void;
  onEdit: (isActiveCellOptionSelected: boolean) => void;
  onClose: () => void;
}

export interface RangeTakenPopup {
  type: PopupTypes;
  onOk: () => void;
  onClose: () => void;
}

export interface PageByRefreshFailedPopup {
  type: PopupTypes;
  onOk: (refreshFailedOptions?: PageByRefreshFailedOptions) => void;
  onClose: () => void;
}

export interface PageByDuplicateFailedPopup {
  type: PopupTypes;
  selectedObjects: LoadedObject[];
  onOk: (refreshFailedOptions?: PageByRefreshFailedOptions) => void;
}

export interface PageByImportFailedPopup {
  type: PopupTypes;
  errorDetails: string;
  onOk: (refreshFailedOptions?: PageByRefreshFailedOptions) => void;
}

export interface DialogPopup {
  objectWorkingIds: number[];
  setDialogPopup: (
    dialogPopup:
      | DuplicatePopup
      | RangeTakenPopup
      | PageByRefreshFailedPopup
      | PageByDuplicateFailedPopup
      | PageByImportFailedPopup
  ) => void;
  activeCellAddress?: string;
  selectedObjects?: LoadedObject[];
  onDuplicate?: (
    objectWorkingIds: number[],
    insertNewWorksheet: boolean,
    withEdit: boolean
  ) => void;
}
