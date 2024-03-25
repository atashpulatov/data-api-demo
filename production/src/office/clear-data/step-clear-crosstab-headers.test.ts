import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepClearCrosstabHeaders from './step-clear-crosstab-headers';

describe('StepClearCrosstabHeaders', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
    objectExist | isCrosstab | calledClearHeaders
    ${true}     | ${true}    | ${1}
    ${true}     | ${false}   | ${0}
    ${false}    | ${true}    | ${0}
    ${false}    | ${false}   | ${0}
  `(
    'clearCrosstabHeaders should works correctly',
    async ({ objectExist, isCrosstab, calledClearHeaders }) => {
      // given
      const objectData = { isCrosstab, bindId: 1 } as unknown as ObjectData;
      const operationData = {
        objectWorkingId: 1,
        excelContext: { sync: jest.fn() },
        objectExist,
      } as unknown as OperationData;
      const mockedGetHeaderRowRange = jest.fn().mockReturnValue({ format: { font: {} } });

      const mockedGetTable = jest
        .spyOn(officeApiHelper, 'getTable')
        .mockReturnValue({ getHeaderRowRange: mockedGetHeaderRowRange } as any);
      const mockedClearCrosstabRange = jest
        .spyOn(officeApiCrosstabHelper, 'clearCrosstabRange')
        .mockImplementation();
      const mockedCheckObject = jest
        .spyOn(officeApiCrosstabHelper, 'clearCrosstabRowForTableHeader')
        .mockImplementation();
      const mockedCompleteStep = jest
        .spyOn(operationStepDispatcher, 'completeClearCrosstabHeaders')
        .mockImplementation();

      // when
      await stepClearCrosstabHeaders.clearCrosstabHeaders(objectData, operationData);

      // then
      expect(mockedGetTable).toBeCalledTimes(calledClearHeaders);
      expect(mockedCheckObject).toBeCalledTimes(calledClearHeaders);
      expect(mockedClearCrosstabRange).toBeCalledTimes(calledClearHeaders);
      expect(mockedCompleteStep).toBeCalledTimes(1);
      expect(mockedCompleteStep).toBeCalledWith(operationData.objectWorkingId);
    }
  );

  it('should handle error on clearCrosstabHeaders', async () => {
    // given
    const objectData = { isCrosstab: true, bindId: 1 } as unknown as ObjectData;
    const operationData = {
      objectWorkingId: 1,
      excelContext: { sync: jest.fn() },
      objectExist: true,
    } as unknown as OperationData;
    const error = new Error('error');

    jest.spyOn(console, 'error').mockImplementation();
    const mockedGetTable = jest.spyOn(officeApiHelper, 'getTable').mockImplementation(() => {
      throw error;
    });
    const mockedHandleError = jest
      .spyOn(operationErrorHandler, 'handleOperationError')
      .mockImplementation();

    // when
    await stepClearCrosstabHeaders.clearCrosstabHeaders(objectData, operationData);

    // then
    expect(mockedGetTable).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledWith(objectData, operationData, error);
  });
});
