import {createStore} from 'redux';
import {sessionReducer} from '../../src/storage/session-reducer';
import {sessionProperties} from '../../src/storage/session-properties';
import {sessionHelper} from '../../src/storage/session-helper';
import {errorService} from '../../src/error/error-handler';
import {authenticationService} from '../../src/authentication/auth-rest-service';
import {homeHelper} from '../../src/home/home-helper';
import {reduxStore} from '../../src/store';

describe('sessionHelper', () => {
  const sessionStore = createStore(sessionReducer);

  beforeEach(() => {
    // default state should be empty
    expect(sessionStore.getState()).toEqual({});
    window.history.pushState({}, 'Test Title', '/test.html?query=true');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw error due to logOutError', async () => {
    // given
    authenticationService.logout = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    const logOutErrorSpy = jest.spyOn(errorService, 'handleLogoutError');
    // when
    sessionHelper.logOutRest();
    // then
    expect(logOutErrorSpy).toHaveBeenCalled();
  });
  it('should call redirect logOutRedirect', async () => {
    // given
    homeHelper.getWindowLocation = jest.fn().mockReturnValueOnce({origin: 'origin'});
    sessionHelper.replaceWindowLocation = jest.fn();
    const replaceHelper = jest.spyOn(sessionHelper, 'replaceWindowLocation');
    // when
    sessionHelper.logOutRedirect();
    // then
    expect(replaceHelper).toBeCalled();
  });
  it('should disable loading for localhost in logOutRedirect', async () => {
    // given
    const loadingHelper = jest.spyOn(sessionHelper, 'disableLoading');
    homeHelper.getWindowLocation = jest.fn().mockReturnValueOnce({origin: 'localhost'});

    // when
    sessionHelper.logOutRedirect();
    // then
    expect(loadingHelper).toBeCalled();
  });
  it('should save authToken in redux on login', async () => {
    // given

    reduxStore.dispatch = jest.fn();
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch');
    const authToken = 'token';

    // when
    sessionHelper.logIn(authToken);
    // then
    expect(dispatchSpy).toHaveBeenCalledWith({type: sessionProperties.actions.loggedIn, authToken: authToken});
  });
  it('should save envUrl in redux on login', async () => {
    // given
    reduxStore.dispatch = jest.fn();
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch');
    const givenValues = {envUrl: 'envUrl'};
    // when
    sessionHelper.saveLoginValues(givenValues);

    // then
    expect(dispatchSpy).toHaveBeenCalledWith({type: sessionProperties.actions.logIn, envUrl: givenValues.envUrl});
  });
});

