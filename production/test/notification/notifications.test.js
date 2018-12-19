import React from 'react';
import { mount } from 'enzyme';
import { NotificationsWithoutRedux, Notifications } from '../../src/notification/notifications';
import { actionCreator } from '../../src/notification/action-creator';
import { Provider } from 'react-redux';
import { reduxStore } from '../../src/store';
import { message, notification } from 'antd';

jest.mock('antd');

describe('Notifications', () => {
    it('should return empty component', () => {
        // given
        // when
        const wrappedComponent = mount(<NotificationsWithoutRedux />);
        // then
        expect(wrappedComponent.instance()).toBeDefined();
    });
    it('should call displayMessage on redux state change', () => {
        // given
        const action = actionCreator.showMessageAction('Test', 'info', 'message');
        const wrappedComponent = mount(
            <Provider store={reduxStore}>
                <Notifications />
            </Provider>);
        const wrappedComponentAlone = wrappedComponent.find('NotificationsWithoutRedux');
        const spyMethod = jest.spyOn(wrappedComponentAlone.instance(), 'displayMessage');
        // when
        reduxStore.dispatch(action);
        wrappedComponent.update();
        // then
        expect(spyMethod).toBeCalled();
        expect(message.info).toBeCalled();
        expect(message.info).toBeCalledWith('Test');
    });
    it('should call displayNotification on redux state change', () => {
        // given
        const action = actionCreator.showNotificationAction('Test title', 'Test content', 'error', 'message');
        const wrappedComponent = mount(
            <Provider store={reduxStore}>
                <Notifications />
            </Provider>);
        const wrappedComponentAlone = wrappedComponent.find('NotificationsWithoutRedux');
        const spyMethod = jest.spyOn(wrappedComponentAlone.instance(), 'displayNotification');
        const expectedCallArgument = {
            description: 'Test content',
            message: 'Test title'
        };
        // when
        reduxStore.dispatch(action);
        wrappedComponent.update();
        // then
        expect(spyMethod).toBeCalled();
        expect(notification.error).toBeCalled();
        expect(notification.error).toBeCalledWith(expectedCallArgument);
    });
});