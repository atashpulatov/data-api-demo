import { notificationService } from '../notification/notification-service';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { pageByHelper } from '../page-by/page-by-helper';

import { PageByDisplayType } from '../page-by/page-by-types';
import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import { OperationTypes } from '../operation/operation-type-names';
import { errorService } from './error-handler';
import { ErrorType } from './constants';

jest.mock('../notification/notification-service');

describe('ErrorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle page-by refresh error', async () => {
    // given
    const objectWorkingId = 123;
    const error = {
      response: {
        body: {
          code: 'ERR006',
          message: 'The report has 2 page-by units but you have input 1 page-by selected elements.',
        },
      },
    };
    const callback = jest.fn();
    const operationData = {} as OperationData;

    errorService.getErrorDetails = jest.fn().mockReturnValue('error details');
    errorService.reduxStore = {
      getState: jest.fn().mockReturnValue({
        popupStateReducer: { isDataOverviewOpen: true },
        officeReducer: { isDialogOpen: false },
        operationReducer: { operations: [{ operationType: OperationTypes.REFRESH_OPERATION }] },
      }),
    };

    jest.spyOn(errorService, 'closePromptsDialogInOverview').mockImplementation();
    jest
      .spyOn(pageByHelper, 'getAllPageByObjects')
      .mockReturnValue({ pageBySiblings: [], sourceObject: {} as ObjectData });

    const errorType = errorService.getErrorType(error, operationData);

    // when
    await errorService.handleObjectBasedError(objectWorkingId, error, callback, operationData);

    // then
    expect(errorType).toEqual('pageByRefresh');
    expect(errorService.getErrorDetails).toHaveBeenCalled();
    expect(pageByHelper.getAllPageByObjects).toHaveBeenCalled();
  });

  it('should call dispatch actions for siblings', () => {
    // given
    const mockedPageByData = {
      pageByDisplayType: PageByDisplayType.ALL_PAGES,
      pageByLinkId: 'pageByLinkId',
    };
    const mockedObjectData = [
      {
        objectWorkingId: 1,
        pageByData: mockedPageByData,
      },
      {
        objectWorkingId: 2,
        pageByData: mockedPageByData,
      },
      {
        objectWorkingId: 3,
        pageByData: mockedPageByData,
      },
    ] as unknown as ObjectData[];

    jest
      .spyOn(pageByHelper, 'getAllPageByObjects')
      .mockReturnValueOnce({ pageBySiblings: mockedObjectData, sourceObject: mockedObjectData[0] });

    errorService.reduxStore = {
      getState: jest.fn().mockReturnValue({
        objectReducer: { objects: mockedObjectData },
        operationReducer: {
          operations: [
            {
              objectWorkingId: 1,
              operationType: OperationTypes.REFRESH_OPERATION,
            },
            {
              objectWorkingId: 2,
              operationType: OperationTypes.REFRESH_OPERATION,
            },
          ],
        },
      }),
      dispatch: jest.fn(),
    };

    // when
    errorService.clearOperationsForPageBySiblings(mockedObjectData[0].objectWorkingId);

    // then
    expect(errorService.reduxStore.dispatch).toHaveBeenCalled();
  });

  it('should handle overlapping tables error', async () => {
    // given
    const objectWorkingId = 123;
    const error = { Code: 5012 };
    const callback = jest.fn();
    const operationData = {} as OperationData;

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
    jest.spyOn(errorService, 'handleError').mockImplementation();
    jest.spyOn(errorService, 'closePromptsDialogInOverview').mockImplementation();

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
    const objectWorkingId = 123;
    const error = { Code: 1234 };
    const callback = jest.fn();
    const operationData = {} as OperationData;

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
    errorService.closePopupIfOpen = jest.fn().mockResolvedValue(true);
    jest.spyOn(notificationService, 'showObjectWarning').mockImplementation();

    jest.spyOn(errorService, 'handleError').mockImplementation();
    jest.spyOn(errorService, 'closePromptsDialogInOverview').mockImplementation();

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

  it.each`
    operationType                          | objectFromObjectReducer | expectedErrorType
    ${OperationTypes.IMPORT_OPERATION}     | ${{}}                   | ${undefined}
    ${OperationTypes.CLEAR_DATA_OPERATION} | ${{ pageByData: {} }}   | ${undefined}
    ${OperationTypes.IMPORT_OPERATION}     | ${{ pageByData: {} }}   | ${ErrorType.PAGE_BY_IMPORT_ERR}
  `(
    'getPageByError should work properly',
    ({ operationType, objectFromObjectReducer, expectedErrorType }) => {
      // given
      const officeReducerHelperMock = jest
        .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
        .mockReturnValue(objectFromObjectReducer);
      // when
      const errorType = errorService.getPageByError(1, { operationType } as OperationData);

      // then
      expect(officeReducerHelperMock).toHaveBeenCalled();
      expect(errorType).toEqual(expectedErrorType);
    }
  );
});
