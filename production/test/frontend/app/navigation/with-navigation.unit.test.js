/* eslint-disable */
import React from 'react';
import { reduxStore } from '../../../../src/frontend/app/store';
import { shallow } from 'enzyme';
import { withNavigation } from '../../../../src/frontend/app/navigation/with-navigation';
import { TestComponent } from './test-component';
import { navigationService } from '../../../../src/frontend/app/navigation/navigation-service';
import { NavigationError } from '../../../../src/frontend/app/navigation/navigation-error';
import { pathEnum } from '../../../../src/frontend/app/path-enum';
/* eslint-enable */

jest.mock(
    '../../../../src/frontend/app/navigation/navigation-service'
);

describe('[ut] withNavigation w/ mocked navigationService', () => {
    /* eslint-disable */
    const ComponentWithNavigation = withNavigation(TestComponent);
    /* eslint-enable */

    beforeEach(() => {
        expect(reduxStore.getState().sessionReducer.envUrl).toBeFalsy();
        expect(reduxStore.getState().sessionReducer.authToken).toBeFalsy();
    });

    /**
     * Wrapped component does not match anything from path enum.
     * NavigationError expected.
     */
    it('should throw navigation error', () => {
        // given
        const testComponentPath = {
            pathname: '/test',
        };
        navigationService.getNavigationRoute
            .mockReturnValue(testComponentPath);
        // when
        const wrongMount = () => {
            shallow(<ComponentWithNavigation history={history} />);
        };
        // then
        expect(wrongMount).toThrowError(NavigationError);
        expect(wrongMount)
            .toThrowError(`Component '${testComponentPath.pathname}'`
                + ` is not defined in routes.`);
    });

    /**
     * Wrapped component doesn't match current proper component,
     * it should renavigate.
     */
    it('should re-navigate', () => {
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
        shallow(<ComponentWithNavigation history={history} />);
        // then
        expect(history.push).toBeCalled();
        expect(history.push).toBeCalledWith(testComponentPath);
    });

    /**
     * Wrapped component matches current proper component,
     * it should not renavigate.
     */
    it('should NOT re-navigate', () => {
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
            shallow(<ComponentWithNavigation history={history} />);
            // then
            expect(history.push).not.toBeCalled();
        } finally {
            pathEnum[0].component = originalComponent;
        }
    });
});
