import { ErrorMessages, ErrorType } from './constants';

export class ProtectedSheetError extends Error {
  type: ErrorType;

  constructor(message = ErrorMessages.PROTECTED_SHEET) {
    super(message);
    this.type = ErrorType.PROTECTED_SHEET_ERR;
  }
}
