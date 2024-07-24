import { officeApiHelper } from '../api/office-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import officeTableCreate from './office-table-create';
import stepGetFormattedDataTableImport from './step-get-formatted-data-table-import';

describe('stepGetFormattedDataTableImport', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getFormattedDataTableImport should log exceptions', async () => {
    const worksheet = {
      load: jest.fn(),
      delete: jest.fn(),
    } as unknown as Excel.Worksheet;

    const excelContextMock = { sync: jest.fn() } as unknown as Excel.RequestContext;

    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeTableCreate, 'createFormattedDataOfficeTable').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest.spyOn(officeApiHelper, 'getExcelSheetById').mockReturnValueOnce(worksheet);

    // when
    await stepGetFormattedDataTableImport.getFormattedDataTableImport({} as ObjectData, {
      formattedData: {
        sourceWorksheetId: 'sourceWorksheetId'
      },
      excelContext: excelContextMock
    } as OperationData);
    // then
    expect(officeTableCreate.createFormattedDataOfficeTable).toHaveBeenCalled();
    expect(officeTableCreate.createOfficeTable).toThrowError(Error);
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(new Error('errorTest'));

    expect(officeApiHelper.getExcelSheetById).toHaveBeenCalled();
    expect(worksheet.delete).toHaveBeenCalled();
    expect(excelContextMock.sync).toHaveBeenCalled();

    expect(operationErrorHandler.handleOperationError).toHaveBeenCalled();
  })
});
