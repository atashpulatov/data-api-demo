import { errorTypes, PROTECTED_SHEET } from './constants';

export function ProtectedSheetError(message = PROTECTED_SHEET) {
  this.message = message;
  this.type = errorTypes.PROTECTED_SHEET_ERR;
}
ProtectedSheetError.prototype = new Error();
