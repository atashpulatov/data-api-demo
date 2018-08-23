/* eslint-disable */
import React from "react";
import { HashRouter as Router } from "react-router-dom";
import { mount } from "enzyme";
import { MenuBar } from "../../../../src/frontend/app/menu-bar";
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
import { sessionProperties } from "../../../../src/frontend/app/storage/session-properties";
/* eslint-enable */

const goUpObject = {
    pathname: '/',
    historyObject: {},
};
goUpObject.historyObject[historyProperties.command] =
    historyProperties.actions.goUp;

const goProjectsObject = {
    pathname: '/',
    historyObject: {},
};
goProjectsObject.historyObject[historyProperties.command] =
    historyProperties.actions.goToProjects;

const logOutObject = {
    pathname: '/',
    historyObject: {},
};
logOutObject.historyObject[historyProperties.command] =
    sessionProperties.actions.logOut;

describe('menu bar', () => {
    const realPushHistory = MenuBar.WrappedComponent.prototype.pushHistory;

    beforeEach(() => {
        MenuBar.WrappedComponent.prototype.pushHistory = jest.fn();
    });

    afterAll(() => {
        MenuBar.WrappedComponent.prototype.pushHistory = realPushHistory;
    });

    it('should go up', () => {
        // given
        const barWrapper = mount(
            <Router >
                <MenuBar />
            </Router>
        );
        const buttons = barWrapper.find('button');
        const goBackButton = buttons.filterWhere((button) =>
            button.text().includes('Back')
        );
        // when
        goBackButton.simulate('click');
        // then
        expect(goBackButton).toBeTruthy();
        expect(MenuBar.WrappedComponent.prototype.pushHistory).toBeCalled();
        expect(MenuBar.WrappedComponent.prototype.pushHistory)
            .toBeCalledWith(goUpObject, expect.anything());
    });

    it('should go to projects', () => {
        // given
        const barWrapper = mount(
            <Router >
                <MenuBar />
            </Router>
        );
        const buttons = barWrapper.find('button');
        const goTopButton = buttons.filterWhere((button) =>
            button.text().includes('Go top')
        );
        // when
        goTopButton.simulate('click');
        // then
        expect(goTopButton).toBeTruthy();
        expect(MenuBar.WrappedComponent.prototype.pushHistory).toBeCalled();
        expect(MenuBar.WrappedComponent.prototype.pushHistory)
            .toBeCalledWith(goProjectsObject, expect.anything());
    });

    it('should log out', () => {
        // given
        const barWrapper = mount(
            <Router >
                <MenuBar />
            </Router>
        );
        const buttons = barWrapper.find('button');
        const logOutButton = buttons.filterWhere((button) =>
            button.text().includes('Log out')
        );
        // when
        logOutButton.simulate('click');
        // then
        expect(logOutButton).toBeTruthy();
        expect(MenuBar.WrappedComponent.prototype.pushHistory).toBeCalled();
        expect(MenuBar.WrappedComponent.prototype.pushHistory)
            .toBeCalledWith(logOutObject, expect.anything());
    });
});
