import { errorService } from '../../error/error-handler';
import { notificationService } from '../../notification-v2/notification-service';
import { OutsideOfRangeError } from '../../error/outside-of-range-error';
import { sessionHelper } from '../../storage/session-helper';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import {
  NOT_PUBLISHED_CUBE,
  NOT_SUPPORTED_SERVER_ERR,
  NOT_SUPPORTED_CUSTOM_GROUP,
  NOT_IN_METADATA,
  PROJECT_ROW_LIMIT,
  TABLE_OVERLAP,
  errorTypes,
  SESSION_EXPIRED,
  WRONG_CREDENTIALS,
  INVALID_VIZ_KEY_MESSAGE,
  NO_DATA_RETURNED,
} from '../../error/constants';

jest.mock('../../storage/session-helper');
jest.useFakeTimers();

// TODO fix after adding object notifications
describe('ErrorService', () => {
  // beforeAll(() => {
  //   errorService.init(sessionHelper, notificationService);
  // });
  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  // describe('getRestErrorType', () => {
  //   it('should return UNKNOWN_ERR if not handled', () => {
  //     // given
  //     const error = { response: {} };
  //     // when
  //     const result = errorService.getRestErrorType(error);
  //     // then
  //     expect(result).toBe(errorTypes.UNKNOWN_ERR);
  //   });
  //   it('should return ENV_NOT_FOUND_ERR type due to response with 404 code', () => {
  //     // given
  //     const response = { body: { iServerCode: '-2147171501' } };
  //     const error = { status: 404, response };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.ENV_NOT_FOUND_ERR);
  //   });

  //   it('should return CONNECTION_BROKEN_ERR type due to response 404 code', () => {
  //     // given
  //     const error = { message: 'Possible causes: the network is offline,', };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.CONNECTION_BROKEN_ERR);
  //   });
  //   it('should return BAD_REQUEST_ERR type due to response 400 code', () => {
  //     // given
  //     const error = { response: { status: 400, }, };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.BAD_REQUEST_ERR);
  //   });
  //   it('should return UNAUTHORIZED_ERR type due to response 401 code', () => {
  //     // given
  //     const response = { status: 401 };
  //     const error = { response };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.UNAUTHORIZED_ERR);
  //   });
  //   it('should return INTERNAL_SERVER_ERR type due to response 403 code', () => {
  //     // given
  //     const response = { status: 403 };
  //     const error = { response };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.INTERNAL_SERVER_ERR);
  //   });
  //   it('should return ENV_NOT_FOUND_ERR type due to response 404 code', () => {
  //     // given
  //     const response = { status: 404 };
  //     const error = { response };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.ENV_NOT_FOUND_ERR);
  //   });
  //   it('should return INTERNAL_SERVER_ERR type due to response 500 code', () => {
  //     // given
  //     const response = { status: 500, body: { iServerCode: '-2147171501' } };
  //     const error = { response };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.INTERNAL_SERVER_ERR);
  //   });
  //   it('should return INTERNAL_SERVER_ERR type due to status 500 code', () => {
  //     // given
  //     const response = { status: 500 };
  //     const error = { response };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.INTERNAL_SERVER_ERR);
  //   });
  //   it('should return INTERNAL_SERVER_ERR type due to status 501 code', () => {
  //     // given
  //     const response = { status: 501 };
  //     const error = { response };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.INTERNAL_SERVER_ERR);
  //   });
  //   it('should return CONNECTION_BROKEN_ERR type due to status 502 code', () => {
  //     // given
  //     const response = { status: 502 };
  //     const error = { response };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.CONNECTION_BROKEN_ERR);
  //   });
  //   it('should return CONNECTION_BROKEN_ERR type due to status 503 code', () => {
  //     // given
  //     const response = { status: 503 };
  //     const error = { response };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.CONNECTION_BROKEN_ERR);
  //   });
  //   it('should return CONNECTION_BROKEN_ERR type due to status 504 code', () => {
  //     // given
  //     const response = { status: 504 };
  //     const error = { response };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.CONNECTION_BROKEN_ERR);
  //   });
  //   it('should return UNKNOWN_ERR type due to unhandled status code', () => {
  //     // given
  //     const response = { status: 510 };
  //     const error = { response };
  //     // when
  //     const resultType = errorService.getRestErrorType(error);
  //     // then
  //     expect(resultType).toBe(errorTypes.UNKNOWN_ERR);
  //   });
  // });
  // describe('handleError for rest error', () => {
  //   it('should display notification on ENV_NOT_FOUND_ERR', () => {
  //     // given
  //     const response = { body: { iServerCode: '-2147171501' } };
  //     const error = { status: 404, response };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
  //     // when
  //     errorService.handleError(error, false);
  //     jest.advanceTimersByTime(2000);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       content: 'The endpoint cannot be reached', details: '', onConfirm: null, type: 'warning',
  //     });
  //     expect(spyLogOut).not.toBeCalled();
  //   });
  //   it('should display notification and logout on UNAUTHORIZED_ERR', () => {
  //     // given
  //     const error = {
  //       status: 401,
  //       response: { body: { code: '', }, },
  //     };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
  //     // when
  //     errorService.handleError(error, false);
  //     jest.advanceTimersByTime(2000);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({ content: 'Your session has expired. Please log in.', type: 'info' });
  //     expect(spyLogOut).toBeCalled();
  //   });
  //   it('should display notification and logout on UNAUTHORIZED_ERR with ERR003 code', () => {
  //     // given
  //     const error = {
  //       status: 401,
  //       response: { body: { code: 'ERR003' } },
  //     };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({ content: SESSION_EXPIRED, type: 'info' });
  //   });
  //   it('should display  wrong username notification on UNAUTHORIZED_ERR with ERR003 code and iServerCode', () => {
  //     // given
  //     const error = {
  //       status: 401,
  //       response: {
  //         body: {
  //           code: 'ERR003',
  //           iServerCode: -2147216959,
  //         },
  //       },
  //     };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({ content: WRONG_CREDENTIALS, type: 'info' });
  //   });
  //   it('should display notification and logout on CONNECTION_BROKEN_ERR', () => {
  //     // given
  //     const error = { message: 'Possible causes: the network is offline,', };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
  //     // when
  //     errorService.handleError(error, false);
  //     jest.advanceTimersByTime(2000);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       content: 'Environment is unreachable. Please check your internet connection.',
  //       details: 'Possible causes: the network is offline,',
  //       onConfirm: null, type: 'warning',
  //     });
  //     expect(spyLogOut).toBeCalled();
  //   });
  //   it('should display notification and logout on BAD_REQUEST_ERR', () => {
  //     // given
  //     const error = { response: { status: 400, }, };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       content: 'There has been a problem with your request', details: '', onConfirm: null, type: 'warning',
  //     });
  //   });
  //   it('should display notification on CONNECTION_BROKEN_ERR and NOR logout if flag is true', () => {
  //     // given
  //     const error = { message: 'Possible causes: the network is offline,', };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     const spyLogOut = jest.spyOn(errorService, 'fullLogOut');
  //     // when
  //     errorService.handleError(error, true);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       type: 'warning', content: 'Environment is unreachable. Please check your internet connection.',
  //       details: error.message, onConfirm: null,
  //     });
  //     expect(spyLogOut).not.toBeCalled();
  //   });
  //   it('should display notification on BadRequestError', () => {
  //     // given
  //     const error = { response: { status: 400, }, };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error, true);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       content: 'There has been a problem with your request', details: '', onConfirm: null, type: 'warning',
  //     });
  //   });
  //   it('should display notification on OutsideOfRangeError ', () => {
  //     // given
  //     const error = new OutsideOfRangeError();
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //   });
  //   it('should display notification on InternalServerError with no error body', () => {
  //     // given
  //     const error = { status: 500 };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //   });
  //   it('should display notification on InternalServerError', () => {
  //     // given
  //     const response = { status: 500, body: { iServerCode: '-2147171501' } };
  //     const error = { response };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       content: NOT_SUPPORTED_SERVER_ERR, details: '', onConfirm: null, type: 'warning',
  //     });
  //   });
  //   it('should display notification on InternalServerError on report with Custom Groups', () => {
  //     // given
  //     const response = { status: 500, body: { iServerCode: '-2147171502' } };
  //     const error = { response };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       content: NOT_SUPPORTED_CUSTOM_GROUP, details: '', onConfirm: null, type: 'warning',
  //     });
  //   });
  //   it('should display notification on exceeding row limits', () => {
  //     // given
  //     const response = { status: 500, body: { iServerCode: '-2147205488' } };
  //     const error = { response };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       content: PROJECT_ROW_LIMIT, details: '', onConfirm: null, type: 'warning',
  //     });
  //   });
  //   it('should display notification on not published cubes', () => {
  //     // given
  //     const response = { status: 500, body: { iServerCode: '-2147072488' } };
  //     const error = { response };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       content: NOT_PUBLISHED_CUBE, details: '', onConfirm: null, type: 'warning',
  //     });
  //   });
  //   it('should display notification on object not present in metadata', () => {
  //     // given
  //     const response = { status: 500, body: { iServerCode: '-2147216373' } };
  //     const error = { response };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       content: NOT_IN_METADATA, details: '', onConfirm: null, type: 'warning',
  //     });
  //   });
  //   it('should display NO_DATA_RETURNED on server error with -2147213784 iServerCode', () => {
  //     // given
  //     const response = { status: 403, body: { iServerCode: '-2147213784' } };
  //     const error = { response };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       content: NO_DATA_RETURNED, details: '', onConfirm: null, type: 'warning',
  //     });
  //   });
  //   it('should display notification on dossier removed from metadata', () => {
  //     // given
  //     const response = { status: 404, body: { iServerCode: -2147216373 } };
  //     const error = { response, mstrObjectType: mstrObjectEnum.mstrObjectType.dossier.name };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       content: `This ${error.mstrObjectType} was deleted.`, details: '', onConfirm: null, type: 'warning',
  //     });
  //   });
  //   it('should logout on UnauthorizedError', () => {
  //     // given
  //     const error = {
  //       status: 401,
  //       response: { body: { code: '', }, },
  //     };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(setTimeout).toBeCalled();
  //     expect(setTimeout).toBeCalledWith(expect.any(Function), 2000);
  //   });
  //   it('should logout on EnvironmentNotFound', () => {
  //     // given
  //     const error = { status: 404 };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error, true);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //   });
  //   it('should handle OverlappingTablesError', () => {
  //     // given
  //     const error = { name: 'RichApi.Error', message: 'A table can\'t overlap another table. ' };
  //     const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(notificationSpy).toBeCalled();
  //     expect(notificationSpy).toBeCalledWith({
  //       content: TABLE_OVERLAP, details: 'A table can\'t overlap another table. ', onConfirm: null, type: 'warning',
  //     });
  //   });
  //   it('should display INVALID_VIZ_KEY_MESSAGE notification on INVALID_VIZ_KEY error', () => {
  //     // given
  //     const error = { response: { status: 404, }, type: errorTypes.INVALID_VIZ_KEY };
  //     const spyMethod = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(spyMethod).toBeCalled();
  //     expect(spyMethod).toBeCalledWith({
  //       content: INVALID_VIZ_KEY_MESSAGE, details: '', onConfirm: null, type: 'warning',
  //     });
  //   });
  // });
  // describe('getOfficeErrorType', () => {
  //   it('should return RUN_OUTSIDE_OFFICE_ERR type in a proper case', () => {
  //     // given
  //     const error = {
  //       name: 'RichApi.Error',
  //       message: 'Excel is not defined',
  //     };
  //     // when
  //     const returnedError = errorService.getOfficeErrorType(error);
  //     // then
  //     expect(returnedError).toBe(errorTypes.RUN_OUTSIDE_OFFICE_ERR);
  //   });
  //   it('should return OVERLAPPING_TABLES_ERR type in a proper case', () => {
  //     // given
  //     const error = {
  //       name: 'RichApi.Error',
  //       message: 'A table can\'t overlap another table. ',
  //     };
  //     // when
  //     const returnedError = errorService.getOfficeErrorType(error);
  //     // then
  //     expect(returnedError).toBe(errorTypes.OVERLAPPING_TABLES_ERR);
  //   });
  //   it('should return TABLE_REMOVED_FROM_EXCEL_ERR type in a proper case', () => {
  //     // given
  //     const error = {
  //       name: 'RichApi.Error',
  //       message: 'This object binding is no longer valid due to previous updates.',
  //     };
  //     // when
  //     const returnedError = errorService.getOfficeErrorType(error);
  //     // then
  //     expect(returnedError).toBe(errorTypes.TABLE_REMOVED_FROM_EXCEL_ERR);
  //   });
  //   it('should display message when we do not handle error', () => {
  //     // given
  //     const exampleMessage = 'This is some test message';
  //     const error = {
  //       name: 'RichApi.Error',
  //       message: exampleMessage,
  //     };
  //     // when
  //     const returnedError = errorService.getOfficeErrorType(error);
  //     // then
  //     expect(returnedError).toBe(errorTypes.GENERIC_OFFICE_ERR);
  //   });
  // });
  // describe('handleError for office error', () => {
  //   it('should display notification on RUN_OUTSIDE_OFFICE_ERR', () => {
  //     // given
  //     const error = {
  //       name: 'RichApi.Error',
  //       message: 'Excel is not defined',
  //     };
  //     const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(notificationSpy).toBeCalled();
  //     expect(notificationSpy).toBeCalledWith({
  //       content: 'Please run plugin inside Office',
  //       details: 'Excel is not defined',
  //       onConfirm: null, type: 'warning',
  //     });
  //   });
  //   it('should display notification on OVERLAPPING_TABLES_ERR', () => {
  //     // given
  //     const error = {
  //       name: 'RichApi.Error',
  //       message: 'A table can\'t overlap another table. ',
  //     };
  //     const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(notificationSpy).toBeCalled();
  //     expect(notificationSpy).toBeCalledWith({
  //       content: TABLE_OVERLAP, details: 'A table can\'t overlap another table. ', onConfirm: null, type: 'warning',
  //     });
  //   });
  //   it('should display notification on GENERIC_OFFICE_ERR', () => {
  //     // given
  //     const error = {
  //       name: 'RichApi.Error',
  //       message: 'Generic error message',
  //     };
  //     const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(notificationSpy).toBeCalled();
  //     expect(notificationSpy).toBeCalledWith({
  //       content: `Excel returned error: ${error.message}`,
  //       details: 'Generic error message',
  //       onConfirm: null,
  //       type: 'warning',
  //     });
  //   });
  //   it('should display notification on OutsideOfRangeError', () => {
  //     // given
  //     const error = new OutsideOfRangeError();
  //     const notificationSpy = jest.spyOn(notificationService, 'displayNotification');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(notificationSpy).toBeCalled();
  //     expect(notificationSpy).toBeCalledWith({
  //       content: 'The table you try to import exceeds the worksheet limits.',
  //       details: '',
  //       onConfirm: null,
  //       type: 'warning',
  //     });
  //   });
  // });
  // describe('logout', () => {
  //   it('should call fullLogout', () => {
  //     // given
  //     const fullLogOutSpy = jest.spyOn(errorService, 'fullLogOut');
  //     const logOutRestSpy = jest.spyOn(sessionHelper, 'logOutRest');
  //     const logOutSpy = jest.spyOn(sessionHelper, 'logOut');
  //     const logOutRedirectSpy = jest.spyOn(sessionHelper, 'logOutRedirect');
  //     // when
  //     errorService.fullLogOut();
  //     // then
  //     expect(fullLogOutSpy).toBeCalled();
  //     expect(logOutRestSpy).toBeCalled();
  //     expect(logOutSpy).toBeCalled();
  //     expect(logOutRedirectSpy).toBeCalled();
  //   });
  //   it('should handle LogoutError', () => {
  //     // given
  //     const error = { message: 'error' };
  //     const fullLogOutSpy = jest.spyOn(errorService, 'handleError');
  //     // when
  //     errorService.handleError(error);
  //     // then
  //     expect(fullLogOutSpy).toBeCalled();
  //   });
  // });
});
