import { GlobalNotificationTypes, ObjectNotificationTypes } from '@mstr/connector-components';
import { LoadedObject } from '@mstr/connector-components/lib/loaded-objects/object-tile/object-tile-types';

import { notificationService } from '../../notification/notification-service';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { sidePanelHelper } from '../../right-side-panel/side-panel-services/side-panel-helper';
import { sidePanelNotificationHelper } from '../../right-side-panel/side-panel-services/side-panel-notification-helper';
import { sidePanelService } from '../../right-side-panel/side-panel-services/side-panel-service';
import { popupHelper } from '../popup-helper';
import overviewHelper, { OverviewActionCommands } from './overview-helper';

import { reduxStore, RootState } from '../../store';

import { OperationTypes } from '../../operation/operation-type-names';

import {
  mockedGlobalWarningNotification,
  mockedNotificationsFromStore,
  mockedObjectsFromStore,
  mockedWarningImportNotification,
} from '../../../__mocks__/mockDataV2';

describe('overview-helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const objectWorkingIds = [1, 2];

  it('should send refresh request to side panel', () => {
    // Given
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();
    // When
    overviewHelper.sendRefreshRequest(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.REFRESH,
      objectWorkingIds,
    });
  });

  it('should send edit request to side panel', () => {
    // Given
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();
    // When
    overviewHelper.sendEditRequest(objectWorkingIds[0]);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.EDIT,
      objectWorkingId: objectWorkingIds[0],
    });
  });

  it('should send reprompt request to side panel', () => {
    // Given
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();
    // When
    overviewHelper.sendRepromptRequest(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.REPROMPT,
      objectWorkingIds,
    });
  });

  it('should send delete request to side panel', () => {
    // Given
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();
    // When
    overviewHelper.sendDeleteRequest(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.REMOVE,
      objectWorkingIds,
    });
  });

  it('should send duplicate request to side panel', () => {
    // Given
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();

    // When
    overviewHelper.sendDuplicateRequest(objectWorkingIds, true, false);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.DUPLICATE,
      objectWorkingIds,
      insertNewWorksheet: true,
      withEdit: false,
    });
  });

  it('should send rangeTakenOk request to side panel', () => {
    // Given
    const objectWorkingId = objectWorkingIds[0];
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();

    // When
    overviewHelper.handleRangeTakenOk(objectWorkingId);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.RANGE_TAKEN_OK,
      objectWorkingId,
    });
  });

  it('should send rangeTakenClose request to side panel', () => {
    // Given
    const objectWorkingId = objectWorkingIds[0];
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();

    // When
    overviewHelper.handleRangeTakenClose(objectWorkingId);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.RANGE_TAKEN_CLOSE,
      objectWorkingId,
    });
  });

  it('should send handlePageByRefreshFailedClose request to side panel', () => {
    // Given
    const objectWorkingId = objectWorkingIds[0];
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();

    // When
    overviewHelper.handlePageByRefreshFailedClose(objectWorkingId);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.PAGE_BY_REFRESH_FAILED_CLOSE,
      objectWorkingId,
    });
  });

  it('should send handlePageByImportFailedClose request to side panel', () => {
    // Given
    const objectWorkingId = objectWorkingIds[0];
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();

    // When
    overviewHelper.handlePageByImportFailedClose(objectWorkingId);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.PAGE_BY_IMPORT_FAILED_CLOSE,
      objectWorkingId,
    });
  });
  it('should send handlePageByDuplicateFailedClose request to side panel', () => {
    // Given
    const objectWorkingId = objectWorkingIds[0];
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();

    // When
    overviewHelper.handlePageByDuplicateFailedClose(objectWorkingId);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.PAGE_BY_DUPLICATE_FAILED_CLOSE,
      objectWorkingId,
    });
  });

  it('should send handlePageByRefreshFailedEdit request to side panel', () => {
    // Given
    const objectWorkingId = objectWorkingIds[0];
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();

    // When
    overviewHelper.handlePageByRefreshFailedEdit(objectWorkingId);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.PAGE_BY_REFRESH_FAILED_EDIT,
      objectWorkingId,
    });
  });

  it('should send handlePageByRefreshFailedRemove request to side panel', () => {
    // Given
    const objectWorkingId = objectWorkingIds[0];
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();

    // When
    overviewHelper.handlePageByRefreshFailedRemove(objectWorkingId);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.PAGE_BY_REFRESH_FAILED_REMOVE,
      objectWorkingId,
    });
  });

  it('should call setDialogPopup when setPageByRefreshFailedPopup is triggered', () => {
    // given
    const objectWorkingId = 1;
    const setDialogPopup = jest.fn();

    // when
    overviewHelper.setPageByRefreshFailedPopup({
      objectWorkingIds: [objectWorkingId],
      setDialogPopup,
    });
    // then
    expect(setDialogPopup).toBeCalledTimes(1);
  });

  it('should call setDialogPopup when setPageByImportFailedPopup is triggered', () => {
    // given
    const objectWorkingId = 1;
    const setDialogPopup = jest.fn();
    const errorDetails = 'errorDetails';

    // when
    overviewHelper.setPageByImportFailedPopup({
      objectWorkingIds: [objectWorkingId],
      errorDetails,
      setDialogPopup,
    });
    // then
    expect(setDialogPopup).toBeCalledTimes(1);
  });
  it('should call setDialogPopup when setPageByDuplicateFailedPopup is triggered', () => {
    // given
    const objectWorkingId = 1;
    const setDialogPopup = jest.fn();
    const selectedObjects = [{ objectWorkingId: 1 }] as unknown as LoadedObject[];

    // when
    overviewHelper.setPageByDuplicateFailedPopup({
      objectWorkingIds: [objectWorkingId],
      selectedObjects,
      setDialogPopup,
    });
    // then
    expect(setDialogPopup).toBeCalledTimes(1);
  });

  it('should send rename request to side panel', () => {
    // Given
    const objectWorkingId = objectWorkingIds[0];
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();

    // When
    overviewHelper.sendRenameRequest(objectWorkingId, 'newName');

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.RENAME,
      objectWorkingId,
      newName: 'newName',
    });
  });

  it('should send goToWorksheet request to side panel', () => {
    // Given
    const objectWorkingId = objectWorkingIds[0];
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();

    // When
    overviewHelper.sendGoToWorksheetRequest(objectWorkingId);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.GO_TO_WORKSHEET,
      objectWorkingId,
    });
  });

  it('should send Dismiss Notification request to side panel', () => {
    // Given
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();
    // When
    overviewHelper.sendDismissNotificationRequest(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.DISMISS_NOTIFICATION,
      objectWorkingIds,
    });
  });

  it('should send Dismiss Global Notification request to side panel', () => {
    // Given
    const officeMessageParentMock = jest
      .spyOn(popupHelper, 'officeMessageParent')
      .mockImplementation();

    // When
    overviewHelper.sendDismissGlobalNotificationRequest();

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.DISMISS_GLOBAL_NOTIFICATION,
    });
  });

  // it('should handle Dismiss Global Notification request to side panel', () => {
  //   // Given
  //   const notificationServiceMock = jest
  //     .spyOn(notificationService, 'globalNotificationDissapear')
  //     .mockImplementation();

  //   // When
  //   overviewHelper.handleDismissGlobalNotification();

  //   // Then
  //   expect(notificationServiceMock).toHaveBeenCalled();
  // });

  it('should handle refresh command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.REFRESH,
      objectWorkingIds,
    };

    const refreshMock = jest.spyOn(sidePanelService, 'refresh').mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(refreshMock).toHaveBeenCalledWith(...objectWorkingIds);
  });

  it('should handle edit command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.EDIT,
      objectWorkingId: objectWorkingIds[0],
    };

    const editMock = jest.spyOn(sidePanelService, 'edit').mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(editMock).toHaveBeenCalledWith(objectWorkingIds[0]);
  });

  it('should handle reprompt command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.REPROMPT,
      objectWorkingIds,
    };

    const repromptMock = jest.spyOn(sidePanelService, 'reprompt').mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(repromptMock).toHaveBeenCalledWith(objectWorkingIds, true);
  });

  it('should handle remove command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.REMOVE,
      objectWorkingIds,
    };

    const removeMock = jest.spyOn(sidePanelService, 'remove').mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(removeMock).toHaveBeenCalledWith(...objectWorkingIds);
  });

  it('should handle duplicate command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.DUPLICATE,
      objectWorkingIds,
      insertNewWorksheet: true,
      withEdit: false,
    };

    const duplicateMock = jest.spyOn(sidePanelHelper, 'duplicateObject').mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(duplicateMock).toHaveBeenCalledWith(objectWorkingIds[0], true, false);
    expect(duplicateMock).toHaveBeenCalledWith(objectWorkingIds[1], true, false);
  });

  it('should handle rangeTakenOk command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.RANGE_TAKEN_OK,
      objectWorkingId: objectWorkingIds[0],
    };

    const importInNewRangeMock = jest
      .spyOn(sidePanelNotificationHelper, 'importInNewRange')
      .mockImplementation();
    const clearPopupDataMock = jest
      .spyOn(officeReducerHelper, 'clearPopupData')
      .mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(importInNewRangeMock).toHaveBeenCalledWith(objectWorkingIds[0], null, true);
    expect(clearPopupDataMock).toHaveBeenCalled();
  });

  it('should handle rangeTakenClose command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.RANGE_TAKEN_CLOSE,
      objectWorkingId: objectWorkingIds[0],
    };

    const mockedStore = {
      officeReducer: { popupData: { callback: jest.fn() } },
    } as RootState;
    const { callback } = mockedStore.officeReducer.popupData;

    jest.spyOn(reduxStore, 'getState').mockReturnValueOnce(mockedStore);
    const clearPopupDataMock = jest
      .spyOn(officeReducerHelper, 'clearPopupData')
      .mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(callback).toHaveBeenCalled();
    expect(clearPopupDataMock).toHaveBeenCalled();
  });

  it('should handle dismiss notification command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.DISMISS_NOTIFICATION,
      objectWorkingIds,
    };

    const removeMock = jest
      .spyOn(notificationService, 'removeExistingNotification')
      .mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(removeMock).toHaveBeenCalledWith(objectWorkingIds[0]);
    expect(removeMock).toHaveBeenCalledWith(objectWorkingIds[1]);
  });

  it('transformExcelObjects should work correctly', async () => {
    // Given
    const expectedResult = {
      objectWorkingId: 1707383886748,
      mstrObjectType: {
        type: 55,
        subtypes: 'undefined',
        name: 'visualization',
        request: 'visualizations',
      },
      name: 'Campaign Finances per Candidate',
      worksheet: 'Sheet 1',
      cell: 'A1',
      rows: 66,
      columns: 3,
      objectType: 'table',
      lastUpdated: 1707383921342,
      project: 'MicroStrategy Tutorial',
      owner: 'Administrator',
      importedBy: 'a',
      status: {
        type: 'success',
        title: 'Object duplicated',
      },
      isPrompted: true,
    };

    // When
    const result = overviewHelper.transformExcelObjects(
      mockedObjectsFromStore,
      mockedNotificationsFromStore
    );

    // Then
    expect(result).toEqual([expectedResult]);
  });

  it('getWarningsToDisplay should work correctly', async () => {
    // Given
    const expectedResult = {
      objectWorkingId: 1708520901973,
      type: 'warning',
      title: 'The table you try to import exceeds the worksheet limits.',
      details: 'Failure details',
    };

    // When
    const result = overviewHelper.getWarningsToDisplay({
      notifications: [mockedWarningImportNotification],
    });

    // Then
    expect(result).toBeInstanceOf(Array);
    expect(result[0].objectWorkingId).toEqual(expectedResult.objectWorkingId);
    expect(result[0].children).toBeInstanceOf(Object);
    expect(result[0].title).toEqual(expectedResult.title);
    expect(result[0].details).toEqual(expectedResult.details);
  });

  it('getWarningsToDisplay should work correctly for global notifications', async () => {
    // Given
    const expectedResult = {
      type: GlobalNotificationTypes.GLOBAL_WARNING,
      title: 'You cannot import an unpublished cube.',
      details: 'Failure details',
    };

    // When
    const result = overviewHelper.getWarningsToDisplay({
      globalNotification: mockedGlobalWarningNotification,
    });

    // Then
    expect(result).toBeInstanceOf(Array);
    expect(result[0].children).toBeInstanceOf(Object);
    expect(result[0].type).toEqual(expectedResult.type);
    expect(result[0].title).toEqual(expectedResult.title);
    expect(result[0].details).toEqual(expectedResult.details);
  });

  it.each`
    operationType                         | notificationType                    | expectedResultLength
    ${OperationTypes.IMPORT_OPERATION}    | ${ObjectNotificationTypes.WARNING}  | ${1}
    ${OperationTypes.IMPORT_OPERATION}    | ${ObjectNotificationTypes.PROGRESS} | ${0}
    ${OperationTypes.REMOVE_OPERATION}    | ${ObjectNotificationTypes.WARNING}  | ${1}
    ${OperationTypes.DUPLICATE_OPERATION} | ${ObjectNotificationTypes.WARNING}  | ${1}
    ${OperationTypes.REFRESH_OPERATION}   | ${ObjectNotificationTypes.WARNING}  | ${1}
    ${OperationTypes.EDIT_OPERATION}      | ${ObjectNotificationTypes.WARNING}  | ${1}
  `(
    'getWarningsToDisplay should correctly determine whether to display notification as global notification in overview',
    ({ operationType, notificationType, expectedResultLength }) => {
      // Given
      const notifications = [
        {
          ...mockedWarningImportNotification,
          operationType,
          type: notificationType,
        },
      ];

      // When
      const result = overviewHelper.getWarningsToDisplay({ notifications });

      // Then
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(expectedResultLength);
    }
  );

  it('should transform objects and notifications correctly', () => {
    // Given
    const objects = [
      {
        objectWorkingId: 1,
        mstrObjectType: { name: 'visualization' },
        name: 'Object 1',
        refreshDate: '2022-01-01',
        details: {
          excelTableSize: { rows: 10, columns: 5 },
          ancestors: [{ name: 'Project 1' }],
          owner: { name: 'Owner 1' },
          importedBy: 'User 1',
        },
        importType: 'formatted-data',
        startCell: 'A1',
        worksheet: { name: 'Sheet 1' },
        manipulationsXML: { promptAnswers: 'Answer 1' },
        pageByData: {
          pageByLink: '324535767821234',
          elements: [
            {
              name: 'Category',
              'value': 'Music',
              'valueId': 'h4;8D679D3711D3E4981000E787EC6DE8A4',
            },
            {
              name: 'Subcategory',
              'value': 'Pop',
              'valueId': 'h44;8D679D4F11D3E4981000E787EC6DE8A4',
            },
          ],
        },
      },
      {
        objectWorkingId: 2,
        mstrObjectType: { name: 'report' },
        name: 'Object 2',
        refreshDate: '2022-01-02',
        details: {
          excelTableSize: { rows: 20, columns: 10 },
          ancestors: [{ name: 'Project 2' }],
          owner: { name: 'Owner 2' },
          importedBy: 'User 2',
        },
        importType: 'table',
        startCell: 'B2',
        worksheet: { name: 'Sheet 2' },
        isPrompted: true,
      },
    ];

    const notifications = [
      {
        objectWorkingId: 1,
        type: 'notificationType',
        title: 'Notification 1',
        details: 'Details 1',
      },
      {
        objectWorkingId: 2,
        type: 'notificationType',
        title: 'Notification 2',
        details: 'Details 2',
      },
    ];

    // When
    const transformedObjects = overviewHelper.transformExcelObjects(objects, notifications);

    // Then
    expect(transformedObjects).toEqual([
      {
        objectWorkingId: 1,
        mstrObjectType: { name: 'visualization' },
        name: 'Object 1',
        worksheet: 'Sheet 1',
        cell: 'A1',
        rows: 10,
        columns: 5,
        objectType: 'formatted data',
        lastUpdated: '2022-01-01',
        status: {
          type: 'notificationType',
          title: 'Notification 1',
          details: 'Details 1',
        },
        project: 'Project 1',
        owner: 'Owner 1',
        importedBy: 'User 1',
        isPrompted: true,
        pageByData: {
          pageByLink: '324535767821234',
          elements: [
            {
              name: 'Category',
              'value': 'Music',
              'valueId': 'h4;8D679D3711D3E4981000E787EC6DE8A4',
            },
            {
              name: 'Subcategory',
              'value': 'Pop',
              'valueId': 'h44;8D679D4F11D3E4981000E787EC6DE8A4',
            },
          ],
        },
      },
      {
        objectWorkingId: 2,
        mstrObjectType: { name: 'report' },
        name: 'Object 2',
        worksheet: 'Sheet 2',
        cell: 'B2',
        rows: 20,
        columns: 10,
        objectType: 'table',
        lastUpdated: '2022-01-02',
        status: {
          type: 'notificationType',
          title: 'Notification 2',
          details: 'Details 2',
        },
        project: 'Project 2',
        owner: 'Owner 2',
        importedBy: 'User 2',
        isPrompted: true,
      },
    ]);
  });
});
