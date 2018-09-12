/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { MenuBar } from '../../../../src/frontend/app/menu-bar/menu-bar.jsx';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { reduxStore } from '../../../../src/frontend/app/store';
/* eslint-enable */

jest.mock('../../../../src/frontend/app/store');

describe('menu bar', () => {
    beforeEach(() => {
        expect(reduxStore.dispatch).not.toBeCalled();
    });

    afterEach(() => {
        reduxStore.dispatch.mockClear();
    });

    it('should go up', () => {
        // given
        const barWrapper = mount(
            <MenuBar />
        );
        const buttons = barWrapper.find('button');
        const goBackButton = buttons.filterWhere((button) =>
            button.text().includes('Back')
        );
        expect(goBackButton).toBeTruthy();
        // when
        goBackButton.simulate('click');
        // then
        expect(reduxStore.dispatch).toBeCalled();
        expect(reduxStore.dispatch).toBeCalledWith({
            type: historyProperties.actions.goUp,
        });
    });

    it('should go to projects', () => {
        // given
        const barWrapper = mount(
            <MenuBar />
        );
        const buttons = barWrapper.find('button');
        const goTopButton = buttons.filterWhere((button) =>
            button.text().includes('Go top')
        );
        expect(goTopButton).toBeTruthy();
        // when
        goTopButton.simulate('click');
        // then
        expect(reduxStore.dispatch).toBeCalled();
        expect(reduxStore.dispatch).toBeCalledWith({
            type: historyProperties.actions.goToProjects,
        });
    });

    it('should log out', () => {
        // given
        const barWrapper = mount(
            <MenuBar />
        );
        const buttons = barWrapper.find('button');
        const logOutButton = buttons.filterWhere((button) =>
            button.text().includes('Log out')
        );
        expect(logOutButton).toBeTruthy();
        // when
        logOutButton.simulate('click');
        // then
        expect(reduxStore.dispatch).toBeCalled();
        expect(reduxStore.dispatch).toBeCalledWith({
            type: sessionProperties.actions.logOut,
        });
    });
});
