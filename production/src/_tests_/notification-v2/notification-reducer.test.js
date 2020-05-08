import {
  DELETE_NOTIFICATION, DISPLAY_NOTIFICATION_WARNING, CREATE_GLOBAL_NOTIFICATION, REMOVE_GLOBAL_NOTIFICATION
} from '../../redux-reducer/notification-reducer/notification-actions';
import { notificationReducer } from '../../redux-reducer/notification-reducer/notification-reducer';
import { IMPORT_OPERATION, CLEAR_DATA_OPERATION, REMOVE_OPERATION } from '../../operation/operation-type-names';
import { MOVE_NOTIFICATION_TO_IN_PROGRESS, DISPLAY_NOTIFICATION_COMPLETED } from '../../operation/operation-steps';
import { notificationService } from '../../notification-v2/notification-service';
import * as notificationButtonsModule from '../../notification-v2/notification-buttons';
import * as notificationTitleMapsModule from '../../redux-reducer/notification-reducer/notification-title-maps';
import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';

describe('Notification reducer', () => {
  it('should get default state if one is not provided', () => {
    // given
    const action = {};

    // when
    const resultState = notificationReducer(undefined, action);

    // then
    expect(resultState).toEqual({ notifications: [], globalNotification: { type: '' } });
  });

  describe('global notification', () => {
    const initialState = {
      notifications: [],
      globalNotification: { type: '' }
    };
    describe('createGlobalNotification', () => {
      it('should create global notification if there is none', () => {
        // given
        const expectedNotification = { type: 'some type', someProp: 'some value' };
        const action = {
          type: CREATE_GLOBAL_NOTIFICATION,
          payload: expectedNotification
        };
        // when
        const resultState = notificationReducer(initialState, action);
        // then
        expect(resultState.globalNotification).toEqual(expectedNotification);
      });
      it('should overwrite existing global notification if there is one', () => {
        // given
        const initialStateExistingGlobal = { notifications: [], globalNotification: { type: 'some notification' } };
        const expectedNotification = { type: 'some type', someProp: 'some value' };
        const action = {
          type: CREATE_GLOBAL_NOTIFICATION,
          payload: expectedNotification
        };
        // when
        const resultState = notificationReducer(initialStateExistingGlobal, action);
        // then
        expect(resultState.globalNotification).toEqual(expectedNotification);
      });
    });

    describe('removeGlobalNotification', () => {
      it('should clear existing notification', () => {
        // given
        const initialStateExistingGlobal = {
          notifications: [],
          globalNotification: { type: 'some type', someProp: 'some value' }
        };
        const action = { type: REMOVE_GLOBAL_NOTIFICATION, };
        // when
        const resultState = notificationReducer(initialStateExistingGlobal, action);
        // then
        expect(resultState.globalNotification).toEqual({ type: '' });
      });
    });
  });

  describe('object based notifications', () => {
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

    const initialStateProgress = {
      notifications: [{
        objectWorkingId: 12,
        operationType: IMPORT_OPERATION,
        title: 'Pending',
        type: 'PROGRESS',
      }, {
        objectWorkingId: 123,
        operationType: REMOVE_OPERATION,
        title: 'Pending',
        type: 'PROGRESS',
      },
      {
        objectWorkingId: 1234,
        operationType: CLEAR_DATA_OPERATION,
        title: 'Pending',
        type: 'PROGRESS',
      }],
      globalNotification: { type: 'some type' },
    };

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
        const { children, ...resultChunk } = resultState.notifications[0];
        expect(children).toBeDefined();
        expect(resultChunk).toEqual({
          objectWorkingId: 123,
          operationType: IMPORT_OPERATION,
          title: 'Pending',
          type: 'PROGRESS',
        });
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
        const { children, ...resultChunk } = resultState.notifications[1];
        expect(resultChunk).toEqual({
          objectWorkingId: 123,
          operationType: IMPORT_OPERATION,
          title: 'Pending',
          type: 'PROGRESS',
        });
      });

      it('should have cancel button on Pending', () => {
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
        const { children } = resultState.notifications[1];
        expect(children).toBeDefined();
      });

      it('should not have cancel button on Pending for Clear data', () => {
        // given
        const action = {
          type: IMPORT_OPERATION,
          payload: {
            operation: {
              objectWorkingId: 123,
              operationType: CLEAR_DATA_OPERATION,
            }
          }
        };

        // when
        const resultState = notificationReducer(initialState.singleImport, action);

        // then
        const { children } = resultState.notifications[1];
        expect(children).not.toBeDefined();
      });
    });

    describe('moveNotificationToInProgress', () => {
      it('should update notification to in progress for single import notification', () => {
      // given
        const action = {
          type: MOVE_NOTIFICATION_TO_IN_PROGRESS,
          payload: { objectWorkingId: 12, }
        };

        // when
        const resultState = notificationReducer(initialStateProgress, action);

        // then
        expect(resultState.notifications[0].title).toEqual('Importing');
        expect(resultState.notifications[0].isIndeterminate).toEqual(false);
      });

      it('should update notification to in progress and set indeterminate for remove and clear operation', () => {
      // given
        const actionForRemove = {
          type: MOVE_NOTIFICATION_TO_IN_PROGRESS,
          payload: { objectWorkingId: 123, }
        };
        const actionForClear = {
          type: MOVE_NOTIFICATION_TO_IN_PROGRESS,
          payload: { objectWorkingId: 1234, }
        };

        // when
        const resultStateTemp = notificationReducer(initialStateProgress, actionForRemove);
        const resultState = notificationReducer(resultStateTemp, actionForClear);

        // then
        expect(resultState.notifications[1].title).toEqual('Removing');
        expect(resultState.notifications[1].isIndeterminate).toEqual(true);
        expect(resultState.notifications[2].title).toEqual('Clearing');
        expect(resultState.notifications[2].isIndeterminate).toEqual(true);
      });
    });

    describe('displayNotificationCompleted', () => {
      const mockedDismissNotification = jest.fn();
      const mockedDismissSuccessfulRemoveNotification = jest.fn();

      beforeAll(() => {
        jest.spyOn(notificationService, 'dismissNotification').mockImplementationOnce(() => mockedDismissNotification());
        jest.spyOn(notificationService, 'dismissSuccessfulRemoveNotification').mockImplementationOnce(() => mockedDismissSuccessfulRemoveNotification());
      });

      it('should update notification to type SUCCESS', () => {
      // given
        const actionForImport = {
          type: DISPLAY_NOTIFICATION_COMPLETED,
          payload: { objectWorkingId: 12, }
        };

        // when
        const resultState = notificationReducer(initialStateProgress, actionForImport);

        // then
        expect(resultState.notifications[0].type).toEqual('SUCCESS');
        expect(resultState.notifications[0].title).toEqual('Import successful');
        expect(resultState.notifications[0].dismissNotification).toBeDefined();
      });

      it('should assign proper method for operation other than remove', () => {
      // given
        const actionForImport = {
          type: DISPLAY_NOTIFICATION_COMPLETED,
          payload: { objectWorkingId: 12, }
        };
        const resultState = notificationReducer(initialStateProgress, actionForImport);

        // when
        resultState.notifications[0].dismissNotification();

        // then
        expect(mockedDismissNotification).toBeCalled();
      });

      it('should assign proper method for remove operation', () => {
      // given
        const actionForRemove = {
          type: DISPLAY_NOTIFICATION_COMPLETED,
          payload: { objectWorkingId: 123, }
        };
        const resultState = notificationReducer(initialStateProgress, actionForRemove);

        // when
        resultState.notifications[1].dismissNotification();

        // then
        expect(mockedDismissSuccessfulRemoveNotification).toBeCalled();
      });
    });

    describe('displayNotificationWarning', () => {
      it('should update notification to show warning for import', () => {
      // given
        const mockedCallback = jest.fn();
        const expectedDetails = 'some message';
        const someTitle = 'some title';
        const actionForImport = {
          type: DISPLAY_NOTIFICATION_WARNING,
          payload: {
            objectWorkingId: 12,
            notification: { callback: mockedCallback, title: someTitle, message: expectedDetails }
          }
        };

        // when
        const resultState = notificationReducer(initialStateProgress, actionForImport);

        // then
        expect(resultState.notifications[0].type).toEqual('WARNING');
        expect(resultState.notifications[0].title).toEqual(someTitle);
        expect(resultState.notifications[0].details).toEqual(expectedDetails);
      });

      it('should attach button as child', () => {
      // given
        const mockedCallback = jest.fn();
        const mockedGetNotificationButtons = jest.fn();
        jest.spyOn(notificationButtonsModule, 'getNotificationButtons').mockImplementationOnce((params) => mockedGetNotificationButtons(params));
        const expectedDetails = 'some message';
        const actionForImport = {
          type: DISPLAY_NOTIFICATION_WARNING,
          payload: { objectWorkingId: 12, notification: { callback: mockedCallback, message: expectedDetails } }
        };

        // when
        const resultState = notificationReducer(initialStateProgress, actionForImport);

        // then
        expect(mockedGetNotificationButtons).toBeCalled();
        expect(mockedGetNotificationButtons).toBeCalledWith([{
          label: 'OK', onClick: mockedCallback, title: 'OK', type: 'basic'
        }]);
      });

      it('should call custom translation method', () => {
      // given
        const mockedCallback = jest.fn();
        const mockedCustomT = jest.fn();
        jest.spyOn(notificationTitleMapsModule, 'customT').mockImplementation((params) => mockedCustomT(params));
        const expectedDetails = 'some message';
        const someTitle = 'some title';
        const actionForImport = {
          type: DISPLAY_NOTIFICATION_WARNING,
          payload: {
            objectWorkingId: 12,
            notification: { callback: mockedCallback, title: someTitle, message: expectedDetails }
          }
        };

        // when
        const resultState = notificationReducer(initialStateProgress, actionForImport);

        // then
        expect(mockedCustomT).toBeCalled();
        expect(mockedCustomT).toBeCalledWith(someTitle);
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
    describe('deleteAllNotifications', () => {
      it('should delete all notifications if isSecured is true', () => {
        // given
        const action = {
          type: officeProperties.actions.toggleSecuredFlag,
          isSecured: true
        };

        // when
        const resultState = notificationReducer(initialStateProgress, action);

        // then
        expect(resultState.notifications).toHaveLength(0);
        expect(resultState.globalNotification).toEqual(initialStateProgress.globalNotification);
      });

      it('should return state if isSecured is false', () => {
        // given
        const action = {
          type: officeProperties.actions.toggleSecuredFlag,
          isSecured: false
        };

        // when
        const resultState = notificationReducer(initialStateProgress, action);

        // then
        expect(resultState.notifications).toHaveLength(3);
        expect(resultState.globalNotification).toEqual(initialStateProgress.globalNotification);
      });
    });
  });
});
