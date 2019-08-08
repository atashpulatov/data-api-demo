import {actionCreator} from '../../src/notification/action-creator';
import {reduxNotificationProperties} from '../../src/notification/notification-properties';

describe('Action Creator', () => {
  it('should return action for showMessageAction', () => {
    // given
    const testContent = 'some content';
    const testMessageType = 'info';
    const expectedCurrentObject = 'message';
    const expectedType = reduxNotificationProperties.actions.showMessage;
    // when
    const action = actionCreator.showMessageAction(testContent, testMessageType);
    // then
    expect(action.content).toBe(testContent);
    expect(action.messageType).toBe(testMessageType);
    expect(action.currentObject).toEqual(expectedCurrentObject);
    expect(action.type).toBe(expectedType);
  });
  it('should return action for showNotificationAction', () => {
    // given
    const testTitle = 'some title';
    const testContent = 'some content';
    const testMessageType = 'error';
    const expectedCurrentObject = 'notification';
    const expectedType = reduxNotificationProperties.actions.showNotification;
    const expectedDetails = 'response';
    // when
    const action = actionCreator.showNotificationAction(testTitle, testContent, testMessageType, expectedDetails);
    // then
    expect(action.content).toBe(testContent);
    expect(action.notificationType).toBe(testMessageType);
    expect(action.currentObject).toEqual(expectedCurrentObject);
    expect(action.type).toBe(expectedType);
    expect(action.details).toBe(expectedDetails);
  });
  it('should return action for showTranslatedNotificationAction', () => {
    // given
    const testTitle = 'some title';
    const testContent = 'some content';
    const testMessageType = 'error';
    const expectedCurrentObject = 'notification';
    const expectedType = reduxNotificationProperties.actions.showTranslatedNotification;
    const expectedDetails = 'response';
    // when
    const action = actionCreator.showTranslatedNotification(testTitle, testContent, testMessageType, expectedDetails);
    // then
    expect(action.content).toBe(testContent);
    expect(action.notificationType).toBe(testMessageType);
    expect(action.currentObject).toEqual(expectedCurrentObject);
    expect(action.type).toBe(expectedType);
    expect(action.details).toBe(expectedDetails);
  });
});
