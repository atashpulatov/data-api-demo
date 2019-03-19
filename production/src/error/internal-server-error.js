export function InternalServerError(errorBody) {
  this.iServerCode = errorBody && errorBody.iServerCode ? errorBody.iServerCode : '';
};
InternalServerError.prototype = new Error();
