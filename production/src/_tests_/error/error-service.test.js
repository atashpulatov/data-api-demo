import { errorService } from '../../error/error-handler';
import { notificationService } from '../../notification/notification-service';
import { OutsideOfRangeError } from '../../error/outside-of-range-error';
import { sessionHelper } from '../../storage/session-helper';
import {
  NOT_PUBLISHED_CUBE,
  NOT_SUPPORTED_SERVER_ERR,
  NOT_SUPPORTED_CUSTOM_GROUP,
  NOT_IN_METADATA,
  PROJECT_ROW_LIMIT,
  TABLE_OVERLAP,
  errorTypes,
} from '../../error/constants';

jest.mock('../../storage/session-helper');
jest.useFakeTimers();

describe('ErrorService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRestErrorType', () => {
    it('should return null if not handled', () => {
      // given
      const error = { response: {} };
      // when
      const result = errorService.getRestErrorType(error);
      // then
      expect(result).toBe(null);
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
      const error = {
        message: 'Possible causes: the network is offline,',
      };
      // when
      const resultType = errorService.getRestErrorType(error);
      // then
      expect(resultType).toBe(errorTypes.CONNECTION_BROKEN_ERR);
    });
    it('should return BAD_REQUEST_ERR type due to response 400 code', () => {
      // given
      const error = {
        response: {
          status: 400,
        },
      };
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
  });
  describe('handleError for rest error', () => {
    it('should display notification on ENV_NOT_FOUND_ERR', () => {
      // given
      const response = { body: { iServerCode: '-2147171501' } };
      const error = { status: 404, response };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
      // when
      errorService.handleError(error, false);
      jest.advanceTimersByTime(2000);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', 'The endpoint cannot be reached', '');
      expect(spyLogOut).not.toBeCalled();
    });
    it('should display notification and logout on UNAUTHORIZED_ERR', () => {
      // given
      const error = {
        status: 401,
        response: {
          body: {
            code: '',
          },
        },
      };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
      // when
      errorService.handleError(error, false);
      jest.advanceTimersByTime(2000);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('info', 'Your session has expired. Please log in.');
      expect(spyLogOut).toBeCalled();
    });
    it('should display notification and logout on UNAUTHORIZED_ERR with ERR003 code', () => {
      // given
      const error = {
        status: 401,
        response: {
          body: {
            code: 'ERR003',
          },
        },
      };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('info', 'Wrong username or password.');
    });
    it('should display notification and logout on CONNECTION_BROKEN_ERR', () => {
      // given
      const error = {
        message: 'Possible causes: the network is offline,',
      };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
      // when
      errorService.handleError(error, false);
      jest.advanceTimersByTime(2000);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', 'Environment is unreachable. Please check your internet connection.', '');
      expect(spyLogOut).toBeCalled();
    });
    it('should display notification and logout on BAD_REQUEST_ERR', () => {
      // given
      const error = {
        response: {
          status: 400,
        },
      };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', 'There has been a problem with your request', '');
    });
    it('should display notification on CONNECTION_BROKEN_ERR and NOR logout if flag is true', () => {
      // given
      const error = {
        message: 'Possible causes: the network is offline,',
      };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
      // when
      errorService.handleError(error, true);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', 'Environment is unreachable. Please check your internet connection.', '');
      expect(spyLogOut).not.toBeCalled();
    });
    it('should display notification on BadRequestError', () => {
      // given
      const error = {
        response: {
          status: 400,
        },
      };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error, true);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', 'There has been a problem with your request', '');
    });
    it('should display notification on OutsideOfRangeError ', () => {
      // given
      const error = new OutsideOfRangeError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });
    it('should display notification on InternalServerError with no error body', () => {
      // given
      const error = { status: 500 };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });
    it('should display notification on InternalServerError', () => {
      // given
      const response = { status: 500, body: { iServerCode: '-2147171501' } };
      const error = { response };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_SUPPORTED_SERVER_ERR, '');
    });
    it('should display notification on InternalServerError on report with Custom Groups', () => {
      // given
      const response = { status: 500, body: { iServerCode: '-2147171502' } };
      const error = { response };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_SUPPORTED_CUSTOM_GROUP, '');
    });
    it('should display notification on exceeding row limits', () => {
      // given
      const response = { status: 500, body: { iServerCode: '-2147205488' } };
      const error = { response };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', PROJECT_ROW_LIMIT, '');
    });
    it('should display notification on not published cubes', () => {
      // given
      const response = { status: 500, body: { iServerCode: '-2147072488' } };
      const error = { response };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_PUBLISHED_CUBE, '');
    });
    it('should display notification on object not present in metadata', () => {
      // given
      const response = { status: 500, body: { iServerCode: '-2147216373' } };
      const error = { response };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_IN_METADATA, '');
    });
    it('should logout on UnauthorizedError', () => {
      // given
      const error = {
        status: 401,
        response: {
          body: {
            code: '',
          },
        },
      };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(setTimeout).toBeCalled();
      expect(setTimeout).toBeCalledWith(expect.any(Function), 2000);
    });
    it('should logout on EnvironmentNotFound', () => {
      // given
      const error = { status: 404 };
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error, true);
      // then
      expect(spyMethod).toBeCalled();
    });
    it('should handle OverlappingTablesError', () => {
      // given
      const error = { name: 'RichApi.Error', message: 'A table can\'t overlap another table. ' };
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', TABLE_OVERLAP, '');
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
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', 'Please run plugin inside Office', '');
    });
    it('should display notification on OVERLAPPING_TABLES_ERR', () => {
      // given
      const error = {
        name: 'RichApi.Error',
        message: 'A table can\'t overlap another table. ',
      };
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', TABLE_OVERLAP, '');
    });
    it('should display notification on GENERIC_OFFICE_ERR', () => {
      // given
      const error = {
        name: 'RichApi.Error',
        message: 'Generic error message',
      };
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', `Excel returned error: ${error.message}`, '');
    });
    it('should display notification on OutsideOfRangeError', () => {
      // given
      const error = new OutsideOfRangeError();
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', 'The table you try to import exceeds the worksheet limits.', '');
    });
  });
  describe('logout', () => {
    it('should call fullLogout', () => {
      // given
      const fullLogOutSpy = jest.spyOn(errorService, 'fullLogOut');
      const logOutRestSpy = jest.spyOn(sessionHelper, 'logOutRest');
      const logOutSpy = jest.spyOn(sessionHelper, 'logOut');
      const logOutRedirectSpy = jest.spyOn(sessionHelper, 'logOutRedirect');
      // when
      errorService.fullLogOut();
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
