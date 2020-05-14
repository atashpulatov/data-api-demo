import { officeRemoveHelper } from '../../../office/remove/office-remove-helper';
import officeApiDataLoader from '../../../office/api/office-api-data-loader';

describe('OfficeRemoveHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('updateRows should work as expected when newRowCount >= tableRowCount', async () => {
    // given
    const excelContextSyncMock = jest.fn();
    const suspendApiCalculationUntilNextSyncMock = jest.fn();
    const excelContextMock = {
      sync: excelContextSyncMock,
      workbook: {
        application: {
          suspendApiCalculationUntilNextSync: suspendApiCalculationUntilNextSyncMock
        },
      },
    };
    jest.spyOn(officeApiDataLoader, 'loadSingleExcelData').mockReturnValue(0);

    // when
    await officeRemoveHelper.deleteRowsInChunks(excelContextMock, { rows: 'rowsTest' }, 1, 1);

    // then
    expect(officeApiDataLoader.loadSingleExcelData).toBeCalledTimes(1);
    expect(officeApiDataLoader.loadSingleExcelData).toBeCalledWith(excelContextMock, 'rowsTest', 'count');
    expect(suspendApiCalculationUntilNextSyncMock).toBeCalledTimes(1);
  });

  it.each`
      expectedRowsNo | contextLimitParam | newRowsCount | expectedLoopSteps
      
      ${600}         | ${500}            | ${50}        | ${2}
      ${20}          | ${100}            | ${9}         | ${1}
      ${39}          | ${10}             | ${1}         | ${4}
      ${10000}       | ${500}            | ${484}       | ${20}
    
      `('updateRows should work as expected when newRowCount < tableRowCount',
  async ({ expectedRowsNo, contextLimitParam, newRowsCount, expectedLoopSteps }) => {
    let i = 0;
    jest.spyOn(officeApiDataLoader, 'loadSingleExcelData').mockImplementation(() => {
      const newRowsValue = expectedRowsNo - (i * contextLimitParam);
      i += 1;
      return newRowsValue;
    });
    const excelContextSyncMock = jest.fn();
    const suspendApiCalculationUntilNextSyncMock = jest.fn();
    const excelContextMock = {
      sync: excelContextSyncMock,
      workbook: {
        application: {
          suspendApiCalculationUntilNextSync: suspendApiCalculationUntilNextSyncMock
        },
      },
    };
    const deleteMock = jest.fn();
    const getRowsAboveMock = jest.fn().mockReturnValue({
      delete: deleteMock
    });
    const prevOfficeTable = {
      rows: 'rowsTest',
      getRange: () => ({
        getLastRow: () => ({
          getRowsAbove: getRowsAboveMock
        })
      })
    };
    // when
    await officeRemoveHelper.deleteRowsInChunks(excelContextMock, prevOfficeTable, contextLimitParam, newRowsCount);
    // then
    expect(deleteMock).toHaveBeenCalledTimes(expectedLoopSteps);
    expect(excelContextSyncMock).toHaveBeenCalledTimes(expectedLoopSteps);
    expect(getRowsAboveMock).toHaveBeenCalledTimes(expectedLoopSteps);

    const nrOfRowsToDeleteInLastStep = expectedRowsNo - ((expectedLoopSteps - 1) * contextLimitParam) - newRowsCount;
    expect(getRowsAboveMock).toHaveBeenNthCalledWith(expectedLoopSteps, nrOfRowsToDeleteInLastStep);
  });
});
