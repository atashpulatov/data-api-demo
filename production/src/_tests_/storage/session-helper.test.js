import { createStore } from 'redux';
import { sessionReducer } from '../../redux-reducer/session-reducer/session-reducer';
import { sessionProperties } from '../../redux-reducer/session-reducer/session-properties';
import { sessionHelper } from '../../storage/session-helper';
import { errorService } from '../../error/error-handler';
import { authenticationService } from '../../authentication/auth-rest-service';
import { HomeHelper } from '../../home/home-helper';
import { reduxStore } from '../../store';
import { sessionActions } from '../../redux-reducer/session-reducer/session-actions';

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

  it('should throw error due to logOutError', () => {
    // given
    authenticationService.logout = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    const logOutErrorSpy = jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    sessionHelper.logOutRest();

    // then
    expect(logOutErrorSpy).toHaveBeenCalled();
  });
  it('should call redirect logOutRedirect', () => {
    // given
    jest.spyOn(sessionHelper, 'isDevelopment').mockReturnValueOnce(false);
    sessionHelper.replaceWindowLocation = jest.fn();
    const replaceHelper = jest.spyOn(sessionHelper, 'replaceWindowLocation');
    // when
    sessionHelper.logOutRedirect();
    // then
    expect(replaceHelper).toBeCalled();
  });
  it('should disable loading for localhost in logOutRedirect', () => {
    // given
    jest.spyOn(sessionHelper, 'isDevelopment').mockReturnValueOnce(true);
    const loadingHelper = jest.spyOn(sessionActions, 'disableLoading');
    HomeHelper.getWindowLocation = jest.fn().mockReturnValueOnce({ origin: 'localhost' });

    // when
    sessionHelper.logOutRedirect();
    // then
    expect(loadingHelper).toBeCalled();
  });
  it('should save authToken in redux on login', () => {
    // given

    reduxStore.dispatch = jest.fn();
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch');
    const authToken = 'token';

    // when
    sessionActions.logIn(authToken);
    // then
    expect(dispatchSpy).toHaveBeenCalledWith({ type: sessionProperties.actions.loggedIn, authToken });
  });
  it('should save envUrl in redux on login', () => {
    // given
    reduxStore.dispatch = jest.fn();
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch');
    const givenValues = { envUrl: 'envUrl' };
    // when
    sessionActions.saveLoginValues(givenValues);

    // then
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: sessionProperties.actions.logIn,
      values: { envUrl: givenValues.envUrl }
    });
  });
});
