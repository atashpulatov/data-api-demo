import { errorTypes } from "./constants";

export function OutsideOfRangeError(message) {
  this.message = message;
  this.type = errorTypes.OUTSIDE_OF_RANGE_ERR;
}
OutsideOfRangeError.prototype = new Error();
