export function OutsideOfRangeError(message) {
  this.message = message;
};
OutsideOfRangeError.prototype = new Error();
