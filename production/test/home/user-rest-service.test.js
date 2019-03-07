import {userRestService} from '../../src/home/user-rest-service';
import {UnauthorizedError} from '../../src/error/unauthorized-error';
import {authenticationService} from '../../src/authentication/auth-rest-service';
import {authenticationHelper} from '../../src/authentication/authentication-helper';
import {sessionHelper} from '../../src/storage/session-helper';


// jest.mock('../../src/home/user-rest-service');

const envURL = 'https://env-125323.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

describe('getUserData', () => {
  it('should save userData', async () => {
    // given
    const givenError = undefined;
    const givenValues = {
      username: 'testUsername',
      password: 'testPassword',
      envUrl: 'testEnvUrl',
    };
    const givenAuthToken = 'someAuthToken';
    const givenUserData = 'body';
    const authenticateMock = jest.spyOn(authenticationService, 'authenticate').mockResolvedValue(givenAuthToken);
    const userDataMock = jest.spyOn(userRestService, 'getUserData').mockResolvedValueOnce(givenUserData);
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'saveUserInfo');
    // when
    await authenticationHelper.loginUser(givenError, givenValues);
    // then
    expect(authenticateMock).toBeCalled();
    expect(userDataMock).toBeCalled();
    expect(sessionHelperSpy).toBeCalled();
  });
  it('should throw error due to incorrect token', async () => {
    // given
    const givenAuthToken = 'token';
    // when
    const userData = userRestService.getUserData(givenAuthToken, envURL);
    // then
    try {
      await userData;
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    };
    expect(userData).rejects.toThrow();
  });
});
