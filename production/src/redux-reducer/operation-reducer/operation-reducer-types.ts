import { OperationTypes } from '../../operation/operation-type-names';

// TODO: refactor.
// this is a temporary initial version. it should be improved
type Operation = {
  operationType: OperationTypes;
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
