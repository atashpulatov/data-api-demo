import { ErrorType } from './constants';

export class OutsideOfRangeError extends Error {
  type: ErrorType;

  constructor(message?: string) {
    super(message);
    this.type = ErrorType.OUTSIDE_OF_RANGE_ERR;
  }
}
