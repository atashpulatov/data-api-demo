export function BadRequestError(error = {}) {
  this.status = error.status;
  this.response = error.response;
  this.message = error.message;
}
BadRequestError.prototype = new Error();
