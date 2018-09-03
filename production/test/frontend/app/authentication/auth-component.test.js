/* eslint-disable */
import React from 'react';
import { shallow, mount } from 'enzyme';
import { Authenticate } from '../../../../src/frontend/app/authentication/auth-component.jsx';
import { reduxStore } from '../../../../src/frontend/app/store';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { authenticationService } from '../../../../src/frontend/app/authentication/auth-rest-service';
/* eslint-enable */

jest.mock('../../../../src/frontend/app/authentication/auth-rest-service');

describe('AuthComponent', () => {
    const location = {};

    beforeAll(() => {
        const origin = { pathname: '/' };
        const state = { origin: origin };
        location.state = state;
    });

    beforeEach(() => {
        expect(reduxStore.getState().sessionReducer.envUrl).toBeFalsy();
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
        const component = mount(<Authenticate history={history} />);
        const form = component.find('form');
        // when
        form.simulate('submit');
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

    it('should render my component', () => {
        // when
        const component = shallow(<Authenticate location={location} />);
        // then
        expect(component.getElements()).toMatchSnapshot();
    });
});
