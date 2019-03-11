export function InternalServerError(errorBody) {
  this.iServerCode = errorBody && errorBody.iServerCode ? errorBody.iServerCode : '-2147171501';
};
InternalServerError.prototype = new Error();
