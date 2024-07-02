import officeReducerHelper from '../office/store/office-reducer-helper';
import { pageByHelper } from '../page-by/page-by-helper';
import { errorService } from './error-service';

import { reduxStore } from '../store';

import { PageByDisplayType } from '../page-by/page-by-types';
import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import { OperationTypes } from '../operation/operation-type-names';
import { ErrorType } from './constants';

jest.mock('../notification/notification-service');

describe('ErrorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each`
    operationType                         | expectedErrorType
    ${OperationTypes.REFRESH_OPERATION}   | ${ErrorType.PAGE_BY_REFRESH_ERR}
    ${OperationTypes.DUPLICATE_OPERATION} | ${ErrorType.PAGE_BY_DUPLICATE_ERR}
  `('should handle page by operation error', async ({ operationType, expectedErrorType }) => {
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
    const operationData = { operationType } as OperationData;

    errorService.getErrorDetails = jest.fn().mockReturnValue('error details');

    const mockedReduxStore = {
      getState: jest.fn().mockReturnValue({
        popupStateReducer: { isDataOverviewOpen: true },
        officeReducer: { isDialogOpen: false },
        operationReducer: { operations: [{ operationType }] },
      }),
      dispatch: jest.fn(),
    };

    jest.mock('../store', () => ({
      ...jest.requireActual('../store'),
      store: mockedReduxStore,
    }));

    jest.spyOn(errorService, 'closePromptsDialogInOverview').mockImplementation();
    jest
      .spyOn(pageByHelper, 'getAllPageByObjects')
      .mockReturnValue({ pageBySiblings: [], sourceObject: {} as ObjectData });

    const errorType = errorService.getErrorType(error, operationData);

    // when
    await errorService.handleError(error, { objectWorkingId, callback, operationData });

    // then
    expect(errorType).toEqual(expectedErrorType);
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

    const mockedReduxStore = {
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
    };
    reduxStore.dispatch = jest.fn();
    // @ts-expect-error
    jest.spyOn(reduxStore, 'getState').mockReturnValue(mockedReduxStore);

    // when
    errorService.clearOperationsForPageBySiblings(mockedObjectData[0].objectWorkingId);

    // then
    expect(reduxStore.dispatch).toHaveBeenCalled();
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

    jest.spyOn(reduxStore, 'getState').mockReturnValue({
      popupStateReducer: { isDataOverviewOpen: true },
      // @ts-expect-error
      officeReducer: { isDialogOpen: false },
    });

    officeReducerHelper.displayPopup = jest.fn();
    jest.spyOn(errorService, 'closePromptsDialogInOverview').mockImplementation();
    jest.spyOn(officeReducerHelper, 'displayPopup').mockImplementation();
    reduxStore.dispatch = jest.fn();

    // when
    await errorService.handleError(error, { objectWorkingId, callback, operationData });

    // then
    expect(errorMessageFactoryMock).not.toHaveBeenCalled();
    expect(errorService.getErrorDetails).toHaveBeenCalled();
    expect(errorService.closePromptsDialogInOverview).toHaveBeenCalled();
    expect(reduxStore.dispatch).toHaveBeenCalled();
  });

  it('should handle non-overlapping tables error', async () => {
    // given
    const objectWorkingId = 123;
    const error = { Code: 1234 };
    const callback = jest.fn();
    const operationData = {} as OperationData;

    errorService.getErrorType = jest.fn().mockReturnValue('NON_OVERLAPPING_TABLES_ERR');
    errorService.getErrorDetails = jest.fn().mockReturnValue('error details');
    errorService.closePromptsDialogInOverview = jest.fn();
    errorService.closeDialogIfOpen = jest.fn().mockResolvedValue(true);

    const mockedReduxStore = {
      getState: jest.fn().mockReturnValue({
        popupStateReducer: { isDataOverviewOpen: false },
        officeReducer: { isDialogOpen: false },
      }),
    };

    jest.mock('../store', () => ({
      ...jest.requireActual('../store'),
      store: mockedReduxStore,
    }));

    jest.spyOn(reduxStore, 'getState').mockReturnValue({
      popupStateReducer: { isDataOverviewOpen: false },
      // @ts-expect-error
      officeReducer: { isDialogOpen: false },
    });

    jest.spyOn(errorService, 'closePromptsDialogInOverview').mockImplementation();

    // when
    await errorService.handleError(error, { objectWorkingId, callback, operationData });

    // then
    expect(errorService.getErrorDetails).toHaveBeenCalled();
    expect(errorService.closePromptsDialogInOverview).not.toHaveBeenCalled();
    expect(errorService.closeDialogIfOpen).toHaveBeenCalledWith(undefined, true);
    expect(officeReducerHelper.displayPopup).not.toHaveBeenCalled();
  });

  it.each`
    operationType                          | objectFromObjectReducer                                                  | expectedErrorType
    ${OperationTypes.IMPORT_OPERATION}     | ${{}}                                                                    | ${undefined}
    ${OperationTypes.CLEAR_DATA_OPERATION} | ${{ pageByData: { pageByDisplayType: PageByDisplayType.ALL_PAGES } }}    | ${undefined}
    ${OperationTypes.IMPORT_OPERATION}     | ${{ pageByData: { pageByDisplayType: PageByDisplayType.SELECT_PAGES } }} | ${ErrorType.PAGE_BY_IMPORT_ERR}
    ${OperationTypes.IMPORT_OPERATION}     | ${{ pageByData: { pageByDisplayType: PageByDisplayType.DEFAULT_PAGE } }} | ${undefined}
  `(
    'getPageByError should work properly',
    ({ operationType, objectFromObjectReducer, expectedErrorType }) => {
      // given
      const officeReducerHelperMock = jest
        .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
        .mockReturnValue(objectFromObjectReducer);
      // when
      const errorType = errorService.getPageByError(
        {
          operationType,
          objectWorkingId: 1,
        } as OperationData,
        {}
      );

      // then
      expect(officeReducerHelperMock).toHaveBeenCalled();
      expect(errorType).toEqual(expectedErrorType);
    }
  );
});
