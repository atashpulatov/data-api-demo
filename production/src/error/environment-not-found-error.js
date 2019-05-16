export function EnvironmentNotFoundError(error = {}) {
  this.status = error.status;
  this.response = error.response;
  this.message = error.message;
};
EnvironmentNotFoundError.prototype = new Error();
