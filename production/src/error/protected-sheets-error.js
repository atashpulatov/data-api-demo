import { errorTypes, errorMessages } from './constants';

export function ProtectedSheetError(message = errorMessages.PROTECTED_SHEET) {
  this.message = message;
  this.type = errorTypes.PROTECTED_SHEET_ERR;
}
ProtectedSheetError.prototype = new Error();
