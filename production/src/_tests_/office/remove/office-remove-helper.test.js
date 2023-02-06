import { officeRemoveHelper } from '../../../office/remove/office-remove-helper';
import officeApiDataLoader from '../../../office/api/office-api-data-loader';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import officeStoreObject from '../../../office/store/office-store-object';
import { officeApiCrosstabHelper } from '../../../office/api/office-api-crosstab-helper';
import { homeHelper } from '../../../home/home-helper';

describe('OfficeRemoveHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('removeOfficeTableBody should work as expected', async () => {
    // given
    const isClear = true;
    const object = { isCrosstab: true, crosstabHeaderDimensions: {} };
    const officeTable = {};
    const excelContextSyncMock = jest.fn();
    const getItemMock = jest.fn().mockReturnValue(officeTable);
    const excelContextMock = {
      sync: excelContextSyncMock,
      workbook: {
        tables: { getItem: getItemMock }
      },
    };

    const removeTableMock = jest.spyOn(officeRemoveHelper, 'removeExcelTable').mockReturnValue(0);

    // when
    await officeRemoveHelper.removeOfficeTableBody(excelContextMock, object, isClear);

    // then
    expect(removeTableMock).toBeCalledTimes(1);
    expect(removeTableMock).toBeCalledWith(
      officeTable,
      excelContextMock,
      object.isCrosstab,
      object.crosstabHeaderDimensions,
      isClear
    );
    expect(getItemMock).toBeCalledTimes(1);
  });

  it('deleteTableInChunks should work as expected', async () => {
    // given
    const excelContextSyncMock = jest.fn();
    const deleteMock = jest.fn().mockImplementation();
    const officeTable = { delete: deleteMock };
    const excelContextMock = {
      sync: excelContextSyncMock,
    };

    const deleteRowsMock = jest.spyOn(officeRemoveHelper, 'deleteRowsInChunks').mockReturnValue(0);

    // when
    await officeRemoveHelper.deleteTableInChunks(excelContextMock, officeTable);

    // then
    expect(deleteRowsMock).toBeCalledTimes(1);
    expect(deleteMock).toBeCalledTimes(1);
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

  it('checkIfObjectExist should work as expected', async () => {
    // given
    const object = { bindId: 1 };
    const excelContextSyncMock = jest.fn();
    const excelContextMock = {
      sync: excelContextSyncMock,
    };

    const getTableMock = jest.spyOn(officeApiHelper, 'getTable').mockReturnValue(0);

    // when
    const result = await officeRemoveHelper.checkIfObjectExist(object, excelContextMock);

    // then
    expect(getTableMock).toBeCalledTimes(1);
    expect(result).toBe(true);
  });

  it('checkIfObjectExist should return false if object does not exist', async () => {
    // given
    const object = { bindId: 1 };
    const excelContextSyncMock = jest.fn();
    const excelContextMock = {
      sync: excelContextSyncMock,
    };

    const getTableMock = jest.spyOn(officeApiHelper, 'getTable').mockImplementation(() => { throw new Error(); });

    // when
    const result = await officeRemoveHelper.checkIfObjectExist(object, excelContextMock);

    // then
    expect(getTableMock).toBeCalledTimes(1);
    expect(result).toBe(false);
  });

  it('removeObjectNotExistingInExcel should work as expected', async () => {
    // given
    const releaseByIdAsyncMock = jest.fn().mockImplementation();
    const object = { bindId: 1 };
    const officeContextMock = {
      document: { bindings: { releaseByIdAsync: releaseByIdAsyncMock } }
    };

    const deleteRowsMock = jest.spyOn(officeStoreObject, 'removeObjectFromStore').mockReturnValue(0);

    // when
    await officeRemoveHelper.removeObjectNotExistingInExcel(object, officeContextMock);

    // then
    expect(deleteRowsMock).toBeCalledTimes(1);
    expect(releaseByIdAsyncMock).toBeCalledTimes(1);
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
      const getResizedRangeMock = jest.fn().mockReturnValue({
        delete: deleteMock
      });
      const prevOfficeTable = {
        rows: 'rowsTest',
        getRange: () => ({
          getLastRow: () => ({
            getResizedRange: getResizedRangeMock
          })
        })
      };
      // when
      await officeRemoveHelper.deleteRowsInChunks(excelContextMock, prevOfficeTable, contextLimitParam, newRowsCount);
      // then
      expect(deleteMock).toHaveBeenCalledTimes(expectedLoopSteps);
      expect(excelContextSyncMock).toHaveBeenCalledTimes(expectedLoopSteps);
      expect(getResizedRangeMock).toHaveBeenCalledTimes(expectedLoopSteps);

      const nrOfRowsToDeleteInLastStep = -(expectedRowsNo - ((expectedLoopSteps - 1)
      * contextLimitParam) - (newRowsCount + 1));

      expect(getResizedRangeMock).toHaveBeenNthCalledWith(expectedLoopSteps, nrOfRowsToDeleteInLastStep, 0);
    });

  it.each`
  isCrosstab | isClear       | isSafari
  
  ${true}    | ${true}       | ${false}
  ${true}    | ${false}      | ${true}
  ${true}    | ${false}      | ${false}
  ${false}   | ${true}       | ${false}
  ${false}   | ${false}      | ${true}
  ${false}   | ${false}      | ${false}
  ${false}   | ${undefined}  | ${false}

  `('removeExcelTable should work as expected', async ({ isCrosstab, isClear, isSafari }) => {
    const deleteMock = jest.fn().mockImplementation();
    const excelContextSyncMock = jest.fn().mockReturnValue();
    const getDataBodyRangeMock = jest.fn().mockReturnValue({ clear: jest.fn() });

    const addtrackedObjectsMock = jest.fn();
    const removetrackedObjectsMock = jest.fn();
    const excelContextMock = {
      sync: excelContextSyncMock,
      trackedObjects: { add: addtrackedObjectsMock, remove: removetrackedObjectsMock },
      runtime: {}
    };

    const crosstabHeaderDimensions = isCrosstab ? {} : undefined;
    const officeTable = { getDataBodyRange: getDataBodyRangeMock, delete: deleteMock };

    const deleteTableInChunksMock = jest.spyOn(officeRemoveHelper, 'deleteTableInChunks').mockReturnValue(0);
    const clearCrosstabRangeMock = jest.spyOn(officeApiCrosstabHelper, 'clearCrosstabRange').mockReturnValue(0);
    const clearEmptyCrosstabRowMock = jest.spyOn(officeApiCrosstabHelper, 'clearEmptyCrosstabRow').mockReturnValue(0);
    const isMacAndSafariBasedMock = jest.spyOn(homeHelper, 'isMacAndSafariBased').mockReturnValue(isSafari);

    // when
    await officeRemoveHelper.removeExcelTable(
      officeTable,
      excelContextMock,
      isCrosstab,
      crosstabHeaderDimensions,
      isClear
    );

    // then
    const isCrosstabCalledTimes = isCrosstab ? 1 : 0;
    const isnotClearCalledTimes = !isClear ? 1 : 0;
    const deleteMockCalledTimes = !isClear && !isSafari ? 1 : 0;
    const deleteTableInChunksMockCalledTimes = !isClear && isSafari ? 1 : 0;

    expect(getDataBodyRangeMock).toBeCalledTimes(1);
    expect(clearCrosstabRangeMock).toBeCalledTimes(isCrosstabCalledTimes);
    expect(clearEmptyCrosstabRowMock).toBeCalledTimes(isCrosstabCalledTimes);
    expect(isMacAndSafariBasedMock).toBeCalledTimes(isnotClearCalledTimes);
    expect(deleteMock).toBeCalledTimes(deleteMockCalledTimes);
    expect(deleteTableInChunksMock).toBeCalledTimes(deleteTableInChunksMockCalledTimes);
  });
});
