import { sessionHelper } from '../../storage/session-helper';
import { authenticationService } from '../../authentication/auth-rest-service';
import { notificationService } from '../../notification/notification-service';
import { errorService } from '../../error/error-handler';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { reduxStore } from '../../store';

jest.mock('../../error/error-handler');
jest.mock('../../notification/notification-service');
jest.mock('../../authentication/auth-rest-service');
jest.mock('../../storage/session-helper');

describe('loginUser', () => {
  beforeAll(() => {
    authenticationHelper.init(reduxStore, sessionHelper, authenticationService, errorService);
  });
  it('should return if error occured', () => {
    // given
    const givenError = {};
    // when
    authenticationHelper.loginUser(givenError, {});
    // then
    expect(sessionHelper.enableLoading).not.toBeCalled();
    expect(sessionHelper.saveLoginValues).not.toBeCalled();
    expect(authenticationService.authenticate).not.toBeCalled();
    expect(notificationService.displayNotification).not.toBeCalled();
    expect(sessionHelper.logIn).not.toBeCalled();
    expect(errorService.handleError).not.toBeCalled();
    expect(sessionHelper.disableLoading).not.toBeCalled();
  });
  it('should save login values', () => {
    // given
    const givenError = undefined;
    const givenValues = {
      username: 'testUsername',
      password: 'testPassword',
      envUrl: 'testEnvUrl',
    };
    // when
    authenticationHelper.loginUser(givenError, givenValues);
    // then
    expect(sessionHelper.saveLoginValues).toBeCalled();
    expect(sessionHelper.saveLoginValues).toBeCalledWith(givenValues);
  });
  it('should call authentication with proper values', () => {
    // given
    const givenError = undefined;
    const givenValues = {
      username: 'testUsername',
      password: 'testPassword',
      envUrl: 'testEnvUrl',
      loginMode: '1',
    };
    const authenticate = jest.spyOn(authenticationService, 'authenticate');
    // when
    authenticationHelper.loginUser(givenError, givenValues);
    // then
    expect(authenticate).toBeCalled();
    expect(authenticate)
      .toBeCalledWith(givenValues.username,
        givenValues.password,
        givenValues.envUrl,
        1);
  });
  it('should save authToken', async () => {
    // given
    const givenError = undefined;
    const givenValues = {
      username: 'testUsername',
      password: 'testPassword',
      envUrl: 'testEnvUrl',
    };
    const givenAuthToken = 'someAuthToken';
    const authenticateMock = jest.spyOn(authenticationService, 'authenticate').mockResolvedValue(givenAuthToken);
    // when
    await authenticationHelper.loginUser(givenError, givenValues);
    // then
    expect(authenticateMock).toBeCalled();
    expect(sessionHelper.logIn).toBeCalled();
    expect(sessionHelper.logIn).toBeCalledWith(givenAuthToken);
    expect(sessionHelper.disableLoading).toBeCalled();
  });
  it('should handle error from authenticate', async () => {
    // given
    const givenError = undefined;
    const givenValues = {
      username: 'testUsername',
      password: 'testPassword',
      envUrl: 'testEnvUrl',
    };
    const testError = new Error();
    const authenticateMock = jest.spyOn(authenticationService, 'authenticate')
      .mockImplementation(async () => {
        throw testError;
      });
    // when
    await authenticationHelper.loginUser(givenError, givenValues);
    // then
    expect(authenticateMock).toBeCalled();
    expect(errorService.handleError).toBeCalled();
    expect(errorService.handleError).toBeCalledWith(testError, { isLogout: true });
    expect(sessionHelper.disableLoading).toBeCalled();
  });
  it('should call putSessions on validating token', () => {
    // given
    const authenticateMock = jest.spyOn(authenticationService, 'putSessions');
    // when
    authenticationHelper.validateAuthToken();
    // then
    expect(authenticateMock).toBeCalled();
  });
});
