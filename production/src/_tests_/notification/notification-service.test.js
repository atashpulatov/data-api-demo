import {messageProperties, notificationProperties, reduxNotificationProperties} from '../../notification/notification-properties';
import {notificationService} from '../../notification/notification-service';
import {actionCreator} from '../../notification/action-creator';
import {reduxStore} from '../../store';

jest.mock('../../notification/action-creator');
jest.mock('../../store');

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
    const testDetails = 'text text';
    const mockedAction = {
      type: reduxNotificationProperties.actions.showNotification,
      title: testTitle,
      content: testContent,
      messageType: testType,
      currentObject: 'notification',
      details: testDetails,
    };
    actionCreator.showNotificationAction = jest.fn().mockImplementation(() => {
      return mockedAction;
    });
    // when
    notificationService.displayNotification(testType, testContent, testDetails, testTitle);
    // then
    expect(actionCreator.showNotificationAction).toBeCalled();
    expect(actionCreator.showNotificationAction).toBeCalledWith(testTitle, testContent, testType, testDetails);
    expect(reduxStore.dispatch).toBeCalled();
    expect(reduxStore.dispatch).toBeCalledWith(mockedAction);
  });
  it('should dispatch redux action to display translated notification', () => {
    // given
    const testType = notificationProperties.success;
    const testTitle = 'test title';
    const testContent = 'test content';
    const testDetails = 'text text';
    const mockedAction = {
      type: reduxNotificationProperties.actions.showTranslatedNotification,
      title: testTitle,
      content: testContent,
      messageType: testType,
      currentObject: 'notification',
      details: testDetails,
    };
    actionCreator.showTranslatedNotification = jest.fn().mockImplementation(() => {
      return mockedAction;
    });
    // when
    notificationService.displayTranslatedNotification(testType, testContent, testDetails, testTitle);
    // then
    expect(actionCreator.showTranslatedNotification).toBeCalled();
    expect(actionCreator.showTranslatedNotification).toBeCalledWith(testTitle, testContent, testType, testDetails);
    expect(reduxStore.dispatch).toBeCalled();
    expect(reduxStore.dispatch).toBeCalledWith(mockedAction);
  });
});
