import {
  CREATE_NOTIFICATION, notificationReducer, UPDATE_NOTIFICATION, DELETE_NOTIFICATION
} from '../../notification-v2/notification-reducer';

describe('Notification reducer', () => {
  const initialState = {
    empty: { notifications: [] },
    singleWarning: {
      notifications: [
        {
          objectWorkingId: 'someId1',
          type: 'warning',
          details: 'some details'
        }
      ]
    },
    singleImport: {
      notifications: [
        {
          objectWorkingId: 'someId1',
          type: 'import',
          percentageComplete: 30,
        }
      ]
    },
    multiple: {
      notifications: [
        {
          objectWorkingId: 'someId1',
          type: 'cleared',
        },
        {
          objectWorkingId: 'someId2',
          type: 'import',
          details: 'some details'
        },
        {
          objectWorkingId: 'someId3',
          type: 'import',
          percentageComplete: 30,
        },
      ]
    }
  };

  it('should get default state if one is not provided', () => {
    // given
    const action = {};
    // when
    const resultState = notificationReducer(undefined, action);
    // then
    expect(resultState).toEqual({ notifications: [] });
  });

  describe('create', () => {
    it('should return the same state if type is not matched', () => {
      // given
      const notHandledAction = {
        type: 'some type',
        payload: 'some payload',
      };

      // when
      const resultState = notificationReducer(initialState.multiple, notHandledAction);

      // then
      expect(resultState).toBe(initialState.multiple);
    });

    it('should add new notification to empty reducer', () => {
      // given
      const exampleNotification = {
        objectWorkingId: 'someId23',
        type: 'import'
      };
      const action = {
        type: CREATE_NOTIFICATION,
        payload: exampleNotification
      };

      // when
      const resultState = notificationReducer(initialState.empty, action);

      // then
      expect(resultState).toEqual({ notifications: [exampleNotification] });
    });

    it('should add new notification to existing ones', () => {
      // given
      const exampleNotification = {
        objectWorkingId: 'someId23',
        type: 'import'
      };
      const action = {
        type: CREATE_NOTIFICATION,
        payload: exampleNotification
      };

      // when
      const resultState = notificationReducer(initialState.multiple, action);

      // then
      expect(resultState).toEqual({
        notifications: [
          ...initialState.multiple.notifications,
          exampleNotification]
      });
    });
  });

  describe('update', () => {
    it('should throw an error if objectWorkingId does not exist', () => {
      // given
      const wrongAction = {
        type: UPDATE_NOTIFICATION,
        payload: {
          objectWorkingId: 'someNonExistingId',
          percentageComplete: 90,
        },
      };

      // when
      const throwingCall = () => notificationReducer(initialState.multiple, wrongAction);

      // then
      expect(throwingCall).toThrow();
    });

    it('should update a notification when there is single one', () => {
      // given
      const updatedNotificationProps = {
        objectWorkingId: 'someId1',
        percentageComplete: 40,
      };
      const action = {
        type: UPDATE_NOTIFICATION,
        payload: updatedNotificationProps
      };
      const expectedState = {
        notifications: [{
          ...initialState.singleImport.notifications[0],
          ...updatedNotificationProps
        }]
      };

      // when
      const resultState = notificationReducer(initialState.singleImport, action);

      // then
      expect(resultState).toEqual(expectedState);
    });

    it('should update a notification when there are multiple ones', () => {
      // given
      const updatedNotificationProps = {
        objectWorkingId: 'someId3',
        percentageComplete: 40,
      };
      const action = {
        type: UPDATE_NOTIFICATION,
        payload: updatedNotificationProps
      };
      const expectedState = {
        notifications: [initialState.multiple.notifications[0],
          initialState.multiple.notifications[1],
          {
            ...initialState.multiple.notifications[2],
            ...updatedNotificationProps
          }]
      };

      // when
      const resultState = notificationReducer(initialState.multiple, action);

      // then
      expect(resultState).toEqual(expectedState);
    });
  });

  describe('delete', () => {
    it('should throw an error if objectWorkingId does not exist', () => {
      // given
      const wrongAction = {
        type: DELETE_NOTIFICATION,
        payload: {
          objectWorkingId: 'someNonExistingId',
          percentageComplete: 90,
        },
      };

      // when
      const throwingCall = () => notificationReducer(initialState.multiple, wrongAction);

      // then
      expect(throwingCall).toThrow();
    });

    it('should delete one action on single array', () => {
      // given
      const action = {
        type: DELETE_NOTIFICATION,
        payload: { objectWorkingId: 'someId1', },
      };
      // when
      const resultState = notificationReducer(initialState.singleImport, action);
      // then
      expect(resultState).toEqual({ notifications: [] });
    });
    it('should delete one action on multiple array', () => {
      // given
      const action = {
        type: DELETE_NOTIFICATION,
        payload: { objectWorkingId: 'someId2', },
      };
      // when
      const resultState = notificationReducer(initialState.multiple, action);
      // then
      expect(resultState).toEqual({
        notifications: [
          initialState.multiple.notifications[0],
          initialState.multiple.notifications[2]
        ]
      });
    });
  });
});
