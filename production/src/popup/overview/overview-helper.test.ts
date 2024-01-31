import { popupHelper } from '../popup-helper';
import overviewHelper, { OverviewActionCommands } from './overview-helper';

describe('overview-helper', () => {
  const objectWorkingIds = [1, 2, 3];

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
});
