import { waitFor } from '@testing-library/react';
import { createStore } from 'redux';

import { browserHelper } from '../helpers/browser-helper';
import { authenticationRestApi } from './auth-rest-service';
import { authenticationService } from './authentication-service';

import { errorService } from '../error/error-handler';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';
import { sessionReducer } from '../redux-reducer/session-reducer/session-reducer';

describe('authentication service', () => {
  const sessionStore = createStore(sessionReducer);

  const savedLocation = window.location;

  beforeEach(() => {
    // default state should be empty
    expect(sessionStore.getState()).toEqual({});
    window.history.pushState({}, 'Test Title', '/test.html?query=true');

    delete window.location;
    // @ts-expect-error
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

  it('should throw error due to logOutError', () => {
    // given
    authenticationRestApi.logout = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });
    jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    authenticationService.logOutRest(errorService);

    // then
    expect(errorService.handleError).toHaveBeenCalled();
  });
  it('should call redirect logOutRedirect', () => {
    // given
    jest.spyOn(browserHelper, 'isDevelopment').mockReturnValueOnce(false);
    // when
    authenticationService.logOutRedirect();
    // then
    expect(window.location.replace).toBeCalled();
  });
  it('should disable loading for localhost in logOutRedirect', () => {
    // given
    jest.spyOn(browserHelper, 'isDevelopment').mockReturnValueOnce(true);
    const loadingHelper = jest.spyOn(sessionActions, 'disableLoading');
    browserHelper.getWindowLocation = jest.fn().mockReturnValueOnce({ origin: 'localhost' });

    // when
    authenticationService.logOutRedirect();
    // then
    expect(loadingHelper).toBeCalled();
  });

  it('handleLogoutForPrivilegeMissing should work correctly', async () => {
    // given
    const logOutRestMock = jest.spyOn(authenticationService, 'logOutRest').mockResolvedValue();
    const logOutMock = jest.spyOn(sessionActions, 'logOut').mockImplementation(() => {});
    const logOutRedirectMock = jest
      .spyOn(authenticationService, 'logOutRedirect')
      .mockImplementation();
    jest.spyOn(authenticationRestApi, 'logout').mockImplementation();

    // when
    authenticationService.handleLogoutForPrivilegeMissing(errorService);

    // then
    expect(logOutRestMock).toHaveBeenCalled();
    await waitFor(() => expect(logOutMock).toBeCalled());
    await waitFor(() => expect(logOutRedirectMock).toBeCalled());
  });
});
