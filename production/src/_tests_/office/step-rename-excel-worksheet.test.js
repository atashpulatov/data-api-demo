import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';

import stepRenameExcelWorksheet from '../../office/step-rename-excel-worksheet';
import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

describe('StepRenameExcelWorksheet', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renameExcelWorksheet should handle exception', async () => {
    // given
    const operationData = { shouldRenameExcelWorksheet: true };

    jest.spyOn(console, 'error');

    jest.spyOn(officeApiWorksheetHelper, 'renameExistingWorksheet').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepRenameExcelWorksheet.renameExcelWorksheet({}, operationData);

    // then
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith(
      {},
      operationData,
      new Error('errorTest')
    );
  });

  it('renameExcelWorksheet should execute renameExistingWorksheet', async () => {
    // given
    const objectData = {
      objectWorkingId: 'objectWorkingIdTest',
      name: 'test',
      worksheet: { id: '1', name: 'Sheet 1' },
    };
    const excelContext = { sync: jest.fn() };
    const operationData = {
      excelContext,
      shouldRenameExcelWorksheet: true,
    };
    const expectedObject = {
      ...objectData,
      worksheet: {
        id: '1',
        name: 'test',
      },
    };

    jest
      .spyOn(officeApiWorksheetHelper, 'renameExistingWorksheet')
      .mockImplementation(() => 'test');
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    // when
    await stepRenameExcelWorksheet.renameExcelWorksheet(objectData, operationData);

    // then
    expect(officeApiWorksheetHelper.renameExistingWorksheet).toBeCalledTimes(1);
    expect(officeApiWorksheetHelper.renameExistingWorksheet).toBeCalledWith(excelContext, 'test');
    expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateObject).toBeCalledWith(expectedObject);
  });

  it('renameExcelWorksheet should NOT execute renameExistingWorksheet', async () => {
    // given
    const objectData = {
      objectWorkingId: 'objectWorkingIdTest',
      name: 'test',
    };
    const excelContext = { sync: jest.fn() };
    const operationData = {
      excelContext,
      shouldRenameExcelWorksheet: false,
    };

    jest.spyOn(officeApiWorksheetHelper, 'renameExistingWorksheet').mockImplementation();

    // when
    await stepRenameExcelWorksheet.renameExcelWorksheet(objectData, operationData);

    // then
    expect(officeApiWorksheetHelper.renameExistingWorksheet).toBeCalledTimes(0);
  });
});
