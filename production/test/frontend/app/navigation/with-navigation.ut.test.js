/* eslint-disable */
import React from 'react';
import { reduxStore } from '../../../../src/frontend/app/store';
import { withNavigation } from '../../../../src/frontend/app/navigation/with-navigation';
import { _TestComponent } from './test-component';
import { navigationService } from '../../../../src/frontend/app/navigation/navigation-service';
import { NavigationError } from '../../../../src/frontend/app/navigation/navigation-error';
import { pathEnum } from '../../../../src/frontend/app/path-enum';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
/* eslint-enable */

jest.mock(
    '../../../../src/frontend/app/navigation/navigation-service'
);

describe('[ut] withNavigation w/ mocked navigationService', () => {
    /* eslint-disable */
    const ComponentWithNavigation = withNavigation(_TestComponent);
    /* eslint-enable */

    beforeEach(() => {
        expect(reduxStore.getState().sessionReducer.envUrl).toBeFalsy();
        expect(reduxStore.getState().sessionReducer.authToken).toBeFalsy();
    });

    afterEach(() => {
        reduxStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
    });

    it('should not pass history props to wrapped component', () => {
        // given
        const testComponentPath = {
            pathname: pathEnum[0].pathName,
        };
        navigationService.getNavigationRoute
            .mockReturnValue(testComponentPath);
        const history = {
            push: jest.fn(),
        };
        // when
        const wrappedProvider = mount(
            <Provider store={reduxStore}>
                <ComponentWithNavigation history={history} />
            </Provider>);
        // then
        const wrappedConnect = wrappedProvider.childAt(0);
        const wrappedWithNavigation = wrappedConnect.childAt(0);
        const wrappedComponent = wrappedWithNavigation.childAt(0);
        expect(wrappedWithNavigation.props().history).toBe(history);
        expect(wrappedComponent.props().history).toBeUndefined();
    });

    it('should renavigate to root component', () => {
        // given
        const rootComponentPath = {
            pathname: '/',
        };
        navigationService.getNavigationRoute
            .mockReturnValue(rootComponentPath);
        const history = {
            push: jest.fn(),
        };
        // when
        mount(
            <Provider store={reduxStore}>
                <ComponentWithNavigation history={history} />
            </Provider>);
        // then
        expect(history.push).toBeCalled();
        expect(history.push).toBeCalledWith(rootComponentPath);
    });

    it('should throw navigation error \
    when wrapped component does not match anything from path enum.', () => {
            // given
            const testComponentPath = {
                pathname: '/test',
            };
            navigationService.getNavigationRoute
                .mockReturnValue(testComponentPath);
            // when
            const wrongMount = () => {
                mount(
                    <Provider store={reduxStore}>
                        <ComponentWithNavigation />
                    </Provider>);
            };
            // then
            expect(wrongMount).toThrowError(NavigationError);
            expect(wrongMount)
                .toThrowError(`Component '${testComponentPath.pathname}'`
                    + ` is not defined in routes.`);
        });

    it('should re-navigate \
    when wrapped component doesn\'t match current proper component.', () => {
            // given
            const testComponentPath = {
                pathname: pathEnum[0].pathName,
            };
            navigationService.getNavigationRoute
                .mockReturnValue(testComponentPath);
            const history = {
                push: jest.fn(),
            };
            // when
            mount(
                <Provider store={reduxStore}>
                    <ComponentWithNavigation history={history} />
                </Provider>);
            // then
            expect(history.push).toBeCalled();
            expect(history.push).toBeCalledWith(testComponentPath);
        });

    it('should NOT re-navigate \
    when wrapped component matches current proper component', () => {
            const originalComponent = pathEnum[0].component;
            try {
                // given
                pathEnum[0].component = 'TestComponent';
                const testComponentPath = {
                    pathname: pathEnum[0].pathName,
                };
                navigationService.getNavigationRoute
                    .mockReturnValue(testComponentPath);
                const history = {
                    push: jest.fn(),
                };
                // when
                mount(
                    <Provider store={reduxStore}>
                        <ComponentWithNavigation history={history} />
                    </Provider>);
                // then
                expect(history.push).not.toBeCalled();
            } finally {
                pathEnum[0].component = originalComponent;
            }
        });

    it('should re-navigate when project changed', async () => {
        // given
        const testComponentPath = {
            pathname: pathEnum[0].pathName,
        };
        navigationService.getNavigationRoute
            .mockReturnValue(testComponentPath);
        const history = {
            push: jest.fn(),
        };
        mount(
            <Provider store={reduxStore}>
                <ComponentWithNavigation history={history} />
            </Provider>);
        expect(history.push).toHaveBeenCalledTimes(1);
        // when
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: 'projectId',
            projectName: 'projectName',
        });
        // then
        expect(history.push).toHaveBeenCalledTimes(2);
    });

    it('should renavigate on token changed', () => {
        // given
        const history = {
            push: jest.fn(),
        };
        reduxStore.dispatch({
            type: sessionProperties.actions.logIn,
            username: 'user',
            envUrl: 'env',
            isRememberMeOn: true,
        });
        mount(
            <Provider store={reduxStore}>
                <ComponentWithNavigation history={history} />
            </Provider>);
        expect(history.push).toHaveBeenCalledTimes(1);
        // when
        reduxStore.dispatch({
            type: sessionProperties.actions.loggedIn,
            authToken: 'token',
        });
        // then
        expect(history.push).toHaveBeenCalledTimes(2);
    });
});
