import {
  handleBadRequestError,
  handleEnvNotFoundError,
  handleUnauthorizedError,
  errorMessages
} from '../../error/constants';

describe('Constants', () => {
  describe('handleBadRequestError', () => {
    it('should return errorMessages.MISSING_ELEMENT_OBJECT_MESSAGE ', () => {
      // given
      const response = { status: 400,
        body: {
          code: 'ERR006',
          message: 'Failed to find the metric 36A871D6408731EA1A8B4BA8906D8EAC in the report or cube.'
        } };
      const error = { response };
      // when
      const result = handleBadRequestError(error);
      // then
      expect(result).toBe(errorMessages.MISSING_ELEMENT_OBJECT_MESSAGE);
    });
    it('should return errorMessages.PROBLEM_WITH_REQUEST ', () => {
      // given
      const response = { status: 400 };
      const error = { response };
      // when
      const result = handleBadRequestError(error);
      // then
      expect(result).toBe(errorMessages.PROBLEM_WITH_REQUEST);
    });
  });
  describe('handleUnauthorizedError', () => {
    it('should return errorMessages.errorMessages.WRONG_CREDENTIALS due to error code "ERR003" and iServerCode "-2147216959"', () => {
      // given
      const response = { status: 400, body: { code: 'ERR003', iServerCode: -2147216959 } };
      const error = { response };
      // when
      const result = handleUnauthorizedError(error);
      // then
      expect(result).toBe(errorMessages.WRONG_CREDENTIALS);
    });
    it('should return errorMessages.SESSION_EXPIRED ', () => {
      // given
      const response = { status: 400 };
      const error = { response };
      // when
      const result = handleUnauthorizedError(error);
      // then
      expect(result).toBe(errorMessages.SESSION_EXPIRED);
    });
  });
  describe('handleEnvNotFoundError', () => {
    it('should return errorMessages.NOT_IN_METADATA due to iServerCode "-2147216373"', () => {
      // given
      const response = { status: 400, body: { iServerCode: -2147216373 } };
      const error = { response };
      // when
      const result = handleEnvNotFoundError(error);
      // then
      expect(result).toBe(errorMessages.NOT_IN_METADATA);
    });
    it('should return "This [error.mstrObjectType] was deleted"', () => {
      // given
      const response = { status: 400, body: { iServerCode: -2147216373 } };
      const error = { response, mstrObjectType: { name: 'dossier' } };
      // when
      const result = handleEnvNotFoundError(error);
      // then
      expect(result).toBe(`This ${error.mstrObjectType} was deleted.`);
    });
    it('should return errorMessages.ENDPOINT_NOT_REACHED ', () => {
      // given
      const response = { status: 400 };
      const error = { response };
      // when
      const result = handleEnvNotFoundError(error);
      // then
      expect(result).toBe(errorMessages.ENDPOINT_NOT_REACHED);
    });
  });
});
