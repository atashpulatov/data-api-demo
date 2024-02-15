import { popupTypes } from '@mstr/connector-components';

export interface DuplicatePopup {
  type: typeof popupTypes,
  activeCell: string,
  onImport: (isActiveCellOptionSelected: boolean) => void,
  onEdit: (isActiveCellOptionSelected: boolean) => void,
  onClose: () => void
}

export interface RangeTakenPopup {
  type: typeof popupTypes,
  onOk: () => void,
  onClose: () => void
}

export interface DialogPopup {
  objectWorkingId: number,
  setDialogPopup: (dialogPopup: DuplicatePopup | RangeTakenPopup) => void,
  activeCellAddress?: string,
  onDuplicate?: (objectWorkingId: number, insertNewWorksheet: boolean, withEdit: boolean) => void
}
