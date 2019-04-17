import React from 'react';
import {mount} from 'enzyme';
import {Authenticate, _Authenticate} from '../../src/authentication/auth-component.jsx';
import {reduxStore} from '../../src/store';
import {sessionProperties} from '../../src/storage/session-properties';
import {authenticationService} from '../../src/authentication/auth-rest-service';

jest.mock('../../src/authentication/auth-rest-service');

describe('AuthComponent', () => {
  const location = {};

  beforeAll(() => {
    const origin = {pathname: '/'};
    const state = {origin: origin};
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

  it('onLoginUser should be triggered on submit', () => {
    // given
    const history = {
      push: jest.fn(),
    };
    reduxStore.dispatch({
      type: sessionProperties.actions.logIn,
      values: {
        envUrl: 'env',
      },
    });
    const mockEvent = {
      preventDefault: jest.fn(),
    };
    const mockForm = {
      getFieldDecorator: () => jest.fn(),
      validateFields: () => jest.fn(),
    };
    const wrappedComponent = mount(<_Authenticate history={history} form={mockForm} />);
    const onLoginUserSpy = jest.spyOn(wrappedComponent.instance(), 'onLoginUser');
    const form = wrappedComponent.find('Form').at(0);
    // when
    form.instance().props.onSubmit(mockEvent);
    // then
    expect(onLoginUserSpy).toBeCalled();
    expect(onLoginUserSpy).toBeCalledWith(mockEvent);
  });
});
