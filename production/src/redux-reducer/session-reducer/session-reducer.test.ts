import { createStore } from 'redux';

import { LogOutAction, SessionActionTypes } from './session-reducer-types';

import { sessionReducer } from './session-reducer';

describe('sessionReducer', () => {
  const sessionStore = createStore(sessionReducer);

  beforeEach(() => {
    // default state should be empty
    expect(sessionStore.getState()).toEqual({});
  });

  afterEach(() => {
    const givenEnvUrl = 'someEnvUrl';
    sessionStore.dispatch({
      type: SessionActionTypes.LOG_IN,
      logInValues: {
        envUrl: givenEnvUrl,
        isRememberMeOn: false,
      },
    });
    sessionStore.dispatch({ type: SessionActionTypes.LOG_OUT });
  });

  it('should set loading to enabled', () => {
    // given
    const loading = true;
    // when
    sessionStore.dispatch({
      type: SessionActionTypes.SET_LOADING,
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
      type: SessionActionTypes.SET_LOADING,
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
      type: SessionActionTypes.LOG_IN,
      logInValues: { envUrl: givenEnvUrl },
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
    const action: LogOutAction = { type: SessionActionTypes.LOG_OUT };
    // const spyLogOut = jest.spyOn(sessionReducer, 'onLogOut');
    // when
    const newState = sessionReducer(state, action);
    // then
    expect(newState.userFullName).toBe(null);
    expect(newState.userInitials).toBe(null);
    expect(newState.authToken).toBe(false);
  });

  it('should save authToken on logged in action', () => {
    // given
    const firstToken = 'firstTokenTest1';
    // when
    sessionStore.dispatch({
      type: SessionActionTypes.LOGGED_IN,
      authToken: firstToken,
    });
    // then
    expect(sessionStore.getState().authToken).toBe(firstToken);
  });

  it('should save userInfo on getUserInfo action', () => {
    // given
    const givenFullName = 'Full Name';
    const givenInitials = 'IN';
    // when
    sessionStore.dispatch({
      type: SessionActionTypes.GET_USER_INFO,
      userFullName: givenFullName,
      userInitials: givenInitials,
    });
    // then
    expect(sessionStore.getState().userFullName).toEqual(givenFullName);
    expect(sessionStore.getState().userInitials).toEqual(givenInitials);
  });
});
