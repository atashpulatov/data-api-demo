import { notificationReducer } from '../../notification/reducer';
import { NotificationError } from '../../notification/notification-error';
import { reduxNotificationProperties } from '../../notification/notification-properties';

describe('Notification reducer', () => {
  it('should do nothing on not matching action and empty state', () => {
    // given
    const emptyAction = {
      type: 'notMatching',
    };
    // when
    const resultState = notificationReducer(undefined, emptyAction);
    // then
    expect(resultState).toEqual({});
  });

  it('should throw error on missing type', () => {
    // given
    // currentObject
    // content
    // messageType
    const action = {
      currentObject: 'testObject',
      content: 'testContent',
      messageType: 'someMessageType',
    };
    // when
    const throwingCall = () => notificationReducer(undefined, action);
    // then
    expect(throwingCall).toThrowError(NotificationError);
    expect(throwingCall).toThrowError('Missing type');
  });

  describe('message type', () => {
    const type = reduxNotificationProperties.actions.showMessage;
    it('should throw error on missing currentObject', () => {
      // given
      const action = {
        type,
        content: 'testContent',
        messageType: 'someMessageType',
      };
      // when
      const throwingCall = () => notificationReducer(undefined, action);
      // then
      expect(throwingCall).toThrowError(NotificationError);
      expect(throwingCall).toThrowError('Missing currentObject');
    });
    it('should throw error on missing content', () => {
      // given
      const action = {
        type,
        currentObject: 'testObject',
        messageType: 'someMessageType',
      };
      // when
      const throwingCall = () => notificationReducer(undefined, action);
      // then
      expect(throwingCall).toThrowError(NotificationError);
      expect(throwingCall).toThrowError('Missing content');
    });
    it('should throw error on missing messageType', () => {
      // given
      const action = {
        type,
        currentObject: 'testObject',
        content: 'testContent',
      };
      // when
      const throwingCall = () => notificationReducer(undefined, action);
      // then
      expect(throwingCall).toThrowError(NotificationError);
      expect(throwingCall).toThrowError('Missing messageType');
    });
    it('should return proper state for message', () => {
      // given
      const action = {
        type,
        currentObject: 'testObject',
        content: 'testContent',
        messageType: 'someMessageType',
      };
      // when
      const resultState = notificationReducer(undefined, action);
      // then
      expect(resultState.content).toEqual(action.content);
      expect(resultState.currentObject).toEqual(action.currentObject);
      expect(resultState.messageType).toEqual(action.messageType);
      expect(resultState.timeStamp).toBeDefined();
      expect(resultState.timeStamp).toBeTruthy();
    });
  });

  describe('notification type', () => {
    const type = reduxNotificationProperties.actions.showNotification;
    it('should throw error on missing currentObject', () => {
      // given
      const action = {
        type,
        title: 'testTitle',
        content: 'testContent',
        notificationType: 'someNotificationType',
      };
      // when
      const throwingCall = () => notificationReducer(undefined, action);
      // then
      expect(throwingCall).toThrowError(NotificationError);
      expect(throwingCall).toThrowError('Missing currentObject');
    });
    it('should throw error on missing content', () => {
      // given
      const action = {
        type,
        title: 'testTitle',
        notificationType: 'someNotificationType',
        currentObject: 'notification',
      };
      // when
      const throwingCall = () => notificationReducer(undefined, action);
      // then
      expect(throwingCall).toThrowError(NotificationError);
      expect(throwingCall).toThrowError('Missing content');
    });
    it('should throw error on missing messageType', () => {
      // given
      const action = {
        type,
        title: 'testTitle',
        content: 'testContent',
        currentObject: 'notification',
      };
      // when
      const throwingCall = () => notificationReducer(undefined, action);
      // then
      expect(throwingCall).toThrowError(NotificationError);
      expect(throwingCall).toThrowError('Missing notificationType');
    });

    it('should throw error on missing title', () => {
      // given
      const action = {
        type,
        content: 'testContent',
        notificationType: 'someNotificationType',
        currentObject: 'notification',
      };
      // when
      const throwingCall = () => notificationReducer(undefined, action);
      // then
      expect(throwingCall).toThrowError(NotificationError);
      expect(throwingCall).toThrowError('Missing title');
    });
    it('should return proper state for message', () => {
      // given
      const action = {
        type,
        title: 'testTitle',
        content: 'testContent',
        notificationType: 'someNotificationType',
        currentObject: 'notification',
        details: 'testDetails',
      };
      // when
      const resultState = notificationReducer(undefined, action);
      // then
      expect(resultState.title).toEqual(action.title);
      expect(resultState.content).toEqual(action.content);
      expect(resultState.currentObject).toEqual(action.currentObject);
      expect(resultState.messageType).toEqual(action.messageType);
      expect(resultState.details).toEqual(action.details);
      expect(resultState.timeStamp).toBeDefined();
      expect(resultState.timeStamp).toBeTruthy();
    });
  });

  describe('translated notification type', () => {
    const type = reduxNotificationProperties.actions.showTranslatedNotification;
    it('should throw error on missing currentObject', () => {
      // given
      const action = {
        type,
        title: 'testTitle',
        content: 'testContent',
        notificationType: 'someNotificationType',
      };
      // when
      const throwingCall = () => notificationReducer(undefined, action);
      // then
      expect(throwingCall).toThrowError(NotificationError);
      expect(throwingCall).toThrowError('Missing currentObject');
    });
    it('should throw error on missing content', () => {
      // given
      const action = {
        type,
        title: 'testTitle',
        notificationType: 'someNotificationType',
        currentObject: 'notification',
      };
      // when
      const throwingCall = () => notificationReducer(undefined, action);
      // then
      expect(throwingCall).toThrowError(NotificationError);
      expect(throwingCall).toThrowError('Missing content');
    });
    it('should throw error on missing messageType', () => {
      // given
      const action = {
        type,
        title: 'testTitle',
        content: 'testContent',
        currentObject: 'notification',
      };
      // when
      const throwingCall = () => notificationReducer(undefined, action);
      // then
      expect(throwingCall).toThrowError(NotificationError);
      expect(throwingCall).toThrowError('Missing notificationType');
    });

    it('should throw error on missing title', () => {
      // given
      const action = {
        type,
        content: 'testContent',
        notificationType: 'someNotificationType',
        currentObject: 'notification',
      };
      // when
      const throwingCall = () => notificationReducer(undefined, action);
      // then
      expect(throwingCall).toThrowError(NotificationError);
      expect(throwingCall).toThrowError('Missing title');
    });
    it('should return proper state for message', () => {
      // given
      const action = {
        type,
        title: 'testTitle',
        content: 'testContent',
        notificationType: 'someNotificationType',
        currentObject: 'notification',
        details: 'testDetails',
      };
      // when
      const resultState = notificationReducer(undefined, action);
      // then
      expect(resultState.title).toEqual(action.title);
      expect(resultState.content).toEqual(action.content);
      expect(resultState.currentObject).toEqual(action.currentObject);
      expect(resultState.messageType).toEqual(action.messageType);
      expect(resultState.details).toEqual(action.details);
      expect(resultState.timeStamp).toBeDefined();
      expect(resultState.timeStamp).toBeTruthy();
    });
  });
});
