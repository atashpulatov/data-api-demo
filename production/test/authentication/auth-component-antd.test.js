/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { Authenticate, _Authenticate } from '../../src/authentication/auth-component.jsx';
import { reduxStore } from '../../src/store';
import { sessionProperties } from '../../src/storage/session-properties';
import { authenticationService } from '../../src/authentication/auth-rest-service';
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
      envUrl: 'env',
    });
    const component = mount(<Authenticate history={history} />);
    component.setState({
      username: 'test',
    });
    component.instance().setState({ username: 'test' });
    component.update();
    console.log(component.instance().state);
    const form = component.find('form');
    // when
    form.simulate('submit');
    // then
    setTimeout(() => {
      try {
        expect(reduxStore.getState().sessionReducer.authToken).toBeDefined();
        done();
      } catch (e) {
        done.fail(e);
      }
    }, 100);
  });
});
