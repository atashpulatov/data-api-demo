export class InternalServerError extends Error {
  constructor(errorBody, ...params) {
    super(...params);
    this.iServerCode = errorBody && errorBody.iServerCode ? errorBody.iServerCode : '-2147171501';
  }
};
