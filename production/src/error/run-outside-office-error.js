import { errorTypes } from "./constants";

export function RunOutsideOfficeError() {
  this.type = errorTypes.RUN_OUTSIDE_OFFICE_ERR;
}
RunOutsideOfficeError.prototype = new Error();
