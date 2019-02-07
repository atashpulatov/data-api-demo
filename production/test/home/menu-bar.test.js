/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { _MenuBar } from '../../src/menu-bar/menu-bar.jsx';
import { historyProperties } from '../../src/history/history-properties';
import { sessionProperties } from '../../src/storage/session-properties';
import { reduxStore } from '../../src/store';
import { authenticationService } from '../../src/authentication/auth-rest-service.js';
import { sessionHelper } from '../../src/storage/session-helper.js';
/* eslint-enable */

jest.spyOn(reduxStore, 'dispatch');

describe('menu bar', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should log out', async () => {
        // given
        reduxStore.dispatch({
            type: sessionProperties.actions.logIn,
            envUrl: 'testUrl',
            username: 'testUsername',
        });
        reduxStore.dispatch({
            type: sessionProperties.actions.loggedIn,
            authToken: 'testAuthToken',
        });
        const barWrapper = mount(
            <_MenuBar project='testProject' />
        );
        const logOutButton = barWrapper.find('#logOut');
        expect(logOutButton).toHaveLength(1);
        jest.spyOn(authenticationService, 'logout').mockResolvedValue({});
        reduxStore.dispatch.mockClear();
        // when
        logOutButton.simulate('click');
        await Promise.resolve();
        // then
        expect(reduxStore.dispatch).toBeCalled();
        expect(reduxStore.dispatch).toBeCalledTimes(1);
        expect(reduxStore.dispatch).toBeCalledWith({
            type: sessionProperties.actions.logOut,
        });
    });
});
