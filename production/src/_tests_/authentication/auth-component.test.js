import React from 'react';
import { mount } from 'enzyme';
import { AuthenticateNotConnected } from '../../authentication/auth-component';
import { reduxStore } from '../../store';
import { sessionProperties } from '../../redux-reducer/session-reducer/session-properties';

jest.mock('../../authentication/auth-rest-service');

describe('AuthComponent', () => {
  const location = {};

  beforeAll(() => {
    const origin = { pathname: '/' };
    const state = { origin };
    location.state = state;
  });

  beforeEach(() => {
    expect(reduxStore.getState().sessionReducer.authToken).toBeFalsy();
  });

  afterEach(() => {
    reduxStore.dispatch({ type: sessionProperties.actions.logOut, });
  });

  it('onLoginUser should be triggered on submit', () => {
    // given
    const history = { push: jest.fn(), };
    reduxStore.dispatch({
      type: sessionProperties.actions.logIn,
      values: {
        username: 'mstr',
        envUrl: 'env',
      },
    });
    const mockSession = {
      username: 'mstr',
      envUrl: 'env',
    };
    const mockEvent = { preventDefault: jest.fn(), };
    const mockForm = {
      getFieldDecorator: () => jest.fn(),
      validateFields: () => jest.fn(),
    };
    const mockMapping = jest.fn();
    const wrappedComponent = mount(
      <AuthenticateNotConnected
        history={history}
        session={mockSession}
        form={mockForm}
        resetState={mockMapping} />
    );
    const onLoginUserSpy = jest.spyOn(wrappedComponent.instance(), 'onLoginUser');
    const form = wrappedComponent.find('Form').at(0);
    // when
    form.instance().props.onSubmit(mockEvent);
    // then
    expect(onLoginUserSpy).toBeCalled();
    expect(onLoginUserSpy).toBeCalledWith(mockEvent);
    expect(mockMapping).toBeCalled();
  });
});
