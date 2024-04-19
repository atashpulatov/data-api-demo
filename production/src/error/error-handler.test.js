import { notificationService } from '../notification/notification-service';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { pageByHelper } from '../page-by/page-by-helper';

import { OperationTypes } from '../operation/operation-type-names';
import { errorService } from './error-handler';

jest.mock('../office/store/office-reducer-helper');
jest.mock('../store');
jest.mock('../notification/notification-service');

describe('ErrorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle page-by refresh error', async () => {
    // given
    const objectWorkingId = 'objectWorkingId';
    const error = {
      response: {
        body: {
          code: 'ERR006',
          message: 'The report has 2 page-by units but you have input 1 page-by selected elements.',
        },
      },
    };
    const callback = jest.fn();
    const operationData = {};

    errorService.getErrorDetails = jest.fn().mockReturnValue('error details');
    errorService.reduxStore = {
      getState: jest.fn().mockReturnValue({
        popupStateReducer: { isDataOverviewOpen: true },
        officeReducer: { isDialogOpen: false },
        operationReducer: { operations: [{ operationType: OperationTypes.REFRESH_OPERATION }] },
      }),
    };

    jest.spyOn(errorService, 'closePromptsDialogInOverview').mockReturnValue(jest.fn());
    jest.spyOn(pageByHelper, 'getAllPageByObjects').mockImplementation();
    jest.spyOn(pageByHelper, 'getAllPageBySiblings').mockReturnValue([]);
    jest.spyOn(pageByHelper, 'clearOperationsForPageBySiblings').mockImplementation();

    const errorType = errorService.getErrorType(error, operationData);

    // when
    await errorService.handleObjectBasedError(objectWorkingId, error, callback, operationData);

    // then
    expect(errorType).toEqual('pageByRefresh');
    expect(errorService.getErrorDetails).toHaveBeenCalled();
    expect(pageByHelper.getAllPageByObjects).toHaveBeenCalled();
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
