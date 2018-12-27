/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { Authenticate, _Authenticate } from '../../src/authentication/auth-component.jsx';
import { reduxStore } from '../../src/store';
import { sessionProperties } from '../../src/storage/session-properties';
import { authenticationService } from '../../src/authentication/auth-rest-service';
import { Provider } from 'react-redux';
/* eslint-enable */

jest.mock('../../src/authentication/auth-rest-service');

describe('AuthComponent', () => {
    const location = {};

    beforeAll(() => {
        const origin = { pathname: '/' };
        const state = { origin: origin };
        location.state = state;
    });

    beforeEach(() => {
        expect(reduxStore.getState().sessionReducer.authToken).toBeFalsy();
    });

    afterEach(() => {
        reduxStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
    });

    it('should update redux state on login', (done) => {
        // given
        authenticationService.authenticate.mockResolvedValue('token');
        const history = {
            push: jest.fn(),
        };
        reduxStore.dispatch({
            type: sessionProperties.actions.logIn,
            username: 'user',
            envUrl: 'env',
            isRememberMeOn: true,
        });
        const component = mount(
            <Provider store={reduxStore}>
                <Authenticate history={history} />
            </Provider>);
        const form = component.find('form');
        // when
        form.simulate('submit');
        // then
        setTimeout(() => {
            try {
                expect(reduxStore.getState().sessionReducer.authToken)
                    .toBeDefined();
                done();
            } catch (e) {
                done.fail(e);
            }
        }, 100);
    });

    it('should be wrapped w/ withNavigation HOC', () => {
        // given
        const history = {
            push: jest.fn(),
        };
        // when
        const wrappedProvider = mount(
            <Provider store={reduxStore}>
                <Authenticate history={history} />
            </Provider>);
        // then
        const wrappedConnect = wrappedProvider.childAt(0);
        const wrappedWithNavigation = wrappedConnect.childAt(0);
        const wrappedComponentForm = wrappedWithNavigation.childAt(0);
        const wrappedComponent = wrappedComponentForm.childAt(0);
        expect(
            wrappedComponent.type().prototype instanceof React.Component
        ).toBeTruthy();
        expect(
            _Authenticate.prototype.isPrototypeOf(wrappedComponent.instance())
        );
    });
});
