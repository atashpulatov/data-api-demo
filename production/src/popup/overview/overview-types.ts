import { PageByRefreshFailedOptions, PopupTypes } from '@mstr/connector-components';

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

export interface DialogPopup {
  objectWorkingIds: number[];
  setDialogPopup: (
    dialogPopup: DuplicatePopup | RangeTakenPopup | PageByRefreshFailedPopup
  ) => void;
  activeCellAddress?: string;
  onDuplicate?: (
    objectWorkingIds: number[],
    insertNewWorksheet: boolean,
    withEdit: boolean
  ) => void;
}
