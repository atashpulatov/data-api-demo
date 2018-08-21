/* eslint-disable */
import { createStore } from 'redux';
import { sessionReducer } from '../../../../src/frontend/app/storage/session-reducer';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { SessionError } from '../../../../src/frontend/app/storage/session-error';
/* eslint-enable */

describe('sessionReducer', () => {
    const sessionStore = createStore(sessionReducer);

    beforeEach(() => {
        // default state should be empty
        expect(sessionStore.getState()).toEqual({});
    });

    afterEach(() => {
        const givenEnvUrl = 'someEnvUrl';
        const givenUsername = 'someUsername';
        const givenRememberMeFlag = false;
        sessionStore.dispatch({
            type: sessionProperties.actions.logIn,
            username: givenUsername,
            envUrl: givenEnvUrl,
            isRememberMeOn: givenRememberMeFlag,
        });
        sessionStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
    });

    it('should save username and envUrl on login', () => {
        // given
        const givenEnvUrl = 'someEnvUrl';
        const givenUsername = 'someUsername';
        const givenRememberMeFlag = true;
        // when
        sessionStore.dispatch({
            type: sessionProperties.actions.logIn,
            username: givenUsername,
            envUrl: givenEnvUrl,
            isRememberMeOn: givenRememberMeFlag,
        });
        // then
        const sessionStoreState = sessionStore.getState();
        const username = sessionStoreState.username;
        const envUrl = sessionStoreState.envUrl;
        const rememberMeFlag = sessionStoreState.isRememberMeOn;
        expect(username).toBe(givenUsername);
        expect(envUrl).toBe(givenEnvUrl);
        expect(rememberMeFlag).toBe(true);
    });

    it('should remove stored username and envUrl on log out if isRememberMeOn is false', () => {
        // given
        const givenEnvUrl = 'someEnvUrl';
        const givenUsername = 'someUsername';
        const givenRememberMeFlag = false;
        sessionStore.dispatch({
            type: sessionProperties.actions.logIn,
            username: givenUsername,
            envUrl: givenEnvUrl,
            isRememberMeOn: givenRememberMeFlag,
        });
        // when
        sessionStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
        // then
        const sessionStoreState = sessionStore.getState();
        const username = sessionStoreState.username;
        const envUrl = sessionStoreState.envUrl;
        const rememberMeFlag = sessionStoreState.isRememberMeOn;
        expect(username).toBeUndefined();
        expect(envUrl).toBeUndefined();
        expect(rememberMeFlag).toBeUndefined();
    });

    it('should not remove stored username and envUrl on log out if isRememberMeOn is true', () => {
        // given
        const givenEnvUrl = 'someEnvUrl';
        const givenUsername = 'someUsername';
        const givenRememberMeFlag = true;
        sessionStore.dispatch({
            type: sessionProperties.actions.logIn,
            username: givenUsername,
            envUrl: givenEnvUrl,
            isRememberMeOn: givenRememberMeFlag,
        });
        // when
        sessionStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
        // then
        const sessionStoreState = sessionStore.getState();
        const username = sessionStoreState.username;
        const envUrl = sessionStoreState.envUrl;
        const rememberMeFlag = sessionStoreState.isRememberMeOn;
        expect(username).toBe(givenUsername);
        expect(envUrl).toBe(givenEnvUrl);
        expect(rememberMeFlag).toBe(true);
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

    it('should throw an error due to missing username', () => {
        const givenEnvUrl = 'someEnvUrl';
        const givenRememberMeFlag = true;
        // then
        const wrongActionCall = () => {
            sessionStore.dispatch({
                type: sessionProperties.actions.logIn,
                envUrl: givenEnvUrl,
                isRememberMeOn: givenRememberMeFlag,
            });
        };
        // then
        expect(wrongActionCall).toThrowError(SessionError);
        expect(wrongActionCall).toThrowError('Missing Username.');
        expect(sessionStore.getState().username).toBeFalsy();
    });

    it('should assign false to isRememberMeOn if no value provided', () => {
        const givenEnvUrl = 'someEnvUrl';
        const givenUsername = 'someUsername';
        // then
        sessionStore.dispatch({
            type: sessionProperties.actions.logIn,
            envUrl: givenEnvUrl,
            username: givenUsername,
        });
        // then
        expect(sessionStore.getState().isRememberMeOn).toBe(false);
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
        let wrongActionCall = () => {
            sessionStore.dispatch({
                type: sessionProperties.actions.loggedIn,
            });
        };
        // then
        expect(wrongActionCall).toThrowError(SessionError);
        expect(wrongActionCall).toThrowError('Missing AuthToken.');
    });

    it('should not remove stored username and envUrl and remove authToken on log out if isRememberMeOn is true', () => {
        // given
        const givenEnvUrl = 'someEnvUrl';
        const givenUsername = 'someUsername';
        const givenRememberMeFlag = true;
        const firstToken = 'firstTokenTest1';
        sessionStore.dispatch({
            type: sessionProperties.actions.logIn,
            username: givenUsername,
            envUrl: givenEnvUrl,
            isRememberMeOn: givenRememberMeFlag,
        });
        sessionStore.dispatch({
            type: sessionProperties.actions.loggedIn,
            authToken: firstToken,
        });
        // when
        sessionStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
        // then
        const sessionStoreState = sessionStore.getState();
        const username = sessionStoreState.username;
        const envUrl = sessionStoreState.envUrl;
        const rememberMeFlag = sessionStoreState.isRememberMeOn;
        const authToken = sessionStoreState.authToken;
        expect(username).toBe(givenUsername);
        expect(envUrl).toBe(givenEnvUrl);
        expect(rememberMeFlag).toBe(true);
        expect(authToken).toBeUndefined();
    });
});
