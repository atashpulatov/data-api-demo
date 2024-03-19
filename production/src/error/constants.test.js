import {
  ErrorMessages,
  globalNotificationWarningAndErrorStrings,
  handleBadRequestError,
  handleEnvNotFoundError,
  handleUnauthorizedError,
  handleWrongRange,
} from './constants';

describe('Constants', () => {
  describe('handleWrongRange', () => {
    it('should return ErrorMessages.UNKNOWN_ERROR ', () => {
      // given
      const error = {};
      // when
      const result = handleWrongRange(error);
      // then
      expect(result).toBe(ErrorMessages.UNKNOWN_ERROR);
    });
    it('should return ErrorMessages.SHEET_HIDDEN ', () => {
      // given
      const error = {
        debugInfo: { errorLocation: 'Range.select' },
      };
      // when
      const result = handleWrongRange(error);
      // then
      expect(result).toBe(ErrorMessages.SHEET_HIDDEN);
    });
    it('should return ErrorMessages.WRONG_RANGE ', () => {
      // given
      const error = {
        debugInfo: { errorLocation: 'Workbook.getSelectedRange' },
      };
      // when
      const result = handleWrongRange(error);
      // then
      expect(result).toBe(ErrorMessages.WRONG_RANGE);
    });
  });
  describe('handleBadRequestError', () => {
    it('should return ErrorMessages.MISSING_ELEMENT_OBJECT_MESSAGE ', () => {
      // given
      const response = {
        status: 400,
        body: {
          code: 'ERR006',
          message:
            'Failed to find the metric 36A871D6408731EA1A8B4BA8906D8EAC in the report or cube.',
        },
      };
      const error = { response };
      // when
      const result = handleBadRequestError(error);
      // then
      expect(result).toBe(ErrorMessages.MISSING_ELEMENT_OBJECT_MESSAGE);
    });
    it('should return ErrorMessages.PROBLEM_WITH_REQUEST ', () => {
      // given
      const response = { status: 400 };
      const error = { response };
      // when
      const result = handleBadRequestError(error);
      // then
      expect(result).toBe(ErrorMessages.PROBLEM_WITH_REQUEST);
    });
  });
  describe('handleUnauthorizedError', () => {
    it('should return ErrorMessages.WRONG_CREDENTIALS due to error code "ERR003" and iServerCode "-2147216959"', () => {
      // given
      const response = {
        status: 400,
        body: { code: 'ERR003', iServerCode: -2147216959 },
      };
      const error = { response };
      // when
      const result = handleUnauthorizedError(error);
      // then
      expect(result).toBe(ErrorMessages.WRONG_CREDENTIALS);
    });
    it('should return ErrorMessages.SESSION_EXPIRED ', () => {
      // given
      const response = { status: 400 };
      const error = { response };
      // when
      const result = handleUnauthorizedError(error);
      // then
      expect(result).toBe(ErrorMessages.SESSION_EXPIRED);
    });
  });
  describe('handleEnvNotFoundError', () => {
    it('should return ErrorMessages.NOT_IN_METADATA due to iServerCode "-2147216373"', () => {
      // given
      const response = { status: 400, body: { iServerCode: -2147216373 } };
      const error = { response };
      // when
      const result = handleEnvNotFoundError(error);
      // then
      expect(result).toBe(ErrorMessages.NOT_IN_METADATA);
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
    it('should return ErrorMessages.ENDPOINT_NOT_REACHED ', () => {
      // given
      const response = { status: 400 };
      const error = { response };
      // when
      const result = handleEnvNotFoundError(error);
      // then
      expect(result).toBe(ErrorMessages.ENDPOINT_NOT_REACHED);
    });
  });
  describe('globalNotificationWarningAndErrorStrings', () => {
    it('should contain three specific error and warning messages', () => {
      const expectedNotificationWarningsAndErrors = [
        'connection_error',
        'mstr_session_expired',
        'global_warning',
      ];
      // since the arrays should contain only strings, we can sort them beforehand to compare them
      expect(globalNotificationWarningAndErrorStrings.sort()).toEqual(
        expectedNotificationWarningsAndErrors.sort()
      );
    });
  });
});
