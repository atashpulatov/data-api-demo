import { authenticationService } from '../../authentication/auth-rest-service';
import { errorService } from '../../error/error-handler';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { reduxStore } from '../../store';
import { sessionActions } from '../../redux-reducer/session-reducer/session-actions';

jest.mock('../../error/error-handler');
jest.mock('../../authentication/auth-rest-service');
jest.mock('../../storage/session-helper');
jest.mock('../../redux-reducer/session-reducer/session-actions');

describe('loginUser', () => {
  beforeAll(() => {
    authenticationHelper.init(reduxStore, sessionActions, authenticationService, errorService);
  });
  it('should return if error occured', () => {
    // given
    const givenError = {};
    // when
    authenticationHelper.loginUser(givenError, {});
    // then
    expect(sessionActions.enableLoading).not.toBeCalled();
    expect(sessionActions.saveLoginValues).not.toBeCalled();
    expect(authenticationService.authenticate).not.toBeCalled();
    expect(sessionActions.logIn).not.toBeCalled();
    expect(errorService.handleError).not.toBeCalled();
    expect(sessionActions.disableLoading).not.toBeCalled();
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
    expect(sessionActions.saveLoginValues).toBeCalled();
    expect(sessionActions.saveLoginValues).toBeCalledWith(givenValues);
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
    expect(sessionActions.logIn).toBeCalled();
    expect(sessionActions.logIn).toBeCalledWith(givenAuthToken);
    expect(sessionActions.disableLoading).toBeCalled();
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
    expect(sessionActions.disableLoading).toBeCalled();
  });
  it('should call putSessions on validating authToken', () => {
    // given
    const authenticateMock = jest.spyOn(authenticationService, 'putSessions');
    // when
    authenticationHelper.validateAuthToken();
    // then
    expect(authenticateMock).toBeCalled();
  });
});
