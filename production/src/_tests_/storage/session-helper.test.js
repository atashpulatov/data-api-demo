import { createStore } from 'redux';
import { sessionReducer } from '../../redux-reducer/session-reducer/session-reducer';
import { sessionProperties } from '../../redux-reducer/session-reducer/session-properties';
import { sessionHelper } from '../../storage/session-helper';
import { errorService } from '../../error/error-handler';
import { authenticationService } from '../../authentication/auth-rest-service';
import { HomeHelper } from '../../home/home-helper';
import { reduxStore } from '../../store';
import { SESSION_EXTENSION_FAILURE_MESSAGE, errorCodes } from '../../error/constants';
import { sessionActions } from '../../redux-reducer/session-reducer/session-actions';

describe('sessionHelper', () => {
  const sessionStore = createStore(sessionReducer);

  const savedLocation = window.location;

  beforeEach(() => {
    // default state should be empty
    expect(sessionStore.getState()).toEqual({});
    window.history.pushState({}, 'Test Title', '/test.html?query=true');

    delete window.location;
    window.location = { pathname: 'Test Title',
      assign: jest.fn(),
      reload: jest.fn(),
      replace: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    window.location = savedLocation;
  });

  it('should throw error due to logOutError', () => {
    // given
    authenticationService.logout = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    sessionHelper.logOutRest();

    // then
    expect(errorService.handleError).toHaveBeenCalled();
  });
  it('should call redirect logOutRedirect', () => {
    // given
    jest.spyOn(sessionHelper, 'isDevelopment').mockReturnValueOnce(false);
    // when
    sessionHelper.logOutRedirect();
    // then
    expect(window.location.replace).toBeCalled();
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

  it('should call putSessions on installSessionProlongingHandler invocation', () => {
    // given
    const onSessionExpire = jest.fn();
    const putSessionsMock = jest.spyOn(authenticationService, 'putSessions').mockImplementation();
    jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValueOnce(true);
    jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({ sessionReducer: { authToken: 'x-mstr-authToken', envUrl: 'Url' } });
    // when
    const prolongSession = sessionHelper.installSessionProlongingHandler(onSessionExpire);
    prolongSession();

    // then
    expect(putSessionsMock).toHaveBeenCalled();
  });

  it('should call handleError in case of session expired', () => {
    // given
    const sessionFailureError = {
      response: {
        statusCode: 405,
        key: 'value',
        body: {
          code: 'ERR009',
          message: SESSION_EXTENSION_FAILURE_MESSAGE,
        },
        text: `{code: ERR009, message: ${SESSION_EXTENSION_FAILURE_MESSAGE}}`,
      },
    };
    const onSessionExpire = jest.fn();
    authenticationService.putSessions = jest.fn().mockImplementationOnce(() => {
      throw sessionFailureError;
    });
    jest.spyOn(errorService, 'handleError').mockImplementation();
    jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({ sessionReducer: { authToken: 'x-mstr-authToken' } });
    // when
    const prolongSession = sessionHelper.installSessionProlongingHandler(onSessionExpire);
    prolongSession();

    // then
    expect(errorService.handleError).toHaveBeenCalledTimes(1);
  });

  it('should not call onSessionExpire in case of error message and error code correpond', () => {
    // given
    const sessionFailureError = {
      response: {
        statusCode: 401,
      },
    };
    const onSessionExpire = jest.fn();
    authenticationService.putSessions = jest.fn().mockImplementationOnce(() => {
      throw sessionFailureError;
    });
    jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({ sessionReducer: { authToken: 'x-mstr-authToken' } });

    // when
    const prolongSession = sessionHelper.installSessionProlongingHandler(onSessionExpire);
    prolongSession();

    // then
    expect(onSessionExpire).toHaveBeenCalled();
  });

  it('should call keepSessionAlive with default callback parameter', () => {
    // given
    jest.spyOn(sessionHelper, 'keepSessionAlive').mockImplementationOnce();
    jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({ sessionReducer: { authToken: 'x-mstr-authToken' } });

    // when
    const prolongSession = sessionHelper.installSessionProlongingHandler();
    prolongSession();

    // then
    expect(sessionHelper.keepSessionAlive).toHaveBeenCalledWith(null);
  });

  it('should call keepSessionAlive with callback function parameter', () => {
    // given
    const onSessionExpire = jest.fn();
    jest.spyOn(sessionHelper, 'keepSessionAlive').mockImplementationOnce();

    // when
    const prolongSession = sessionHelper.installSessionProlongingHandler(onSessionExpire);
    prolongSession();

    // then
    expect(sessionHelper.keepSessionAlive).toHaveBeenCalledWith(onSessionExpire);
  });
});
