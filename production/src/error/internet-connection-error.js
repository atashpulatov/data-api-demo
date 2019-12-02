import { errorTypes, CONNECTION_LOST } from './constants';

export function InternetConnectionError(message = CONNECTION_LOST) {
  this.message = message;
  this.type = errorTypes.CONNECTION_LOST_ERR;
}
InternetConnectionError.prototype = new Error();
