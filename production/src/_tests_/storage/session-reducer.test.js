import { createStore } from 'redux';
import { sessionReducer } from '../../storage/session-reducer';
import { sessionProperties } from '../../storage/session-properties';
import { SessionError } from '../../storage/session-error';

describe('sessionReducer', () => {
  const sessionStore = createStore(sessionReducer);

  beforeEach(() => {
    // default state should be empty
    expect(sessionStore.getState()).toEqual({});
  });

  afterEach(() => {
    const givenEnvUrl = 'someEnvUrl';
    sessionStore.dispatch({
      type: sessionProperties.actions.logIn,
      values: {
        envUrl: givenEnvUrl,
        isRememberMeOn: false,
      },
    });
    sessionStore.dispatch({ type: sessionProperties.actions.logOut, });
  });

  it('should throw error due to missing loading property', () => {
    // given
    // when
    const wrongActionCall = () => {
      sessionStore.dispatch({ type: sessionProperties.actions.setLoading, });
    };
    // then
    expect(wrongActionCall).toThrowError(SessionError);
    expect(wrongActionCall).toThrowError('Missing loading');
  });
  it('should set loading to enabled', () => {
    // given
    const loading = true;
    // when
    sessionStore.dispatch({
      type: sessionProperties.actions.setLoading,
      loading,
    });
    const sessionStoreState = sessionStore.getState();
    // then
    expect(sessionStoreState.loading).toEqual(true);
  });

  it('should set loading to disabled', () => {
    // given
    const loading = false;
    // when
    sessionStore.dispatch({
      type: sessionProperties.actions.setLoading,
      loading,
    });
    const sessionStoreState = sessionStore.getState();
    // then
    expect(sessionStoreState.loading).toEqual(false);
  });

  it('should save envUrl on login', () => {
    // given
    const givenEnvUrl = 'someEnvUrl';
    // when
    sessionStore.dispatch({
      type: sessionProperties.actions.logIn,
      values: { envUrl: givenEnvUrl },
    });
    // then
    const sessionStoreState = sessionStore.getState();
    const { envUrl } = sessionStoreState;
    expect(envUrl).toBe(givenEnvUrl);
  });

  it('should remove data on logout', () => {
    // given
    const rememberMe = true;
    const givenToken = 'token';
    const givenFullName = 'Name';
    const givenInitials = 'Initials';
    const state = {
      isRememberMeOn: rememberMe,
      authToken: givenToken,
      userFullName: givenFullName,
      userInitials: givenInitials,
    };
    const action = { type: sessionProperties.actions.logOut };
    // const spyLogOut = jest.spyOn(sessionReducer, 'onLogOut');
    // when
    const newState = sessionReducer(state, action);
    // then
    expect(newState.userFullName).toBe(null);
    expect(newState.userInitials).toBe(null);
    expect(newState.authToken).toBe(false);
  });

  it('should throw an error due to missing envUrl', () => {
    const givenUsername = 'someUsername';
    const givenRememberMeFlag = true;
    // then
    const wrongActionCall = () => {
      sessionStore.dispatch({
        type: sessionProperties.actions.logIn,
        values: {
          username: givenUsername,
          isRememberMeOn: givenRememberMeFlag,
        },
      });
    };
    // then
    expect(wrongActionCall).toThrowError(SessionError);
    expect(wrongActionCall).toThrowError('Missing EnvUrl.');
    expect(sessionStore.getState().username).toBeFalsy();
  });

  it('should save authToken on logged in action', () => {
    // given
    const firstToken = 'firstTokenTest1';
    // when
    sessionStore.dispatch({
      type: sessionProperties.actions.loggedIn,
      authToken: firstToken,
    });
    // then
    expect(sessionStore.getState().authToken).toBe(firstToken);
  });

  it('should throw an error due to missing authToken', () => {
    // given
    // when
    const wrongActionCall = () => {
      sessionStore.dispatch({ type: sessionProperties.actions.loggedIn, });
    };
    // then
    expect(wrongActionCall).toThrowError(SessionError);
    expect(wrongActionCall).toThrowError('Missing AuthToken.');
  });

  it('should save userInfo on getUserInfo action', () => {
    // given
    const givenFullName = 'Full Name';
    const givenInitials = 'IN';
    // when
    sessionStore.dispatch({
      type: sessionProperties.actions.getUserInfo,
      userFullName: givenFullName,
      userInitials: givenInitials,
    });
    // then
    expect(sessionStore.getState().userFullName).toEqual(givenFullName);
    expect(sessionStore.getState().userInitials).toEqual(givenInitials);
  });

  it('should save givenDialog on setDialog action', () => {
    // given
    const mockDialog = { close: () => { } };
    // when
    sessionStore.dispatch({
      type: sessionProperties.actions.setDialog,
      dialog: mockDialog,
    });
    // then
    expect(sessionStore.getState().dialog).toEqual(mockDialog);
  });
});
