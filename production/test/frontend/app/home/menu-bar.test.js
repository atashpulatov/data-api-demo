/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { _MenuBar } from '../../../../src/frontend/app/menu-bar/menu-bar.jsx';
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
        const barWrapper = mount(<_MenuBar project='testProject' />);
        const goBackButton = barWrapper.find('#goBack');
        expect(goBackButton).toHaveLength(1);
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
            <_MenuBar project='testProject' />
        );
        const goTopButton = barWrapper.find('#goTop');
        expect(goTopButton).toHaveLength(1);
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
            <_MenuBar project='testProject' />
        );
        const logOutButton = barWrapper.find('#logOut');
        expect(logOutButton).toHaveLength(1);
        // when
        logOutButton.simulate('click');
        // then
        expect(reduxStore.dispatch).toBeCalled();
        expect(reduxStore.dispatch).toBeCalledWith({
            type: sessionProperties.actions.logOut,
        });
    });

    it('should not render component if project is not set', () => {
        // given
        // when
        const barWrapper = mount(
            <_MenuBar />
        );
        // then
        expect(barWrapper.html()).toBeNull();
    });
    it.skip('should display component when redux state changes', () => {
        expect(true).toBeFalsy();
    });
    it.skip('should hide component when redux state changes', () => {
        expect(true).toBeFalsy();
    });
});

const prepareReduxStore = () => {
    reduxStore.dispatch({
        type: sessionProperties.actions.logIn,
        envUrl: 'testUrl',
        username: 'testUsername',
    });
    reduxStore.dispatch({
        type: sessionProperties.actions.loggedIn,
        authToken: 'testAuthToken',
    });
    reduxStore.dispatch({
        type: historyProperties.actions.goInsideProject,
        projectId: 'someProjectId',
        projectName: 'someProjectName',
    });
};
