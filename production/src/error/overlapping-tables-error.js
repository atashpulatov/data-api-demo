export function OverlappingTablesError(message) {
  this.message = message;
}
OverlappingTablesError.prototype = new Error();
