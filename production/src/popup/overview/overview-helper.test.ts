import { mockedNotificationsFromStore, mockedObjectsFromStore } from '../../_tests_/mockDataV2';
import { notificationService } from '../../notification-v2/notification-service';
import { officeApiHelper } from '../../office/api/office-api-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import operationErrorHandler from '../../operation/operation-error-handler';
import { sidePanelNotificationHelper } from '../../right-side-panel/side-panel-notification-helper';
import { sidePanelService } from '../../right-side-panel/side-panel-service';
import { popupHelper } from '../popup-helper';
import overviewHelper, { OverviewActionCommands } from './overview-helper';

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
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();

    // When
    overviewHelper.handleRangeTakenOk(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.RANGE_TAKEN_OK,
      objectWorkingIds,
    });
  });

  it('should send rangeTakenClose request to side panel', () => {
    // Given
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();

    // When
    overviewHelper.handleRangeTakenClose(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.RANGE_TAKEN_CLOSE,
      objectWorkingIds,
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
      objectWorkingIds: [objectWorkingIds[0]]
    };

    const importInNewRangeMock = jest.spyOn(sidePanelNotificationHelper, 'importInNewRange').mockImplementation();
    const clearSidePanelPopupDataMock = jest.spyOn(officeReducerHelper, 'clearSidePanelPopupData').mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(importInNewRangeMock).toHaveBeenCalledWith(objectWorkingIds[0], null, true);
    expect(clearSidePanelPopupDataMock).toHaveBeenCalled();
  });

  it('should handle rangeTakenClose command', async () => {
    // Given
    const actionCommand = {
      command: OverviewActionCommands.RANGE_TAKEN_CLOSE,
      objectWorkingIds: [objectWorkingIds[0]]
    };

    const clearFailedObjectFromReduxMock = jest.spyOn(operationErrorHandler, 'clearFailedObjectFromRedux').mockImplementation();
    const clearSidePanelPopupDataMock = jest.spyOn(officeReducerHelper, 'clearSidePanelPopupData').mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(clearFailedObjectFromReduxMock).toHaveBeenCalledWith(objectWorkingIds[0]);
    expect(clearSidePanelPopupDataMock).toHaveBeenCalled();
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
      importedBy: 'a'
    };

    // When
    const result = overviewHelper.transformExcelObjects(mockedObjectsFromStore, mockedNotificationsFromStore);

    // Then
    expect(result).toEqual([expectedResult]);
  });
});
