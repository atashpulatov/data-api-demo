export function UnauthorizedError(error) {
  this.status = error.status || null;
  this.response = error.response || null;
  this.message = error.message || null;
}
UnauthorizedError.prototype = new Error();
