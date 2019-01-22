import { messageProperties, notificationProperties, reduxNotificationProperties } from '../../src/notification/notification-properties';
import { notificationService } from '../../src/notification/notification-service';
import { actionCreator } from '../../src/notification/action-creator';
import { reduxStore } from '../../src/store';

jest.mock('../../src/notification/action-creator');
jest.mock('../../src/store');

describe('NotificationService', () => {
    it('should dispatch redux action to display message', () => {
        // given
        const testType = messageProperties.success;
        const testContent = 'test content';
        const mockedAction = {
            type: reduxNotificationProperties.actions.showMessage,
            content: testContent,
            messageType: testType,
            currentObject: 'message',
        };
        actionCreator.showMessageAction = jest.fn().mockImplementation(() => {
            return mockedAction;
        });
        // when
        notificationService.displayMessage(testType, testContent);
        // then
        expect(actionCreator.showMessageAction).toBeCalled();
        expect(actionCreator.showMessageAction).toBeCalledWith(testContent, testType);
        expect(reduxStore.dispatch).toBeCalled();
        expect(reduxStore.dispatch).toBeCalledWith(mockedAction);
    });
    it('should dispatch redux action to display notification', () => {
        // given
        const testType = notificationProperties.success;
        const testTitle = 'test title';
        const testContent = 'test content';
        const mockedAction = {
            type: reduxNotificationProperties.actions.showNotification,
            title: testTitle,
            content: testContent,
            messageType: testType,
            currentObject: 'notification',
        };
        actionCreator.showNotificationAction = jest.fn().mockImplementation(() => {
            return mockedAction;
        });
        // when
        notificationService.displayNotification(testType, testTitle, testContent);
        // then
        expect(actionCreator.showNotificationAction).toBeCalled();
        expect(actionCreator.showNotificationAction).toBeCalledWith(testTitle, testContent, testType);
        expect(reduxStore.dispatch).toBeCalled();
        expect(reduxStore.dispatch).toBeCalledWith(mockedAction);
    });
});
