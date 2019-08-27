export function InternalServerError(error = { response: {} }) {
  this.status = error.status;
  this.response = error.response;
  this.message = error.message;
}
InternalServerError.prototype = new Error();
