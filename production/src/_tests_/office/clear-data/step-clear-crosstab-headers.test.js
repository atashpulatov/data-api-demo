import operationErrorHandler from '../../../operation/operation-error-handler';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import { officeApiCrosstabHelper } from '../../../office/api/office-api-crosstab-helper';
import stepClearCrosstabHeaders from '../../../office/clear-data/step-clear-crosstab-headers';

describe('StepClearCrosstabHeaders', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });


  it.each`
  objectExist    | isCrosstab | calledClearHeaders
  ${true}        | ${true}    | ${1}
  ${true}        | ${false}   | ${0}
  ${false}       | ${true}    | ${0}
  ${false}       | ${false}   | ${0}
  
`('clearCrosstabHeaders should works correctly', async ({ objectExist, isCrosstab, calledClearHeaders }) => {
  // given
  const objectData = { isCrosstab, bindId: 1 };
  const operationData = { objectWorkingId: 1, excelContext: { sync: jest.fn() }, objectExist };
  const mockedGetHeaderRowRange = jest.fn().mockReturnValue({ format: { font: {} } });


  const mockedGetTable = jest.spyOn(officeApiHelper, 'getTable').mockReturnValue({ getHeaderRowRange: mockedGetHeaderRowRange });
  const mockedCheckObject = jest.spyOn(officeApiCrosstabHelper, 'clearEmptyCrosstabRow').mockImplementation();
  const mockedCompleteStep = jest.spyOn(operationStepDispatcher, 'completeClearCrosstabHeaders').mockImplementation();

  // when
  await stepClearCrosstabHeaders.clearCrosstabHeaders(objectData, operationData);

  // then
  expect(mockedGetTable).toBeCalledTimes(calledClearHeaders);
  expect(mockedCheckObject).toBeCalledTimes(calledClearHeaders);
  expect(mockedCompleteStep).toBeCalledTimes(1);
  expect(mockedCompleteStep).toBeCalledWith(operationData.objectWorkingId);
});

  it('should handle error on clearCrosstabHeaders', async () => {
    // given
    const objectData = { isCrosstab: true, bindId: 1 };
    const operationData = { objectWorkingId: 1, excelContext: { sync: jest.fn() }, objectExist: true };
    const error = new Error('error');

    jest.spyOn(console, 'error').mockImplementation();
    const mockedGetTable = jest.spyOn(officeApiHelper, 'getTable').mockImplementation(() => { throw error; });
    const mockedHandleError = jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepClearCrosstabHeaders.clearCrosstabHeaders(objectData, operationData);

    // then
    expect(mockedGetTable).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledWith(objectData, operationData, error);
  });
});
