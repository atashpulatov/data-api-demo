import { browserHelper } from '../../helpers/browser-helper';
import { officeApiHelper } from '../api/office-api-helper';
import { officeRemoveHelper } from './office-remove-helper';

import { ObjectData } from '../../types/object-types';

import officeApiDataLoader from '../api/office-api-data-loader';

describe('OfficeRemoveHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('removeOfficeTableBody should work as expected', async () => {
    // given
    const isClear = true;
    const object = {
      isCrosstab: true,
      crosstabHeaderDimensions: {},
      name: 'object',
      objectWorkingId: 1234567,
      objectId: 'objectId',
      projectId: 'projectId',
    } as ObjectData;
    const officeTable = {};
    const excelContextSyncMock = jest.fn();
    const getItemMock = jest.fn().mockReturnValue(officeTable);
    const excelContextMock = {
      sync: excelContextSyncMock,
      workbook: {
        tables: { getItem: getItemMock },
      },
    } as unknown as Excel.RequestContext;

    const removeTableMock = jest.spyOn(officeRemoveHelper, 'removeExcelTable').mockResolvedValue();

    // when
    await officeRemoveHelper.removeOfficeTableBody(excelContextMock, object, isClear);

    // then
    expect(removeTableMock).toBeCalledTimes(1);
    expect(removeTableMock).toBeCalledWith(
      officeTable,
      excelContextMock,
      object,
      object.isCrosstab
    );
    expect(removeTableMock).toBeCalledWith(
      officeTable,
      excelContextMock,
      object,
      object.isCrosstab
    );
    expect(getItemMock).toBeCalledTimes(1);
  });

  it('deleteTableInChunks should work as expected', async () => {
    // given
    const excelContextSyncMock = jest.fn();
    const deleteMock = jest.fn().mockImplementation();
    const officeTable = { delete: deleteMock } as unknown as Excel.Table;
    const excelContextMock = {
      sync: excelContextSyncMock,
    } as unknown as Excel.RequestContext;

    const deleteRowsMock = jest.spyOn(officeRemoveHelper, 'deleteRowsInChunks').mockResolvedValue();

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
          suspendApiCalculationUntilNextSync: suspendApiCalculationUntilNextSyncMock,
        },
      },
    } as unknown as Excel.RequestContext;
    jest.spyOn(officeApiDataLoader, 'loadSingleExcelData').mockResolvedValue(0);

    // when
    await officeRemoveHelper.deleteRowsInChunks(
      excelContextMock,
      { rows: 'rowsTest' } as unknown as Excel.Table,
      1,
      1
    );

    // then
    expect(officeApiDataLoader.loadSingleExcelData).toBeCalledTimes(1);
    expect(officeApiDataLoader.loadSingleExcelData).toBeCalledWith(
      excelContextMock,
      'rowsTest',
      'count'
    );
    expect(suspendApiCalculationUntilNextSyncMock).toBeCalledTimes(1);
  });

  it('checkIfObjectExist should work as expected', async () => {
    // given
    const object = { bindId: 1 };
    const excelContextSyncMock = jest.fn();
    const excelContextMock = {
      sync: excelContextSyncMock,
    } as unknown as Excel.RequestContext;

    const getTableMock = jest.spyOn(officeApiHelper, 'getTable').mockResolvedValue({} as never);

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
    } as unknown as Excel.RequestContext;

    const getTableMock = jest.spyOn(officeApiHelper, 'getTable').mockImplementation(() => {
      throw new Error();
    });

    // when
    const result = await officeRemoveHelper.checkIfObjectExist(object, excelContextMock);

    // then
    expect(getTableMock).toBeCalledTimes(1);
    expect(result).toBe(false);
  });

  it.each`
    expectedRowsNo | contextLimitParam | newRowsCount | expectedLoopSteps
    ${600}         | ${500}            | ${50}        | ${2}
    ${20}          | ${100}            | ${9}         | ${1}
    ${39}          | ${10}             | ${1}         | ${4}
    ${10000}       | ${500}            | ${484}       | ${20}
  `(
    'updateRows should work as expected when newRowCount < tableRowCount',
    async ({ expectedRowsNo, contextLimitParam, newRowsCount, expectedLoopSteps }) => {
      let i = 0;
      jest
        .spyOn(officeApiDataLoader, 'loadSingleExcelData')
        .mockImplementation(async (): Promise<any> => {
          const newRowsValue = expectedRowsNo - i * contextLimitParam;
          i += 1;
          return newRowsValue;
        });
      const excelContextSyncMock = jest.fn();
      const suspendApiCalculationUntilNextSyncMock = jest.fn();
      const excelContextMock = {
        sync: excelContextSyncMock,
        workbook: {
          application: {
            suspendApiCalculationUntilNextSync: suspendApiCalculationUntilNextSyncMock,
          },
        },
      } as unknown as Excel.RequestContext;

      const deleteMock = jest.fn();
      const getResizedRangeMock = jest.fn().mockReturnValue({
        delete: deleteMock,
      });
      const prevOfficeTable = {
        rows: 'rowsTest',
        getRange: () => ({
          getLastRow: () => ({
            getResizedRange: getResizedRangeMock,
          }),
        }),
      } as unknown as Excel.Table;
      // when
      await officeRemoveHelper.deleteRowsInChunks(
        excelContextMock,
        prevOfficeTable,
        contextLimitParam,
        newRowsCount
      );
      // then
      expect(deleteMock).toHaveBeenCalledTimes(expectedLoopSteps);
      expect(excelContextSyncMock).toHaveBeenCalledTimes(expectedLoopSteps);
      expect(getResizedRangeMock).toHaveBeenCalledTimes(expectedLoopSteps);

      const nrOfRowsToDeleteInLastStep = -(
        expectedRowsNo -
        (expectedLoopSteps - 1) * contextLimitParam -
        (newRowsCount + 1)
      );

      expect(getResizedRangeMock).toHaveBeenNthCalledWith(
        expectedLoopSteps,
        nrOfRowsToDeleteInLastStep,
        0
      );
    }
  );

  it.each`
    isClear      | isSafari
    ${true}      | ${false}
    ${false}     | ${true}
    ${false}     | ${false}
    ${true}      | ${false}
    ${false}     | ${true}
    ${false}     | ${false}
    ${undefined} | ${false}
  `('removeExcelTable should work as expected', async ({ isClear, isSafari }) => {
    const deleteMock = jest.fn().mockImplementation();
    const excelContextSyncMock = jest.fn().mockReturnValue({});
    const getDataBodyRangeMock = jest.fn().mockReturnValue({ clear: jest.fn() });

    const addtrackedObjectsMock = jest.fn();
    const removetrackedObjectsMock = jest.fn();
    const excelContextMock = {
      sync: excelContextSyncMock,
      trackedObjects: {
        add: addtrackedObjectsMock,
        remove: removetrackedObjectsMock,
      },
      runtime: {},
    } as unknown as Excel.RequestContext;

    const officeTable = {
      getDataBodyRange: getDataBodyRangeMock,
      delete: deleteMock,
    } as unknown as Excel.Table;

    const deleteTableInChunksMock = jest
      .spyOn(officeRemoveHelper, 'deleteTableInChunks')
      .mockResolvedValue();
    const isMacAndSafariBasedMock = jest
      .spyOn(browserHelper, 'isMacAndSafariBased')
      .mockReturnValue(isSafari);

    const objectData = {
      name: 'object',
      objectWorkingId: 1234567,
      objectId: 'objectId',
      projectId: 'projectId',
      mstrObjectType: {
        name: 'report',
      },
    } as ObjectData;

    // when
    await officeRemoveHelper.removeExcelTable(officeTable, excelContextMock, objectData, isClear);

    // then
    const isnotClearCalledTimes = !isClear ? 1 : 0;
    const deleteMockCalledTimes = !isClear && !isSafari ? 1 : 0;
    const deleteTableInChunksMockCalledTimes = !isClear && isSafari ? 1 : 0;

    expect(getDataBodyRangeMock).toBeCalledTimes(1);
    expect(isMacAndSafariBasedMock).toBeCalledTimes(isnotClearCalledTimes);
    expect(deleteMock).toBeCalledTimes(deleteMockCalledTimes);
    expect(deleteTableInChunksMock).toBeCalledTimes(deleteTableInChunksMockCalledTimes);
  });
});
