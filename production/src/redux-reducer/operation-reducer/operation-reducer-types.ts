import {
  CLEAR_DATA_OPERATION,
  DUPLICATE_OPERATION,
  EDIT_OPERATION,
  HIGHLIGHT_OPERATION,
  IMPORT_OPERATION,
  REFRESH_OPERATION,
  REMOVE_OPERATION,
} from '../../operation/operation-type-names';

// TODO: refactor.
// this is a temporary initial version. it should be improved
type Operation = {
  operationType:
    | typeof IMPORT_OPERATION
    | typeof REFRESH_OPERATION
    | typeof EDIT_OPERATION
    | typeof DUPLICATE_OPERATION
    | typeof CLEAR_DATA_OPERATION
    | typeof HIGHLIGHT_OPERATION
    | typeof REMOVE_OPERATION;
  objectWorkingId: number;
  stepsQueue: string[];
  backupObjectData: Record<string, unknown>;
  objectEditedData: Record<string, unknown>;
  instanceDefinition: Record<string, unknown>;
  startCell: string;
  excelContext: Record<string, unknown>;
  officeTable: Record<string, unknown>;
  tableChanged: boolean;
  totalRows: number;
  loadedRows: number;
  shouldFormat: boolean;
};

export type Operations = Operation[];
