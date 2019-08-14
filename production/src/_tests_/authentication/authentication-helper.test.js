import {sessionHelper} from '../../storage/session-helper';
import {authenticationService} from '../../authentication/auth-rest-service';
import {notificationService} from '../../notification/notification-service';
import {errorService} from '../../error/error-handler';
import {authenticationHelper} from '../../authentication/authentication-helper';

jest.mock('../../error/error-handler');
jest.mock('../../notification/notification-service');
jest.mock('../../authentication/auth-rest-service');
jest.mock('../../storage/session-helper');

describe('loginUser', () => {
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
    expect(errorService.handlePreAuthError).not.toBeCalled();
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
    };
    // when
    authenticationHelper.loginUser(givenError, givenValues);
    // then
    expect(authenticationService.authenticate).toBeCalled();
    expect(authenticationService.authenticate)
        .toBeCalledWith(
            givenValues.username,
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
    const authenticateMock =
      jest.spyOn(authenticationService, 'authenticate')
          .mockImplementation(async () => {
            throw testError;
          });
    // when
    await authenticationHelper.loginUser(givenError, givenValues);
    // then
    expect(authenticateMock).toBeCalled();
    expect(errorService.handlePreAuthError).toBeCalled();
    expect(errorService.handlePreAuthError).toBeCalledWith(testError, true);
    expect(sessionHelper.disableLoading).toBeCalled();
  });
  it('should call getSession on validating token', async () => {
    // given
    const authenticateMock = jest.spyOn(authenticationService, 'getSessions');
    // when
    authenticationHelper.validateAuthToken();
    // then
    expect(authenticateMock).toBeCalled();
  });
});
