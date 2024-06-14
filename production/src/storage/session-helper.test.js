import { createStore } from 'redux';

import { authenticationRestApi } from '../authentication/auth-rest-service';
import { browserHelper } from '../helpers/browser-helper';
import { sessionHelper } from './session-helper';

import { reduxStore } from '../store';

import { SessionActionTypes } from '../redux-reducer/session-reducer/session-reducer-types';

import { errorService } from '../error/error-handler';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';
import { sessionReducer } from '../redux-reducer/session-reducer/session-reducer';
import { ErrorMessages } from '../error/constants';

describe('sessionHelper', () => {
  const sessionStore = createStore(sessionReducer);

  const savedLocation = window.location;

  beforeEach(() => {
    // default state should be empty
    expect(sessionStore.getState()).toEqual({});
    window.history.pushState({}, 'Test Title', '/test.html?query=true');

    delete window.location;
    window.location = {
      pathname: 'Test Title',
      assign: jest.fn(),
      reload: jest.fn(),
      replace: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    window.location = savedLocation;
  });

  it('should save authToken in redux on login', () => {
    // given

    reduxStore.dispatch = jest.fn();
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch');
    const authToken = 'token';

    // when
    sessionActions.logIn(authToken);
    // then
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: SessionActionTypes.LOGGED_IN,
      authToken,
    });
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
      type: SessionActionTypes.LOG_IN,
      logInValues: { envUrl: givenValues.envUrl },
    });
  });

  it('should call putSessions on installSessionProlongingHandler invocation', () => {
    // given
    const onSessionExpire = jest.fn();
    const putSessionsMock = jest.spyOn(authenticationRestApi, 'putSessions').mockImplementation();
    jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValueOnce(true);
    jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({
      sessionReducer: { authToken: 'x-mstr-authToken', envUrl: 'Url' },
    });
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
          message: ErrorMessages.SESSION_EXTENSION_FAILURE_MESSAGE,
        },
        text: `{code: ERR009, message: ${ErrorMessages.SESSION_EXTENSION_FAILURE_MESSAGE}}`,
      },
    };
    const onSessionExpire = jest.fn();
    authenticationRestApi.putSessions = jest.fn().mockImplementationOnce(() => {
      throw sessionFailureError;
    });
    jest.spyOn(errorService, 'handleError').mockImplementation();
    jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({
      sessionReducer: { authToken: 'x-mstr-authToken' },
    });
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
    authenticationRestApi.putSessions = jest.fn().mockImplementationOnce(() => {
      throw sessionFailureError;
    });
    jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({
      sessionReducer: { authToken: 'x-mstr-authToken' },
    });

    // when
    const prolongSession = sessionHelper.installSessionProlongingHandler(onSessionExpire);
    prolongSession();

    // then
    expect(onSessionExpire).toHaveBeenCalled();
  });

  it('should call keepSessionAlive with default callback parameter', () => {
    // given
    jest.spyOn(sessionHelper, 'keepSessionAlive').mockImplementationOnce();
    jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({
      sessionReducer: { authToken: 'x-mstr-authToken' },
    });

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

  it('getUserAttributeFormPrivilege should work correctly', async () => {
    // given
    const authToken = '12-abc-34';
    const envUrl = 'env-url-123';
    jest.spyOn(reduxStore, 'getState').mockImplementation(() => ({
      sessionReducer: {
        authToken,
        envUrl,
      },
    }));

    const isDevelopmentMock = jest.spyOn(browserHelper, 'isDevelopment').mockReturnValueOnce(false);
    const getTokenFromStorageMock = jest
      .spyOn(sessionHelper, 'getTokenFromStorage')
      .mockImplementation(() => '12-abc-34');
    const getOfficePrivilege = jest
      .spyOn(authenticationRestApi, 'getOfficePrivilege')
      .mockResolvedValueOnce(true);

    // when
    await sessionHelper.getCanUseOfficePrivilege();

    // then
    expect(isDevelopmentMock).toHaveBeenCalled();
    expect(getTokenFromStorageMock).toHaveBeenCalled();
    expect(getOfficePrivilege).toHaveBeenCalledWith(envUrl, authToken);
  });
});
