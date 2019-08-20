export function TableRemovedFromExcelError(message) {
  this.message = message;
};
TableRemovedFromExcelError.prototype = new Error();
