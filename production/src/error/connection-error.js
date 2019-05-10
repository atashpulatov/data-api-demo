export function ConnectionBrokenError(error) {
  this.status = error.status || null;
  this.response = error.response || null;
  this.message = error.message || null;
};
ConnectionBrokenError.prototype = new Error();
