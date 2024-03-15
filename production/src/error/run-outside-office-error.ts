import { ErrorMessages, ErrorType } from './constants';

export class RunOutsideOfficeError extends Error {
  type: ErrorType;

  constructor(message = ErrorMessages.OUTSIDE_OF_OFFICE) {
    super(message);
    this.type = ErrorType.RUN_OUTSIDE_OFFICE_ERR;
  }
}
