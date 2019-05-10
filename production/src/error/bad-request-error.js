export function BadRequestError(error) {
  this.status = error.status || null;
  this.response = error.response || null;
  this.message = error.message || null;
};
BadRequestError.prototype = new Error();

