import { createStore } from 'redux';
import { sessionReducer } from '../../redux-reducer/session-reducer/session-reducer';
import { sessionProperties } from '../../redux-reducer/session-reducer/session-properties';
import { sessionHelper } from '../../storage/session-helper';
import { errorService } from '../../error/error-handler';
import { authenticationService } from '../../authentication/auth-rest-service';
import { HomeHelper } from '../../home/home-helper';
import { reduxStore } from '../../store';

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
    const logOutErrorSpy = jest.spyOn(errorService, 'handleError');
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
    const loadingHelper = jest.spyOn(sessionHelper, 'disableLoading');
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
    sessionHelper.logIn(authToken);
    // then
    expect(dispatchSpy).toHaveBeenCalledWith({ type: sessionProperties.actions.loggedIn, authToken });
  });
  it('should save envUrl in redux on login', () => {
    // given
    reduxStore.dispatch = jest.fn();
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch');
    const givenValues = { envUrl: 'envUrl' };
    // when
    sessionHelper.saveLoginValues(givenValues);

    // then
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: sessionProperties.actions.logIn,
      values: { envUrl: givenValues.envUrl }
    });
  });

  it('should call putSessions on installSessionProlongingHandler invocation', () => {
    // given
    const onSessionExpire = jest.fn();
    const putSessionsSpy = jest.spyOn(authenticationService, 'putSessions');
    // when
    const prolongSession = sessionHelper.installSessionProlongingHandler(onSessionExpire);
    prolongSession();
    // then
    expect(putSessionsSpy).toHaveBeenCalled();
  });

  it('should call handleError in case of session expired', () => {
    // given
    const onSessionExpire = jest.fn();
    authenticationService.putSessions = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    const logOutErrorSpy = jest.spyOn(errorService, 'handleError');
    // when
    const prolongSession = sessionHelper.installSessionProlongingHandler(onSessionExpire);
    prolongSession();
    // then
    expect(logOutErrorSpy).toHaveBeenCalled();
  });

  it('should call onSessionExpire callback function if passed to parameters of method in case of session expired', () => {
    // given
    const onSessionExpire = jest.fn();
    authenticationService.putSessions = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    // when
    const prolongSession = sessionHelper.installSessionProlongingHandler(onSessionExpire);
    prolongSession();
    // then
    expect(onSessionExpire).toHaveBeenCalled();
  });

  it('should call keepSessionAlive with default callback parameter', () => {
    // given
    const keepSessionAliveHelper = jest.spyOn(sessionHelper, 'keepSessionAlive');
    // when
    const prolongSession = sessionHelper.installSessionProlongingHandler();
    prolongSession();
    // then
    expect(keepSessionAliveHelper).toHaveBeenCalledWith(null);
  });

  it('should call keepSessionAlive with callback function parameter', () => {
    // given
    const onSessionExpire = jest.fn();
    const keepSessionAliveHelper = jest.spyOn(sessionHelper, 'keepSessionAlive');
    // when
    const prolongSession = sessionHelper.installSessionProlongingHandler(onSessionExpire);
    prolongSession();
    // then
    expect(keepSessionAliveHelper).toHaveBeenCalledWith(onSessionExpire);
  });
});
