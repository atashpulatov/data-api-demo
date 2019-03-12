export function GenericOfficeError(message) {
  this.message = message;
};
GenericOfficeError.prototype = new Error();

