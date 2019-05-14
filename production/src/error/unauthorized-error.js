export function UnauthorizedError(error = {}) {
  this.status = error.status;
  this.response = error.response;
  this.message = error.message;
}
UnauthorizedError.prototype = new Error();
