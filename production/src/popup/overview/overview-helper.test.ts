import { objectNotificationTypes } from '@mstr/connector-components';
import { notificationService } from '../../notification-v2/notification-service';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import operationErrorHandler from '../../operation/operation-error-handler';
import { sidePanelNotificationHelper } from '../../right-side-panel/side-panel-notification-helper';
import { sidePanelService } from '../../right-side-panel/side-panel-service';
import { popupHelper } from '../popup-helper';
import overviewHelper, { OverviewActionCommands } from './overview-helper';
import {
  DUPLICATE_OPERATION, EDIT_OPERATION, IMPORT_OPERATION, REFRESH_OPERATION, REMOVE_OPERATION
} from '../../operation/operation-type-names';
import { mockedNotificationsFromStore, mockedObjectsFromStore, mockedWarningImportNotification } from '../../_tests_/mockDataV2';

describe('overview-helper', () => {
  const objectWorkingIds = [1, 2];

  it('should send refresh request to side panel', () => {
    // Given
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();
    // When
    overviewHelper.sendRefreshRequest(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.REFRESH,
      objectWorkingIds
    });
  });

  it('should send edit request to side panel', () => {
    // Given
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();
    // When
    overviewHelper.sendEditRequest(objectWorkingIds[0]);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.EDIT,
      objectWorkingId: objectWorkingIds[0]
    });
  });

  it('should send reprompt request to side panel', () => {
    // Given
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();
    // When
    overviewHelper.sendRepromptRequest(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.REPROMPT,
      objectWorkingIds
    });
  });

  it('should send delete request to side panel', () => {
    // Given
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();
    // When
    overviewHelper.sendDeleteRequest(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.REMOVE,
      objectWorkingIds
    });
  });

  it('should send duplicate request to side panel', () => {
    // Given
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();

    // When
    overviewHelper.sendDuplicateRequest(objectWorkingIds, true, false);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.DUPLICATE,
      objectWorkingIds,
      insertNewWorksheet: true,
      withEdit: false
    });
  });

  it('should send rangeTakenOk request to side panel', () => {
    // Given
    const objectWorkingId = objectWorkingIds[0];
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();

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
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();

    // When
    overviewHelper.handleRangeTakenClose(objectWorkingId);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.RANGE_TAKEN_CLOSE,
      objectWorkingId,
    });
  });

  it('should send rename request to side panel', () => {
    // Given
    const objectWorkingId = objectWorkingIds[0];
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();

    // When
    overviewHelper.sendRenameRequest(objectWorkingId, 'newName');

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.RENAME,
      objectWorkingId,
      newName: 'newName'
    });
  });

  it('should send goToWorksheet request to side panel', () => {
    // Given
    const objectWorkingId = objectWorkingIds[0];
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();

    // When
    overviewHelper.sendGoToWorksheetRequest(objectWorkingId);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.GO_TO_WORKSHEET,
      objectWorkingId
    });
  });

  it('should send Dismiss Notification request to side panel', () => {
    // Given
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();
    // When
    overviewHelper.sendDismissNotificationRequest(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.DISMISS_NOTIFICATION,
      objectWorkingIds
    });
  });

  it('should handle refresh command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.REFRESH,
      objectWorkingIds
    };

    const refreshMock = jest.spyOn(sidePanelService, 'refresh').mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(refreshMock).toHaveBeenCalledWith(objectWorkingIds);
  });

  it('should handle edit command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.EDIT,
      objectWorkingId: objectWorkingIds[0]
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
      objectWorkingIds
    };

    const removeMock = jest.spyOn(sidePanelService, 'remove').mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(removeMock).toHaveBeenCalledWith(objectWorkingIds);
  });

  it('should handle duplicate command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.DUPLICATE,
      objectWorkingIds,
      insertNewWorksheet: true,
      withEdit: false
    };

    const duplicateMock = jest.spyOn(sidePanelService, 'duplicate').mockImplementation();

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
      objectWorkingId: objectWorkingIds[0]
    };

    const importInNewRangeMock = jest.spyOn(sidePanelNotificationHelper, 'importInNewRange').mockImplementation();
    const clearPopupDataMock = jest.spyOn(officeReducerHelper, 'clearPopupData').mockImplementation();

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
      objectWorkingId: objectWorkingIds[0]
    };

    const clearFailedObjectFromReduxMock = jest.spyOn(operationErrorHandler, 'clearFailedObjectFromRedux').mockImplementation();
    const clearPopupDataMock = jest.spyOn(officeReducerHelper, 'clearPopupData').mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(clearFailedObjectFromReduxMock).toHaveBeenCalledWith(objectWorkingIds[0]);
    expect(clearPopupDataMock).toHaveBeenCalled();
  });

  it('should handle dismiss notification command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.DISMISS_NOTIFICATION,
      objectWorkingIds
    };

    const removeMock = jest.spyOn(notificationService, 'removeExistingNotification').mockImplementation();

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
        request: 'visualizations'
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
    const result = overviewHelper.transformExcelObjects(mockedObjectsFromStore, mockedNotificationsFromStore);

    // Then
    expect(result).toEqual([expectedResult]);
  });

  it('getWarningsToDisplay should work correctly', async () => {
    // Given
    const expectedResult = {
      objectWorkingId: 1708520901973,
      type: 'warning',
      title: 'The table you try to import exceeds the worksheet limits.',
      details: 'Failure details'

    };

    // When
    const result = overviewHelper.getWarningsToDisplay([mockedWarningImportNotification]);

    // Then
    expect(result).toBeInstanceOf(Array);
    expect(result[0].objectWorkingId).toEqual(expectedResult.objectWorkingId);
    expect(result[0].children).toBeInstanceOf(Object);
    expect(result[0].title).toEqual(expectedResult.title);
    expect(result[0].details).toEqual(expectedResult.details);
  });

  it.each`
    operationType           | notificationType                      | expectedResultLength
    ${IMPORT_OPERATION}     | ${objectNotificationTypes.WARNING}    | ${1}
    ${IMPORT_OPERATION}     | ${objectNotificationTypes.PROGRESS}   | ${0}
    ${REMOVE_OPERATION}     | ${objectNotificationTypes.WARNING}    | ${1}
    ${DUPLICATE_OPERATION}  | ${objectNotificationTypes.WARNING}    | ${1}
    ${REFRESH_OPERATION}    | ${objectNotificationTypes.WARNING}    | ${0}
    ${EDIT_OPERATION}       | ${objectNotificationTypes.WARNING}    | ${0}
    `('getWarningsToDisplay should correctly determine whether to display notification as global notification in overview', ({ operationType, notificationType, expectedResultLength }) => {
    // Given
    const notifications = [{ ...mockedWarningImportNotification, operationType, type: notificationType }];

    // When
    const result = overviewHelper.getWarningsToDisplay(notifications);

    // Then
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(expectedResultLength);
  });
});
