import { errorService } from '../../error/error-handler';
import { EnvironmentNotFoundError } from '../../error/environment-not-found-error';
import { UnauthorizedError } from '../../error/unauthorized-error';
import { BadRequestError } from '../../error/bad-request-error';
import { InternalServerError } from '../../error/internal-server-error';
import { notificationService } from '../../notification/notification-service';
import { RunOutsideOfficeError } from '../../error/run-outside-office-error';
import { OverlappingTablesError } from '../../error/overlapping-tables-error';
import { GenericOfficeError } from '../../error/generic-office-error';
import { OutsideOfRangeError } from '../../error/outside-of-range-error';
import { ConnectionBrokenError } from '../../error/connection-error';
import { PromptedReportError } from '../../error/prompted-report-error';
import { sessionHelper } from '../../storage/session-helper';
import {
  NOT_PUBLISHED_CUBE,
  NOT_SUPPORTED_SERVER_ERR,
  NOT_SUPPORTED_CUSTOM_GROUP,
  NOT_IN_METADATA,
  PROJECT_ROW_LIMIT,
  NOT_SUPPORTED_PROMPTS_REFRESH,
  TABLE_OVERLAP,
} from '../../error/constants';

jest.mock('../../storage/session-helper');
jest.useFakeTimers();

describe('ErrorService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('errorRestFactory', () => {
    it('should return the same error if not handled', () => {
      // given
      const error = { response: {} };
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
    it('should not throw an PromptedReportError', () => {
      // given
      const error = { status: 200 };
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).not.toBe(PromptedReportError);
    });
    it('should throw a not found error due to response with 404 code', () => {
      // given
      const response = { body: { iServerCode: '-2147171501' } };
      const error = { status: 404, response };
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(EnvironmentNotFoundError);
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
      const response = { status: 401 };
      const error = { response };
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(UnauthorizedError);
    });
    it('should throw a UnauthorizedError due to response 404 code', () => {
      // given
      const response = { status: 404 };
      const error = { response };
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(EnvironmentNotFoundError);
    });
    it('should throw a UnauthorizedError due to error with 404', () => {
      // given
      const error = { status: 404 };
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(EnvironmentNotFoundError);
    });
    it('should throw a InternalServerError due to response 500 code', () => {
      // given
      const response = { status: 500, body: { iServerCode: '-2147171501' } };
      const error = { response };
      // when
      const resultError = errorService.errorRestFactory(error);
      // then
      expect(resultError).toBeInstanceOf(InternalServerError);
    });
    it('should throw a InternalServerError due to status 500 code', () => {
      // given
      const response = { status: 500 };
      const error = { response };
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
      expect(spyMethod).toBeCalledWith('warning', 'The endpoint cannot be reached', undefined);
      expect(spyLogOut).not.toBeCalled();
    });
    it('should display notification and logout on UnauthorizedError', () => {
      // given
      const errorObject = {
        status: 401,
        response: {
          body: {
            code: '',
          },
        },
      };
      const error = new UnauthorizedError(errorObject);
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
      expect(spyMethod).toBeCalledWith('warning', 'Environment is unreachable. Please check your internet connection.', undefined);
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
      expect(spyMethod).toBeCalledWith('warning', 'There has been a problem with your request', undefined);
    });
    it('should display notification on ConnectionBrokenError', () => {
      // given
      const error = new ConnectionBrokenError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error, true);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', 'Environment is unreachable. Please check your internet connection.', undefined);
    });
    it('should display notification on BadRequestError', () => {
      // given
      const error = new BadRequestError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error, true);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', 'There has been a problem with your request', undefined);
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
      const error = new InternalServerError({ response: { body: { iServerCode: '-2147171501' } } });
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_SUPPORTED_SERVER_ERR, undefined);
    });
    it('should display notification on InternalServerError on report with Custom Groups', () => {
      // given
      const error = new InternalServerError({ response: { body: { iServerCode: '-2147171502' } } });
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_SUPPORTED_CUSTOM_GROUP, undefined);
    });
    it('should display notification on exceeding row limits', () => {
      // given
      const error = new InternalServerError({ response: { body: { iServerCode: '-2147205488' } } });
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', PROJECT_ROW_LIMIT, undefined);
    });
    it('should display notification on not published cubes', () => {
      // given
      const error = new InternalServerError({ response: { body: { iServerCode: '-2147072488' } } });
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_PUBLISHED_CUBE, undefined);
    });
    it('should display notification on object not present in metadata', () => {
      // given
      const error = new InternalServerError({ response: { body: { iServerCode: '-2147216373' } } });
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_IN_METADATA, undefined);
    });
    it('should logout on UnauthorizedError', () => {
      // given
      const errorObject = {
        status: 401,
        response: {
          body: {
            code: '',
          },
        },
      };
      const error = new UnauthorizedError(errorObject);
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
      errorService.handleError(error, true);
      // then
      expect(spyMethod).toBeCalled();
    });
    it('should display notification on PromptedReportError', () => {
      // given
      const error = new PromptedReportError();
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('warning', NOT_SUPPORTED_PROMPTS_REFRESH, undefined);
    });
    it('should handle OverlappingTablesError', () => {
      // given
      const error = new OverlappingTablesError();
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', TABLE_OVERLAP, undefined);
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
        message: 'A table can\'t overlap another table. ',
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
  });
  describe('errorOfficeHandler', () => {
    it('should handle RunOutsideOfficeError', () => {
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
      expect(notificationSpy).toBeCalledWith('warning', 'Please run plugin inside Office', undefined);
    });
    it('should handle OverlappingTablesError', () => {
      // given
      const error = {
        name: 'RichApi.Error',
        message: `A table can't overlap another table. `,
      };
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', TABLE_OVERLAP, undefined);
    });
    it('should handle GenericOfficeError', () => {
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
      expect(notificationSpy).toBeCalledWith('warning', `Excel returned error: ${error.message}`, undefined);
    });
    it('should handle OutsideOfRangeError', () => {
      // given
      const error = new OutsideOfRangeError();
      const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(notificationSpy).toBeCalled();
      expect(notificationSpy).toBeCalledWith('warning', `The table you try to import exceeds the worksheet limits.`, undefined);
    });
  });
  describe('handlePreAuthError', () => {
    it('should handle Unauthorized for login', () => {
      // given
      const errorObject = {
        status: 401,
        response: {
          body: {
            code: 'ERR003',
          },
        },
      };
      const error = new UnauthorizedError(errorObject);
      const spyMethod = jest.spyOn(notificationService, 'displayNotification');
      // when
      errorService.handleError(error);
      // then
      expect(spyMethod).toBeCalled();
      expect(spyMethod).toBeCalledWith('info', 'Wrong username or password.');
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
