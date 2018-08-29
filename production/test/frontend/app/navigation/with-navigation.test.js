/* eslint-disable */
import React from 'react';
import { reduxStore } from "../../../../src/frontend/app/store";
import { shallow, mount } from 'enzyme';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { withNavigation } from '../../../../src/frontend/app/navigation/with-navigation';
import { TestComponent } from './test-component';
/* eslint-enable */


describe('withNavigation', () => {
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

    it('should navigate to /authenticate if no authToken', () => {
        // given
        const authPath = {
            pathname: '/',
        };
        const history = {
            push: jest.fn(),
        };
        // when
        mount(<ComponentWithNavigation history={history} />);
        // then
        expect(history.push).toBeCalled();
        expect(history.push).toBeCalledWith(authPath);
    });

    describe('when logged in', () => {
        const sampleEnvUrl = 'someEnvUrl';
        const sampleAuthToken = 'someAuthToken';
        const sampleUsername = 'someUsername';

        beforeEach(() => {
            reduxStore.dispatch({
                type: sessionProperties.actions.logIn,
                username: sampleUsername,
                envUrl: sampleEnvUrl,
                isRememberMeOn: false,
            });
            reduxStore.dispatch({
                type: sessionProperties.actions.loggedIn,
                authToken: sampleAuthToken,
            });
        });

        it('should navigate to path obtained from navigation service', () => {
            // given
            const mockPath = {
                pathname: 'path',
            };
            const mockObtainPath = jest.fn()
                .mockResolvedValue(mockPath);
            const history = {
                push: jest.fn(),
            };
            const componentWrapper = mount(<ComponentWithNavigation
                history={history} />);

            componentWrapper.instance().navigationService = {
                obtainPath: mockObtainPath,
            };
            componentWrapper.update();
            // when
            componentWrapper.instance().navigateToProperComponent();
            // then
            expect(history.push).toBeCalled();
            expect(history.push).toBeCalledWith(mockPath);
        });
    }
    );
});
