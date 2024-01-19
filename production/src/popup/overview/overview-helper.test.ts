import { popupHelper } from '../popup-helper';
import overviewHelper, { OverviewActionCommands } from './overview-helper';

describe('overview-helper', () => {
  it('should send refresh request to side panel', () => {
    // Given
    const objectWorkingIds = [1, 2, 3];
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();
    // When
    overviewHelper.sendRefreshRequest(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.refresh,
      objectWorkingIds
    });
  });

  it('should send delete request to side panel', () => {
    // Given
    const objectWorkingIds = [1, 2, 3];
    const officeMessageParentMock = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();
    // When
    overviewHelper.sendDeleteRequest(objectWorkingIds);

    // Then
    expect(officeMessageParentMock).toHaveBeenCalledWith({
      command: OverviewActionCommands.remove,
      objectWorkingIds
    });
  });
});
