import { notificationService } from '../../notification-v2/notification-service';
import officeReducerHelper from '../../office/store/office-reducer-helper';

import { errorService } from '../../error/error-handler';

jest.mock('../../office/store/office-reducer-helper');
jest.mock('../../store');
jest.mock('../../notification-v2/notification-service');

describe('ErrorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle overlapping tables error', async () => {
    // given
    const objectWorkingId = 'objectWorkingId';
    const error = { Code: 5012 };
    const callback = jest.fn();
    const operationData = {};

    const errorMessageFactoryMock = jest.fn().mockReturnValue(jest.fn());
    errorService.getErrorType = jest.fn().mockReturnValue('OVERLAPPING_TABLES_ERR');
    errorService.getErrorDetails = jest.fn().mockReturnValue('error details');
    errorService.reduxStore = {
      getState: jest.fn().mockReturnValue({
        popupStateReducer: { isDataOverviewOpen: true },
        officeReducer: { isDialogOpen: false },
      }),
    };

    officeReducerHelper.displayPopup = jest.fn();
    jest.spyOn(errorService, 'handleError').mockReturnValue(jest.fn());
    jest.spyOn(errorService, 'closePromptsDialogInOverview').mockReturnValue(jest.fn());

    // when
    await errorService.handleObjectBasedError(objectWorkingId, error, callback, operationData);

    // then
    expect(errorService.handleError).toHaveBeenCalled();
    expect(errorMessageFactoryMock).not.toHaveBeenCalled();
    expect(errorService.getErrorDetails).toHaveBeenCalled();
    expect(errorService.closePromptsDialogInOverview).toHaveBeenCalled();
    expect(notificationService.showObjectWarning).not.toHaveBeenCalled();
  });

  it('should handle non-overlapping tables error', async () => {
    // given
    const objectWorkingId = 'objectWorkingId';
    const error = { Code: 1234 };
    const callback = jest.fn();
    const operationData = {};

    const errorMessageFactoryMock = jest.fn().mockReturnValue(jest.fn());
    errorService.getErrorType = jest.fn().mockReturnValue('NON_OVERLAPPING_TABLES_ERR');
    errorService.getErrorDetails = jest.fn().mockReturnValue('error details');
    errorService.reduxStore = {
      getState: jest.fn().mockReturnValue({
        popupStateReducer: { isDataOverviewOpen: false },
        officeReducer: { isDialogOpen: false },
      }),
    };
    errorService.closePromptsDialogInOverview = jest.fn();
    errorService.closePopupIfOpen = jest.fn().mockResolvedValue();
    jest.spyOn(notificationService, 'showObjectWarning').mockReturnValue(jest.fn());

    jest.spyOn(errorService, 'handleError').mockReturnValue(jest.fn());
    jest.spyOn(errorService, 'closePromptsDialogInOverview').mockReturnValue(jest.fn());

    // when
    await errorService.handleObjectBasedError(objectWorkingId, error, callback, operationData);

    // then
    expect(errorService.handleError).not.toHaveBeenCalled();
    expect(errorMessageFactoryMock).not.toHaveBeenCalled();
    expect(errorService.getErrorDetails).toHaveBeenCalled();
    expect(errorService.closePromptsDialogInOverview).not.toHaveBeenCalled();
    expect(errorService.closePopupIfOpen).toHaveBeenCalledWith(true);
    expect(notificationService.showObjectWarning).not.toHaveBeenCalled();
    expect(officeReducerHelper.displayPopup).not.toHaveBeenCalled();
  });
});
