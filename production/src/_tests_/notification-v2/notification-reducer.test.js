import { DELETE_NOTIFICATION } from '../../redux-reducer/notification-reducer/notification-actions';
import { notificationReducer } from '../../redux-reducer/notification-reducer/notification-reducer';
import { IMPORT_OPERATION } from '../../operation/operation-type-names';
// import i18n from '../../i18n';

// jest.mock(i18n)

describe('Notification reducer', () => {
  const initialState = {
    empty: { notifications: [], globalNotification: { type: '' } },
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
    expect(resultState).toEqual({ notifications: [], globalNotification: { type: '' } });
  });

  describe('createProgressNotification', () => {
    it('should add new pending notification to empty array', () => {
    // given
      const action = {
        type: IMPORT_OPERATION,
        payload: {
          operation: {
            objectWorkingId: 123,
            operationType: IMPORT_OPERATION,
          }
        }
      };

      // when
      const resultState = notificationReducer(initialState.empty, action);

      // then
      expect(resultState.notifications[0]).toEqual({
        objectWorkingId: 123,
        operationType: IMPORT_OPERATION,
        title: 'Pending',
        type: 'PROGRESS',
      },);
    });
    it('should add new pending notification to existing ones', () => {
      // given
      const action = {
        type: IMPORT_OPERATION,
        payload: {
          operation: {
            objectWorkingId: 123,
            operationType: IMPORT_OPERATION,
          }
        }
      };

      // when
      const resultState = notificationReducer(initialState.singleImport, action);

      // then
      expect(resultState.notifications[1]).toEqual({
        objectWorkingId: 123,
        operationType: IMPORT_OPERATION,
        title: 'Pending',
        type: 'PROGRESS',
      },);
    });
  });

  describe('deleteNotification', () => {
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
