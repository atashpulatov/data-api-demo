import {
  handleBadRequestError,
  handleEnvNotFoundError,
  handleUnauthorizedError,
  ENDPOINT_NOT_REACHED,
  MISSING_ELEMENT_OBJECT_MESSAGE,
  NOT_IN_METADATA,
  PROBLEM_WITH_REQUEST,
  SESSION_EXPIRED,
  WRONG_CREDENTIALS
} from '../../error/constants';

describe('Constants', () => {
  describe('handleBadRequestError', () => {
    it('should return MISSING_ELEMENT_OBJECT_MESSAGE ', () => {
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
      expect(result).toBe(MISSING_ELEMENT_OBJECT_MESSAGE);
    });
    it('should return PROBLEM_WITH_REQUEST ', () => {
      // given
      const response = { status: 400 };
      const error = { response };
      // when
      const result = handleBadRequestError(error);
      // then
      expect(result).toBe(PROBLEM_WITH_REQUEST);
    });
  });
  describe('handleUnauthorizedError', () => {
    it('should return WRONG_CREDENTIALS due to error code "ERR003" and iServerCode "-2147216959"', () => {
      // given
      const response = { status: 400, body: { code: 'ERR003', iServerCode: -2147216959 } };
      const error = { response };
      // when
      const result = handleUnauthorizedError(error);
      // then
      expect(result).toBe(WRONG_CREDENTIALS);
    });
    it('should return SESSION_EXPIRED ', () => {
      // given
      const response = { status: 400 };
      const error = { response };
      // when
      const result = handleUnauthorizedError(error);
      // then
      expect(result).toBe(SESSION_EXPIRED);
    });
  });
  describe('handleEnvNotFoundError', () => {
    it('should return NOT_IN_METADATA due to iServerCode "-2147216373"', () => {
      // given
      const response = { status: 400, body: { iServerCode: -2147216373 } };
      const error = { response };
      // when
      const result = handleEnvNotFoundError(error);
      // then
      expect(result).toBe(NOT_IN_METADATA);
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
    it('should return ENDPOINT_NOT_REACHED ', () => {
      // given
      const response = { status: 400 };
      const error = { response };
      // when
      const result = handleEnvNotFoundError(error);
      // then
      expect(result).toBe(ENDPOINT_NOT_REACHED);
    });
  });
});
