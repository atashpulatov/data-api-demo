/* eslint-disable */
import React from 'react';
import { reduxStore } from '../../src/store';
import { withNavigation } from '../../src/navigation/with-navigation';
import { TestComponent } from './test-component';
import { navigationService } from '../../src/navigation/navigation-service';
import { NavigationError } from '../../src/navigation/navigation-error';
import { pathEnum } from '../../src/home/path-enum';
import { historyProperties } from '../../src/history/history-properties';
import { sessionProperties } from '../../src/storage/session-properties';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
/* eslint-enable */

describe.skip('[it] withNavigation', () => {
    /* eslint-disable */
    const ComponentWithNavigation = withNavigation(TestComponent);
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

    it('should throw navigation error \
    when wrapped component does not match anything from path enum.', () => {
            // given
            const testComponentPath = {
                pathname: '/test',
            };
            // when
            const wrongMount = () => {
                mount(
                    <Provider store={reduxStore}>
                        <ComponentWithNavigation history={history} />
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

    it('should re-navigate \
    when (some) redux state changed', async () => {
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
});
