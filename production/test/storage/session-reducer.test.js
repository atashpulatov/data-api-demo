/* eslint-disable */
import { createStore } from 'redux';
import { sessionReducer } from '../../src/storage/session-reducer';
import { sessionProperties } from '../../src/storage/session-properties';
import { SessionError } from '../../src/storage/session-error';
/* eslint-enable */

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
      envUrl: givenEnvUrl,
    });
    sessionStore.dispatch({
      type: sessionProperties.actions.logOut,
    });
  });

  it('should throw error due to missing loading property', () => {
    // given
    // when
    const wrongActionCall = () => {
      sessionStore.dispatch({
        type: sessionProperties.actions.setLoading,
      });
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
      envUrl: givenEnvUrl,
    });
    // then
    const sessionStoreState = sessionStore.getState();
    const envUrl = sessionStoreState.envUrl;
    expect(envUrl).toBe(givenEnvUrl);
  });

  it('should throw an error due to missing envUrl', () => {
    const givenUsername = 'someUsername';
    const givenRememberMeFlag = true;
    // then
    const wrongActionCall = () => {
      sessionStore.dispatch({
        type: sessionProperties.actions.logIn,
        username: givenUsername,
        isRememberMeOn: givenRememberMeFlag,
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
      sessionStore.dispatch({
        type: sessionProperties.actions.loggedIn,
      });
    };
    // then
    expect(wrongActionCall).toThrowError(SessionError);
    expect(wrongActionCall).toThrowError('Missing AuthToken.');
  });
});
