export function InternalServerError(error) {
  this.status = error.status;
  this.response = error.response;
  this.message = error.message;
};
InternalServerError.prototype = new Error();
