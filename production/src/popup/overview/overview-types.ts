import { PageByRefreshFailedOptions, PopupTypes } from '@mstr/connector-components';
import { LoadedObject } from '@mstr/connector-components/lib/loaded-objects/object-tile/object-tile-types';

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
