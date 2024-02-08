import { mockedNotificationsFromStore, mockedObjectsFromStore } from '../../_tests_/mockDataV2';
import { notificationService } from '../../notification-v2/notification-service';
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
    overviewHelper.sendDuplicateRequest(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.DUPLICATE,
      objectWorkingIds
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
      objectWorkingIds
    };

    const removeMock = jest.spyOn(sidePanelService, 'duplicate').mockImplementation();

    // When
    await overviewHelper.handleOverviewActionCommand(actionCommand);

    // Then
    expect(removeMock).toHaveBeenCalledWith(objectWorkingIds[0], true, false);
    expect(removeMock).toHaveBeenCalledWith(objectWorkingIds[1], true, false);
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
      worksheet: '',
      cell: '',
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
