export function EnvironmentNotFoundError(error) {
  this.status = error.status || null;
  this.response = error.response || null;
  this.message = error.message || null;
};
EnvironmentNotFoundError.prototype = new Error();
