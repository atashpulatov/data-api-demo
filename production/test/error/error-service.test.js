import {errorService} from '../../src/error/error-handler';
import {EnvironmentNotFoundError} from '../../src/error/environment-not-found-error';
import {UnauthorizedError} from '../../src/error/unauthorized-error';
import {BadRequestError} from '../../src/error/bad-request-error';
import {InternalServerError} from '../../src/error/internal-server-error';
import {notificationService} from '../../src/notification/notification-service';
import {RunOutsideOfficeError} from '../../src/error/run-outside-office-error';
import {OverlappingTablesError} from '../../src/error/overlapping-tables-error';
import {GenericOfficeError} from '../../src/error/generic-office-error';
import {OutsideOfRangeError} from '../../src/error/outside-of-range-error';
import {ConnectionBrokenError} from '../../src/error/connection-error';
import {PromptedReportError} from '../../src/error/prompted-report-error';
import {sessionHelper} from '../../src/storage/session-helper';
import {
  NOT_PUBLISHED_CUBE,
  NOT_SUPPORTED_SERVER_ERR,
  NOT_SUPPORTED_CUSTOM_GROUP,
  NOT_IN_METADATA,
  PROJECT_ROW_LIMIT,
  NOT_SUPPORTED_PROMPTS_REFRESH,
  TABLE_OVERLAP,
} from '../../src/error/constants';

jest.mock('../../src/storage/session-helper');
jest.useFakeTimers();

describe('ErrorService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('errorRestFactory', () => {
    it('should return the same error if not handled', () => {
      // given
      const error = {response: {}};
      // when
      const result = errorService.errorRestFactory(error);
      // then
      expect(result).toBe(error);
    });
    it('should return the same error if already recognized', () => {
      // given
      const error = new RunOutsideOfficeError();
      // when
      const result = errorService.errorRestFactory(error);
      // then
      expect(result).toBe(error);
    });
    it('should throw an PromptedReportError', () => {
      // given
      const error = {status: 200};
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(PromptedReportError);
    });
    it('should throw an InternalServerError due to response 404 code', () => {
      // given
      const response = {body: {iServerCode: '-2147171501'}};
      const error = {status: 404, response: response};
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(InternalServerError);
    });

    it('should throw an ConnectionBrokenError due to response 404 code', () => {
      // given
      const error = {
        message: 'Possible causes: the network is offline,',
      };
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(ConnectionBrokenError);
    });
    it('should throw a BadRequestError due to response 400 code', () => {
      // given
      const error = {
        response: {
          status: 400,
        },
      };
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(BadRequestError);
    });
    it('should throw a UnauthorizedError due to response 401 code', () => {
      // given
      const response = {status: 401};
      const error = {response};
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(UnauthorizedError);
    });
    it('should throw a UnauthorizedError due to response 404 code', () => {
      // given
      const response = {status: 404};
      const error = {response};
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(EnvironmentNotFoundError);
    });
    it('should throw a UnauthorizedError due to error with 404', () => {
      // given
      const error = {status: 404};
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(EnvironmentNotFoundError);
    });
    it('should throw a InternalServerError due to response 500 code', () => {
      // given
      const response = {status: 500, body: {iServerCode: '-2147171501'}};
      const error = {response};
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(InternalServerError);
    });
    it('should throw a InternalServerError due to status 500 code', () => {
      // given
      const response = {status: 500};
      const error = {response};
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(InternalServerError);
    });
  });
  describe('handleRestError', () => {
    it('should display notification on EnvironmentNotFoundError', () => {
      // given
      const error = new EnvironmentNotFoundError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
      // when
      errorService.handleError(error, false);
      jest.advanceTimersByTime(2000);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', '404 - Environment not found');
      expect(spyLogOut).toBeCalled();
    });
    it('should display notification and logout on UnauthorizedError', () => {
      // given
      const error = new UnauthorizedError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
      // when
      errorService.handleError(error, false);
      jest.advanceTimersByTime(2000);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('info', 'Your session has expired.\nPlease log in.');
      expect(spyLogOut).toBeCalled();
    });
    it('should display notification and logout on ConnectionBrokenError', () => {
      // given
      const error = new ConnectionBrokenError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
      // when
      errorService.handleError(error, false);
      jest.advanceTimersByTime(2000);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', 'Environment is unreachable.' + '\nPlease check your internet connection.');
      expect(spyLogOut).toBeCalled();
    });
    it('should display notification and logout on BadRequestError', () => {
      // given
      const error = new BadRequestError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', '400 - There has been a problem with your request');
    });
    it('should display notification on UnauthorizedError', () => {
      // given
      const error = new UnauthorizedError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error, true);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('info', 'Your session has expired.\nPlease log in.');
    });
    it('should display notification on ConnectionBrokenError', () => {
      // given
      const error = new ConnectionBrokenError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error, true);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', 'Environment is unreachable.' + '\nPlease check your internet connection.');
    });
    it('should display notification on BadRequestError', () => {
      // given
      const error = new BadRequestError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error, true);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', '400 - There has been a problem with your request');
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
      const error = new InternalServerError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
    });
    it('should display notification on InternalServerError', () => {
      // given
      const error = new InternalServerError({iServerCode: '-2147171501'});
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_SUPPORTED_SERVER_ERR);
    });
    it('should display notification on InternalServerError on report with Custom Groups', () => {
      // given
      const error = new InternalServerError({iServerCode: '-2147171502'});
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_SUPPORTED_CUSTOM_GROUP);
    });
    it('should display notification on exceeding row limits', () => {
      // given
      const error = new InternalServerError({iServerCode: '-2147205488'});
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', PROJECT_ROW_LIMIT);
    });
    it('should display notification on not published cubes', () => {
      // given
      const error = new InternalServerError({iServerCode: '-2147072488'});
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_PUBLISHED_CUBE);
    });
    it('should display notification on object not present in metadata', () => {
      // given
      const error = new InternalServerError({iServerCode: '-2147216373'});
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_IN_METADATA);
    });
    it('should logout on UnauthorizedError', () => {
      // given
      const error = new UnauthorizedError();
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
      const error = new EnvironmentNotFoundError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(setTimeout).toBeCalled();
      expect(setTimeout).toBeCalledWith(expect.any(Function), 2000);
    });
    it('should display notification on PromptedReportError', () => {
      // given
      const error = new PromptedReportError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_SUPPORTED_PROMPTS_REFRESH);
    });
    it('should handle OverlappingTablesError', () => {
      // given
      const error = new OverlappingTablesError();
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', TABLE_OVERLAP);
    });
  });
  describe('errorOfficeFactory', () => {
    it('should throw RunOutsideOfficeError', () => {
      // given
      const error = {
        name: 'RichApi.Error',
        message: 'Excel is not defined',
      };
      // when
      const returnedError = errorService.errorOfficeFactory(error);
      // then
      expect(returnedError).toBeInstanceOf(RunOutsideOfficeError);
    });
    it('should throw OverlappingTablesError', () => {
      // given
      const error = {
        name: 'RichApi.Error',
        message: `A table can't overlap another table. `,
      };
      // when
      const returnedError = errorService.errorOfficeFactory(error);
      // then
      expect(returnedError).toBeInstanceOf(OverlappingTablesError);
    });
    it('should display message when we do not handle error', () => {
      // given
      const exampleMessage = 'This is some test message';
      const error = {
        name: 'RichApi.Error',
        message: exampleMessage,
      };
      // when
      const returnedError = errorService.errorOfficeFactory(error);
      // then
      expect(returnedError).toBeInstanceOf(GenericOfficeError);
    });
    it('should throw same error if it is not expected error', () => {
      // given
      const error = {};
      // when
      const returnedError = errorService.errorOfficeFactory(error);
      // then
      expect(returnedError).toBe(error);
    });
  });
  describe('errorOfficeHandler', () => {
    it('should handle RunOutsideOfficeError', () => {
      // given
      const error = new RunOutsideOfficeError();
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleOfficeError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', 'Please run plugin inside Office');
    });
    it('should handle OverlappingTablesError', () => {
      // given
      const errorMessage = `A table can't overlap another table.`;
      const error = new OverlappingTablesError(errorMessage);
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleOfficeError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', TABLE_OVERLAP);
    });
    it('should handle GenericOfficeError', () => {
      // given
      const errorMessage = `A table can't overlap another table. `;
      const error = new GenericOfficeError(errorMessage);
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleOfficeError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', `Excel returned error: ${errorMessage}`);
    });
    it('should handle OutsideOfRangeError', () => {
      // given
      const error = new OutsideOfRangeError();
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleOfficeError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', `The table you try to import exceeds the worksheet limits.`);
    });
    it('should forward error that it does not handle to next method', () => {
      // given
      const error = {constructor: () => {}};
      const originalMethod = errorService.handleError;
      errorService.handleError = jest.fn();
      // when
      errorService.handleOfficeError(error);
      // then
      expect(errorService.handleError).toBeCalled();
      errorService.handleError = originalMethod;
    });
  });
  describe('handlePreAuthError', () => {
    it('should handle Unauthorized for login', () => {
      // given
      const error = new UnauthorizedError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handlePreAuthError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('error', 'Wrong username or password.');
    });
    it('should forward error that it does not handle to next method', () => {
      // given
      const error = {constructor: () => {}};
      const originalMethod = errorService.handleError;
      errorService.handleError = jest.fn();
      // when
      errorService.handlePreAuthError(error);
      // then
      expect(errorService.handleError).toBeCalled();
      errorService.handleError = originalMethod;
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
      const error = {message: 'error'};
      const fullLogOutSpy = jest.spyOn(errorService, 'handleError');
      // when
      errorService.handleLogoutError(error);
      // then
      expect(fullLogOutSpy).toBeCalled();
    });
  });
});
