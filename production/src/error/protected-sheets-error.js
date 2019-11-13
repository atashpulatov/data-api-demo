import { errorTypes, PROTECTED_SHEET } from './constants';

export function ProtectedSheetError(message = PROTECTED_SHEET) {
  this.message = message;
  this.type = errorTypes.PROTECTED_SHEET;
}
ProtectedSheetError.prototype = new Error();
