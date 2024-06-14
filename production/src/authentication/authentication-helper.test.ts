import { authenticationRestApi } from './auth-rest-service';
import { authenticationHelper } from './authentication-helper';

import { reduxStore } from '../store';

import { sessionActions } from '../redux-reducer/session-reducer/session-actions';

describe('authentication helper', () => {
  it('should call authentication with proper values', () => {
    // given
    const givenValues = {
      username: 'testUsername',
      password: 'testPassword',
      envUrl: 'testEnvUrl',
      loginMode: 1,
    };

    const enableLoadingMock = jest.spyOn(sessionActions, 'enableLoading').mockImplementation();
    const saveLoginValues = jest.spyOn(sessionActions, 'saveLoginValues').mockImplementation();
    const authenticate = jest.spyOn(authenticationRestApi, 'authenticate').mockImplementation();
    // when
    authenticationHelper.loginUser(givenValues);
    // then

    expect(enableLoadingMock).toHaveBeenCalled();
    expect(saveLoginValues).toHaveBeenCalled();
    expect(sessionActions.enableLoading).toHaveBeenCalled();
    expect(sessionActions.saveLoginValues).toHaveBeenCalledWith(givenValues);

    expect(authenticate).toBeCalledWith(
      givenValues.username,
      givenValues.password,
      givenValues.envUrl,
      1
    );
  });

  it('should call putSessions on validating authToken', () => {
    // given
    const authToken = 'testAuthToken';
    const envUrl = 'testEnvUrl';

    const putSessionsMock = jest.spyOn(authenticationRestApi, 'putSessions').mockImplementation();

    // @ts-expect-error
    jest.spyOn(reduxStore, 'getState').mockReturnValue({ sessionReducer: { authToken, envUrl } });

    // when
    authenticationHelper.validateAuthToken();
    // then
    expect(putSessionsMock).toHaveBeenCalledWith(envUrl, authToken);
  });
});
