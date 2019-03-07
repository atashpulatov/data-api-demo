export class InternalServerError extends Error {
  constructor(errorBody, ...params) {
    super(...params);
    this.iServerCode = errorBody.iServerCode;
  }
};
