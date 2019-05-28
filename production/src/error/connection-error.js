export function ConnectionBrokenError(error = {}) {
  this.status = error.status;
  this.response = error.response;
  this.message = error.message;
};
ConnectionBrokenError.prototype = new Error();
