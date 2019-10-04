import { errorTypes } from './constants';

export function OverlappingTablesError(message) {
  this.message = message;
  this.type = errorTypes.OVERLAPPING_TABLES_ERR;
}
OverlappingTablesError.prototype = new Error();
