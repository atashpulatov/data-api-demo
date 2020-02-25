import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { message } from 'antd';
import { NotificationsNotConnected, Notifications } from '../../notification/notifications';
import { actionCreator } from '../../notification/action-creator';
import { reduxStore } from '../../store';

jest.mock('antd');

describe('Notifications', () => {
  it('should return empty component', () => {
    // given
    // when
    const wrappedComponent = mount(<NotificationsNotConnected />);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
  });
  it('should call displayMessage on redux state change', () => {
    // given
    const action = actionCreator.showMessageAction('Test', 'info', 'message');
    const wrappedComponent = mount(
      <Provider store={reduxStore}>
        <Notifications />
      </Provider>
    );
    const wrappedComponentAlone = wrappedComponent.find('NotificationsNotConnected');
    const spyMethod = jest.spyOn(wrappedComponentAlone.instance(), 'displayMessage');
    // when
    reduxStore.dispatch(action);
    wrappedComponent.update();
    // then
    expect(spyMethod).toBeCalled();
    expect(message.info).toBeCalled();
    expect(message.info).toBeCalledWith('Test');
  });
  it('should call displayNotification for error', () => {
    // given
    const action = actionCreator.showNotificationAction('Test title', 'Test content', 'error', 'message');
    const wrappedComponent = mount(
      <Provider store={reduxStore}>
        <Notifications />
      </Provider>
    );
    const wrappedComponentAlone = wrappedComponent.find('NotificationsNotConnected');
    const spyMethod = jest.spyOn(wrappedComponentAlone.instance(), 'displayNotification');
    // when
    reduxStore.dispatch(action);
    wrappedComponent.update();
    // then
    expect(spyMethod).toBeCalled();
  });
  it('should call displayNotification for warning', () => {
    // given
    const action = actionCreator.showNotificationAction('Test title', 'Test content', 'warning', 'message');
    const wrappedComponent = mount(
      <Provider store={reduxStore}>
        <Notifications />
      </Provider>
    );
    const wrappedComponentAlone = wrappedComponent.find('NotificationsNotConnected');
    const spyMethod = jest.spyOn(wrappedComponentAlone.instance(), 'displayNotification');
    // when
    reduxStore.dispatch(action);
    wrappedComponent.update();
    // then
    expect(spyMethod).toBeCalled();
  });
  it('should call displayNotification for success', () => {
    // given
    const action = actionCreator.showNotificationAction('Test title', 'Test content', 'success', 'message');
    const wrappedComponent = mount(
      <Provider store={reduxStore}>
        <Notifications />
      </Provider>
    );
    const wrappedComponentAlone = wrappedComponent.find('NotificationsNotConnected');
    const spyMethod = jest.spyOn(wrappedComponentAlone.instance(), 'displayNotification');
    // when
    reduxStore.dispatch(action);
    wrappedComponent.update();
    // then
    expect(spyMethod).toBeCalled();
  });
  it('should call displayNotification for info', () => {
    // given
    const action = actionCreator.showNotificationAction('Test title', 'Test content', 'info', 'message');
    const wrappedComponent = mount(
      <Provider store={reduxStore}>
        <Notifications />
      </Provider>
    );
    const wrappedComponentAlone = wrappedComponent.find('NotificationsNotConnected');
    const spyMethod = jest.spyOn(wrappedComponentAlone.instance(), 'displayNotification');
    // when
    reduxStore.dispatch(action);
    wrappedComponent.update();
    // then
    expect(spyMethod).toBeCalled();
  });
  it('should call displayNotification for wrong notification type', () => {
    // given
    const action = actionCreator.showNotificationAction('Test title', 'Test content', 'type', 'message');
    const wrappedComponent = mount(
      <Provider store={reduxStore}>
        <Notifications />
      </Provider>
    );
    const wrappedComponentAlone = wrappedComponent.find('NotificationsNotConnected');
    const spyMethod = jest.spyOn(wrappedComponentAlone.instance(), 'displayNotification');
    // when
    reduxStore.dispatch(action);
    wrappedComponent.update();
    // then
    expect(spyMethod).toBeCalled();
  });
});
