import { poupTypes } from '@mstr/connector-components';

export interface DuplicatePopup {
  type: typeof poupTypes,
  activeCell: string,
  onImport: (isActiveCellOptionSelected: boolean) => void,
  onEdit: () => void,
  onClose: () => void
}

export interface RangeTakenPopup {
  type: typeof poupTypes,
  onOk: () => void,
  onClose: () => void
}

export interface DialogPopup {
  objectWorkingId: number,
  setDialogPopup: (dialogPopup: DuplicatePopup | RangeTakenPopup) => void,
  activeCellAddress?: string,
  onDuplicate?: (objectWorkingId: number, insertNewWorksheet: boolean, withEdit: boolean) => void
}
