/* eslint-disable jest/no-disabled-tests */
import { errorService } from '../../error/error-handler';
import { notificationService } from '../../notification-v2/notification-service';
import { OutsideOfRangeError } from '../../error/outside-of-range-error';
import { sessionHelper } from '../../storage/session-helper';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { errorTypes } from '../../error/constants';
import { sessionActions } from '../../redux-reducer/session-reducer/session-actions';

jest.mock('../../storage/session-helper');
jest.useFakeTimers();

// TODO fix after adding object notifications
describe('ErrorService', () => {
  beforeAll(() => {
    errorService.init(sessionActions, sessionHelper, notificationService);
    errorService.displayErrorNotification = jest.fn();
    console.warn = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRestErrorType', () => {
    it('should return UNKNOWN_ERR if not handled', () => {
      // given
      const error = { response: {} };
      // when
      const result = errorService.getRestErrorType(error);
      // then
      expect(result).toBe(errorTypes.UNKNOWN_ERR);
    });

    it('should return ENV_NOT_FOUND_ERR type due to response with 404 code', () => {
      // given
      const response = { body: { iServerCode: '-2147171501' } };
      const error = { status: 404, response };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.ENV_NOT_FOUND_ERR);
    });

    it('should return CONNECTION_BROKEN_ERR type due to response 404 code', () => {
      // given
      const error = { message: 'Possible causes: the network is offline,', };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.CONNECTION_BROKEN_ERR);
    });

    it('should return BAD_REQUEST_ERR type due to response 400 code', () => {
      // given
      const error = { response: { status: 400, }, };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.BAD_REQUEST_ERR);
    });

    it('should return UNAUTHORIZED_ERR type due to response 401 code', () => {
      // given
      const response = { status: 401 };
      const error = { response };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.UNAUTHORIZED_ERR);
    });

    it('should return INTERNAL_SERVER_ERR type due to response 403 code', () => {
      // given
      const response = { status: 403 };
      const error = { response };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.INTERNAL_SERVER_ERR);
    });

    it('should return ENV_NOT_FOUND_ERR type due to response 404 code', () => {
      // given
      const response = { status: 404 };
      const error = { response };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.ENV_NOT_FOUND_ERR);
    });

    it('should return INTERNAL_SERVER_ERR type due to response 500 code', () => {
      // given
      const response = { status: 500, body: { iServerCode: '-2147171501' } };
      const error = { response };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.INTERNAL_SERVER_ERR);
    });

    it('should return INTERNAL_SERVER_ERR type due to status 500 code', () => {
      // given
      const response = { status: 500 };
      const error = { response };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.INTERNAL_SERVER_ERR);
    });

    it('should return INTERNAL_SERVER_ERR type due to status 501 code', () => {
      // given
      const response = { status: 501 };
      const error = { response };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.INTERNAL_SERVER_ERR);
    });

    it('should return CONNECTION_BROKEN_ERR type due to status 502 code', () => {
      // given
      const response = { status: 502 };
      const error = { response };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.CONNECTION_BROKEN_ERR);
    });

    it('should return CONNECTION_BROKEN_ERR type due to status 503 code', () => {
      // given
      const response = { status: 503 };
      const error = { response };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.CONNECTION_BROKEN_ERR);
    });

    it('should return CONNECTION_BROKEN_ERR type due to status 504 code', () => {
      // given
      const response = { status: 504 };
      const error = { response };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.CONNECTION_BROKEN_ERR);
    });

    it('should return UNKNOWN_ERR type due to unhandled status code', () => {
      // given
      const response = { status: 510 };
      const error = { response };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.UNKNOWN_ERR);
    });
  });
  describe('handleError for rest error', () => {
    it('should display notification on ENV_NOT_FOUND_ERR', () => {
      // given
      const response = { body: { iServerCode: '-2147171501' } };
      const error = { status: 404, response };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyLogOut).not.toBeCalled();
    });

    it('should display notification and logout on UNAUTHORIZED_ERR', () => {
      // given
      const error = {
        status: 401,
        response: { body: { code: '', }, },
      };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
      // when
      errorService.handleError(error);
      jest.runOnlyPendingTimers();
      // then
      expect(spyMethod).toBeCalled();
      expect(spyLogOut).toBeCalled();
    });

    it('should display notification and logout on UNAUTHORIZED_ERR with ERR003 code', () => {
      // given
      const error = {
        status: 401,
        response: { body: { code: 'ERR003' } },
      };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should display  wrong username notification on UNAUTHORIZED_ERR with ERR003 code and iServerCode', () => {
      // given
      const error = {
        status: 401,
        response: {
          body: {
            code: 'ERR003',
            iServerCode: -2147216959,
          },
        },
      };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should display notification and logout on BAD_REQUEST_ERR', () => {
      // given
      const error = { response: { status: 400, }, };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should display notification on CONNECTION_BROKEN_ERR and NOR logout if flag is true', () => {
      // given
      const error = { message: 'Possible causes: the network is offline,', };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyLogOut).not.toBeCalled();
    });

    it('should display notification on BadRequestError', () => {
      // given
      const error = { response: { status: 400, }, };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should display notification on OutsideOfRangeError ', () => {
      // given
      const error = new OutsideOfRangeError();
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should display notification on InternalServerError with no error body', () => {
      // given
      const error = { status: 500 };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should display notification on InternalServerError', () => {
      // given
      const response = { status: 500, body: { iServerCode: '-2147171501' } };
      const error = { response };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should display notification on InternalServerError on report with Custom Groups', () => {
      // given
      const response = { status: 500, body: { iServerCode: '-2147171502' } };
      const error = { response };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should display notification on exceeding row limits', () => {
      // given
      const response = { status: 500, body: { iServerCode: '-2147205488' } };
      const error = { response };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });
    it('should display notification on not published cubes', () => {
      // given
      const response = { status: 500, body: { iServerCode: '-2147072488' } };
      const error = { response };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should display notification on object not present in metadata', () => {
      // given
      const response = { status: 500, body: { iServerCode: '-2147216373' } };
      const error = { response };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should display NO_DATA_RETURNED on server error with -2147213784 iServerCode', () => {
      // given
      const response = { status: 403, body: { iServerCode: '-2147213784' } };
      const error = { response };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should display notification on dossier removed from metadata', () => {
      // given
      const response = { status: 404, body: { iServerCode: -2147216373 } };
      const error = { response, mstrObjectType: mstrObjectEnum.mstrObjectType.dossier.name };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should logout on UnauthorizedError', () => {
      // given
      const error = {
        status: 401,
        response: { body: { code: '', }, },
      };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(setTimeout).toBeCalled();
    });

    it('should logout on EnvironmentNotFound', () => {
      // given
      const error = { status: 404 };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error, true);
      // then
      expect(spyMethod).toBeCalled();
    });

    it('should handle OverlappingTablesError', () => {
      // given
      const error = { name: 'RichApi.Error', message: 'A table can\'t overlap another table. ' };
      const notificationSpy = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
    });

    it('should display INVALID_VIZ_KEY_MESSAGE notification on INVALID_VIZ_KEY error', () => {
      // given
      const error = { response: { status: 404, }, type: errorTypes.INVALID_VIZ_KEY };
      const spyMethod = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });
  });

  describe('getOfficeErrorType', () => {
    it('should return RUN_OUTSIDE_OFFICE_ERR type in a proper case', () => {
      // given
      const error = {
        name: 'RichApi.Error',
        message: 'Excel is not defined',
      };
      // when
      const returnedError = errorService.getOfficeErrorType(error);
      // then
      expect(returnedError).toBe(errorTypes.RUN_OUTSIDE_OFFICE_ERR);
    });
    it('should return OVERLAPPING_TABLES_ERR type in a proper case', () => {
      // given
      const error = {
        name: 'RichApi.Error',
        message: 'A table can\'t overlap another table. ',
      };
      // when
      const returnedError = errorService.getOfficeErrorType(error);
      // then
      expect(returnedError).toBe(errorTypes.OVERLAPPING_TABLES_ERR);
    });

    it('should return TABLE_REMOVED_FROM_EXCEL_ERR type in a proper case', () => {
      // given
      const error = {
        name: 'RichApi.Error',
        message: 'This object binding is no longer valid due to previous updates.',
      };
      // when
      const returnedError = errorService.getOfficeErrorType(error);
      // then
      expect(returnedError).toBe(errorTypes.TABLE_REMOVED_FROM_EXCEL_ERR);
    });

    it('should display message when we do not handle error', () => {
      // given
      const exampleMessage = 'This is some test message';
      const error = {
        name: 'RichApi.Error',
        message: exampleMessage,
      };
      // when
      const returnedError = errorService.getOfficeErrorType(error);
      // then
      expect(returnedError).toBe(errorTypes.GENERIC_OFFICE_ERR);
    });
  });

  describe('handleError for office error', () => {
    it('should display notification on RUN_OUTSIDE_OFFICE_ERR', () => {
      // given
      const error = {
        name: 'RichApi.Error',
        message: 'Excel is not defined',
      };
      const notificationSpy = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
    });

    it('should display notification on OVERLAPPING_TABLES_ERR', () => {
      // given
      const error = {
        name: 'RichApi.Error',
        message: 'A table can\'t overlap another table. ',
      };
      const notificationSpy = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
    });

    it('should display notification on GENERIC_OFFICE_ERR', () => {
      // given
      const error = {
        name: 'RichApi.Error',
        message: 'Generic error message',
      };
      const notificationSpy = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
    });

    it('should display notification on OutsideOfRangeError', () => {
      // given
      const error = new OutsideOfRangeError();
      const notificationSpy = jest.spyOn(errorService, 'displayErrorNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
    });
  });
  describe('logout', () => {
    it('should call fullLogout', async () => {
      // given
      const fullLogOutSpy = jest.spyOn(errorService, 'fullLogOut');
      const logOutRestSpy = jest.spyOn(sessionHelper, 'logOutRest');
      const logOutSpy = jest.spyOn(sessionActions, 'logOut');
      const logOutRedirectSpy = jest.spyOn(sessionHelper, 'logOutRedirect');
      // when
      await errorService.fullLogOut();
      // then
      expect(fullLogOutSpy).toBeCalled();
      expect(logOutRestSpy).toBeCalled();
      expect(logOutSpy).toBeCalled();
      expect(logOutRedirectSpy).toBeCalled();
    });

    it('should handle LogoutError', () => {
      // given
      const error = { message: 'error' };
      const fullLogOutSpy = jest.spyOn(errorService, 'handleError');
      // when
      errorService.handleError(error);
      // then
      expect(fullLogOutSpy).toBeCalled();
    });
  });
});
