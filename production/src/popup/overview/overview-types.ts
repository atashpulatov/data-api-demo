import { PopupTypes } from '@mstr/connector-components';

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

export interface DialogPopup {
  objectWorkingIds: number[];
  setDialogPopup: (dialogPopup: DuplicatePopup | RangeTakenPopup) => void;
  activeCellAddress?: string;
  onDuplicate?: (
    objectWorkingIds: number[],
    insertNewWorksheet: boolean,
    withEdit: boolean
  ) => void;
}
