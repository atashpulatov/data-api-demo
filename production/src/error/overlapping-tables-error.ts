import { ErrorType } from './constants';

export class OverlappingTablesError extends Error {
  type: ErrorType;

  constructor(message?: string) {
    super(message);
    this.type = ErrorType.OVERLAPPING_TABLES_ERR;
  }
}
