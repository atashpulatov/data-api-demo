import { ObjectNotificationTypes } from '@mstr/connector-components';

import { notificationService } from '../../notification/notification-service';

import {
  ClearGlobalNotificationAction,
  CreateGlobalNotificationAction,
  DeleteObjectNotificationAction,
  DisplayNotificationCompletedAction,
  DisplayObjectWarningAction,
  ImportOperationAction,
  MoveNotificationToInProgressAction,
  NotificationActionTypes,
  NotificationState,
  RestoreAllNotificationsAction,
  ToggleSecuredFlagAction,
} from './notification-reducer-types';

import { OperationTypes } from '../../operation/operation-type-names';
import { notificationReducer } from './notification-reducer';

describe('Notification reducer', () => {
  it('should get default state if one is not provided', () => {
    // given
    const action: any = {};

    // when
    const resultState = notificationReducer(undefined, action);

    // then
    expect(resultState).toEqual({
      notifications: [],
      globalNotification: { type: '' },
      sidePanelBanner: null,
    });
  });

  describe('global notification', () => {
    const initialState: NotificationState = {
      notifications: [],
      globalNotification: { type: '' },
      sidePanelBanner: {},
    };

    describe('createGlobalNotification', () => {
      it('should create global notification if there is none', () => {
        // given
        const expectedNotification = {
          type: 'some type',
          someProp: 'some value',
        };
        const action: CreateGlobalNotificationAction = {
          type: NotificationActionTypes.CREATE_GLOBAL_NOTIFICATION,
          payload: expectedNotification,
        };
        // when
        const resultState = notificationReducer(initialState, action);
        // then
        expect(resultState.globalNotification).toEqual(expectedNotification);
      });
      it('should overwrite existing global notification if there is one', () => {
        // given
        const initialStateExistingGlobal: NotificationState = {
          notifications: [],
          globalNotification: { type: 'some notification' },
          sidePanelBanner: null,
        };
        const expectedNotification = {
          type: 'some type',
          someProp: 'some value',
        };

        const action: CreateGlobalNotificationAction = {
          type: NotificationActionTypes.CREATE_GLOBAL_NOTIFICATION,
          payload: expectedNotification,
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
        const initialStateExistingGlobal: NotificationState = {
          notifications: [],
          globalNotification: { type: 'some type', message: 'some value' },
          sidePanelBanner: null,
        };
        const action: ClearGlobalNotificationAction = {
          type: NotificationActionTypes.REMOVE_GLOBAL_NOTIFICATION,
        };
        // when
        const resultState = notificationReducer(initialStateExistingGlobal, action);
        // then
        expect(resultState.globalNotification).toEqual({ type: '' });
      });
    });
  });

  describe('object based notifications', () => {
    const initialState: any = {
      empty: { notifications: [], globalNotification: { type: '' } },
      singleWarning: {
        notifications: [
          {
            objectWorkingId: 1,
            type: 'warning',
            details: 'some details',
          },
        ],
      },
      singleImport: {
        notifications: [
          {
            objectWorkingId: 1,
            type: 'import',
          },
        ],
      },
      multiple: {
        notifications: [
          {
            objectWorkingId: 1,
            type: 'cleared',
          },
          {
            objectWorkingId: 2,
            type: 'import',
            details: 'some details',
          },
          {
            objectWorkingId: 3,
            type: 'import',
          },
        ],
      },
    };

    const initialStateProgress: NotificationState = {
      notifications: [
        {
          objectWorkingId: 12,
          operationType: OperationTypes.IMPORT_OPERATION,
          title: 'Pending',
          type: ObjectNotificationTypes.PROGRESS,
        },
        {
          objectWorkingId: 123,
          operationType: OperationTypes.REMOVE_OPERATION,
          title: 'Pending',
          type: ObjectNotificationTypes.PROGRESS,
        },
        {
          objectWorkingId: 1234,
          operationType: OperationTypes.CLEAR_DATA_OPERATION,
          title: 'Pending',
          type: ObjectNotificationTypes.PROGRESS,
        },
      ],
      globalNotification: { type: 'some type' },
      sidePanelBanner: {},
    };

    const updatedStateProgress = {
      notifications: [
        {
          objectWorkingId: 101,
          operationType: OperationTypes.IMPORT_OPERATION,
          title: 'Completed',
          type: ObjectNotificationTypes.PROGRESS,
        },
        {
          objectWorkingId: 102,
          operationType: OperationTypes.REMOVE_OPERATION,
          title: 'Pending',
          type: ObjectNotificationTypes.PROGRESS,
        },
      ],
      globalNotification: { type: 'some other type' },
    };

    describe('createProgressNotification', () => {
      it('should add new pending notification to empty array', () => {
        // given
        const action: ImportOperationAction = {
          type: NotificationActionTypes.IMPORT_OPERATION,
          payload: {
            operation: {
              stepsQueue: [],
              objectWorkingId: 123,
              operationType: OperationTypes.IMPORT_OPERATION,
              operationId: 'someId',
            },
          },
        };

        const spyFilter = jest.spyOn(Array.prototype, 'filter');

        // when
        const resultState = notificationReducer(initialState.empty, action);

        // then
        expect(spyFilter).toHaveBeenCalled();
        const { children, ...resultChunk } = resultState.notifications[0];
        expect(children).toBeDefined();
        expect(resultChunk).toEqual({
          objectWorkingId: 123,
          operationType: OperationTypes.IMPORT_OPERATION,
          title: 'Pending',
          type: 'progress',
        });
      });

      it('should add new pending notification to existing ones', () => {
        // given
        const action: ImportOperationAction = {
          type: NotificationActionTypes.IMPORT_OPERATION,
          payload: {
            operation: {
              stepsQueue: [],
              objectWorkingId: 123,
              operationType: OperationTypes.IMPORT_OPERATION,
              operationId: 'someId',
            },
          },
        };

        // when
        const resultState = notificationReducer(initialState.singleImport, action);

        // then
        const { children: _, ...resultChunk } = resultState.notifications[1];
        expect(resultChunk).toEqual({
          objectWorkingId: 123,
          operationType: OperationTypes.IMPORT_OPERATION,
          title: 'Pending',
          type: 'progress',
        });
      });

      it('should have cancel button on Pending', () => {
        // given
        const action: ImportOperationAction = {
          type: NotificationActionTypes.IMPORT_OPERATION,
          payload: {
            operation: {
              stepsQueue: [],
              objectWorkingId: 123,
              operationType: OperationTypes.IMPORT_OPERATION,
              operationId: 'someId',
            },
          },
        };

        // when
        const resultState = notificationReducer(initialState.singleImport, action);

        // then
        const { children } = resultState.notifications[1];
        expect(children).toBeDefined();
      });

      it('should not have cancel button on Pending for Clear data', () => {
        // given
        const action: ImportOperationAction = {
          type: NotificationActionTypes.IMPORT_OPERATION,
          payload: {
            operation: {
              stepsQueue: [],
              objectWorkingId: 123,
              operationType: OperationTypes.CLEAR_DATA_OPERATION,
              operationId: 'someId',
            },
          },
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
        const action: MoveNotificationToInProgressAction = {
          type: NotificationActionTypes.MOVE_NOTIFICATION_TO_IN_PROGRESS,
          payload: { objectWorkingId: 12 },
        };

        // when
        const resultState = notificationReducer(initialStateProgress, action);

        // then
        expect(resultState.notifications[0].title).toEqual('Importing');
        expect(resultState.notifications[0].isIndeterminate).toEqual(false);
      });

      it('should update notification to in progress and set indeterminate for remove and clear operation', () => {
        // given
        const actionForRemove: MoveNotificationToInProgressAction = {
          type: NotificationActionTypes.MOVE_NOTIFICATION_TO_IN_PROGRESS,
          payload: { objectWorkingId: 123 },
        };
        const actionForClear: MoveNotificationToInProgressAction = {
          type: NotificationActionTypes.MOVE_NOTIFICATION_TO_IN_PROGRESS,
          payload: { objectWorkingId: 1234 },
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
        jest
          .spyOn(notificationService, 'dismissNotification')
          .mockImplementationOnce(() => mockedDismissNotification());
        jest
          .spyOn(notificationService, 'dismissSuccessfulRemoveNotification')
          .mockImplementationOnce(() => mockedDismissSuccessfulRemoveNotification());
      });

      it('should update notification to type SUCCESS', () => {
        // given
        const actionForImport: DisplayNotificationCompletedAction = {
          type: NotificationActionTypes.DISPLAY_NOTIFICATION_COMPLETED,
          payload: { objectWorkingId: 12 },
        };

        // when
        const resultState = notificationReducer(initialStateProgress, actionForImport);

        // then
        expect(resultState.notifications[0].type).toEqual('success');
        expect(resultState.notifications[0].title).toEqual('Import successful');
        expect(resultState.notifications[0].dismissNotification).toBeDefined();
      });

      it('should assign proper method for operation other than remove', () => {
        // given
        const actionForImport: DisplayNotificationCompletedAction = {
          type: NotificationActionTypes.DISPLAY_NOTIFICATION_COMPLETED,
          payload: { objectWorkingId: 12 },
        };
        const resultState = notificationReducer(initialStateProgress, actionForImport);

        // when
        resultState.notifications[0].dismissNotification();

        // then
        expect(mockedDismissNotification).toBeCalled();
      });

      it('should assign proper method for remove operation', () => {
        // given
        const actionForRemove: DisplayNotificationCompletedAction = {
          type: NotificationActionTypes.DISPLAY_NOTIFICATION_COMPLETED,
          payload: { objectWorkingId: 123 },
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
        const actionForImport: DisplayObjectWarningAction = {
          type: NotificationActionTypes.DISPLAY_NOTIFICATION_WARNING,
          payload: {
            objectWorkingId: 12,
            notification: {
              objectWorkingId: 12,
              operationType: OperationTypes.IMPORT_OPERATION,
              type: ObjectNotificationTypes.WARNING,
              callback: mockedCallback,
              title: someTitle,
              message: expectedDetails,
            },
          },
        };

        // when
        const resultState = notificationReducer(initialStateProgress, actionForImport);

        // then
        expect(resultState.notifications[0].type).toEqual('warning');
        expect(resultState.notifications[0].title).toEqual(someTitle);
        expect(resultState.notifications[0].details).toEqual(expectedDetails);
        expect(resultState.notifications[0].operationType).toEqual(
          initialStateProgress.notifications[0].operationType
        );
      });

      describe('deleteNotification', () => {
        it('should delete one action on single array', () => {
          // given
          const action: DeleteObjectNotificationAction = {
            type: NotificationActionTypes.DELETE_NOTIFICATION,
            payload: { objectWorkingId: 1 },
          };

          // when
          const resultState = notificationReducer(initialState.singleImport, action);

          // then
          expect(resultState).toEqual({ notifications: [] });
        });

        it('should delete one action on multiple array', () => {
          // given
          const action: DeleteObjectNotificationAction = {
            type: NotificationActionTypes.DELETE_NOTIFICATION,
            payload: { objectWorkingId: 2 },
          };

          // when
          const resultState = notificationReducer(initialState.multiple, action);

          // then
          expect(resultState).toEqual({
            notifications: [
              initialState.multiple.notifications[0],
              initialState.multiple.notifications[2],
            ],
          });
        });
      });
      describe('deleteAllNotifications', () => {
        it('should delete all notifications if isSecured is true', () => {
          // given
          const action: ToggleSecuredFlagAction = {
            type: NotificationActionTypes.TOGGLE_SECURED_FLAG,
            isSecured: true,
          };

          // when
          const resultState = notificationReducer(initialStateProgress, action);

          // then
          expect(resultState.notifications).toHaveLength(0);
          expect(resultState.globalNotification).toEqual(initialStateProgress.globalNotification);
        });

        it('should return state if isSecured is false', () => {
          // given
          const action: ToggleSecuredFlagAction = {
            type: NotificationActionTypes.TOGGLE_SECURED_FLAG,
            isSecured: false,
          };

          // when
          const resultState = notificationReducer(initialStateProgress, action);

          // then
          expect(resultState.notifications).toHaveLength(3);
          expect(resultState.globalNotification).toEqual(initialStateProgress.globalNotification);
        });
      });

      describe('restoreAllNotifications', () => {
        it('should restore all notifications', () => {
          // given
          const action: RestoreAllNotificationsAction = {
            type: NotificationActionTypes.RESTORE_ALL_NOTIFICATIONS,
            payload: updatedStateProgress.notifications,
          };

          // when
          const resultState = notificationReducer(initialStateProgress, action);

          // then
          expect(resultState.notifications).toEqual(updatedStateProgress.notifications);
          expect(resultState.globalNotification).toEqual(initialStateProgress.globalNotification);
        });
      });
    });
  });
});
