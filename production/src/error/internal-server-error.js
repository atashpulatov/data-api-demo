export function InternalServerError(errorBody) {
  this.iServerCode = errorBody.iServerCode;
};
InternalServerError.prototype = new Error();
