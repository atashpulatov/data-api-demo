import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeContextMock } from './__mock__object__/OfficeContext';
import { officeDisplayService } from '../../office/office-display-service';
import { reduxStore } from '../../store';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { reportV2 } from '../mockDataV2';
import { officeStoreService } from '../../office/store/office-store-service';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { popupController } from '../../popup/popup-controller';
import { PopupTypeEnum } from '../../home/popup-type-enum';
import { sessionHelper } from '../../storage/session-helper';
import { OverlappingTablesError } from '../../error/overlapping-tables-error';
import officeConverterService from '../../office/office-converter-service-v2';
import { ALL_DATA_FILTERED_OUT } from '../../error/constants';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';

jest.mock('../../mstr-object/mstr-object-rest-service');
jest.mock('../../office/store/office-store-service');
jest.mock('../../authentication/authentication-helper');

describe.skip('OfficeDisplayService', () => {
  const givenReport = reportV2;
  const excelTableNameMock = 'table';

  const mstrContext = {
    envUrl: 'envUrl',
    projectId: 'pId'
  };

  beforeAll(() => {
    givenReport.mstrTable = officeConverterService.createTable(givenReport);

    jest
      .spyOn(officeApiHelper, 'getCurrentMstrContext')
      .mockReturnValue(mstrContext);
    jest.spyOn(officeApiHelper, 'getOfficeContext').mockReturnValue({ document: { bindings: { releaseByIdAsync: jest.fn() } } });
    jest.spyOn(officeApiHelper, 'getExcelContext').mockReturnValue({
      workbook: {
        tables: {
          getItem: () => ({
            delete: () => {},
            clearFilters: () => {}
          })
        },
        worksheets: { getActiveWorksheet: () => {} },
        bindings: { getItem: () => ({ getTable: () => {} }) }
      },
      sync: () => {}
    });
  });

  beforeEach(() => {
    const changedMock = jest
      .spyOn(mstrObjectRestService, 'createInstance')
      .mockResolvedValue({ mstrTable: { rows: [] } });
    changedMock.mockRestore();

    jest
      .spyOn(mstrObjectRestService, 'createInstance')
      .mockResolvedValue(givenReport);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should create instance when no instance id provided', async () => {
    // given
    const getObjectDefinitionSpy = jest.spyOn(
      mstrObjectRestService,
      'createInstance'
    );
    jest
      .spyOn(officeApiHelper, 'getSelectedCell')
      .mockImplementationOnce(() => {});
    jest
      .spyOn(officeApiHelper, 'formatNumbers')
      .mockImplementationOnce(() => {});
    jest.spyOn(officeApiHelper, 'formatTable').mockImplementationOnce(() => {});
    jest
      .spyOn(officeApiHelper, 'bindNamedItem')
      .mockImplementationOnce(() => {});
    jest
      .spyOn(officeDisplayService, '_dispatchPrintFinish')
      .mockImplementationOnce(() => {});
    jest
      .spyOn(officeDisplayService, '_createOfficeTable')
      .mockImplementationOnce(() => {});
    jest
      .spyOn(officeDisplayService, '_fetchInsertDataIntoExcel')
      .mockImplementationOnce(() => {});
    const options = {
      objectId: 'id123',
      projectId: 'p123',
      mstrObjectType: 'report'
    };
    // when
    await officeDisplayService._printObject(options);
    // then
    expect(getObjectDefinitionSpy).toBeCalled();
    expect(getObjectDefinitionSpy).toBeCalledWith(
      options.objectId,
      options.projectId,
      options.mstrObjectType,
      undefined,
      undefined
    );
  });

  it('should open loading popup when printing object', async () => {
    // given
    const givenBody = { id: 'id', name: 'name' };
    const getObjectDefinitionSpy = jest
      .spyOn(mstrObjectRestService, 'getObjectDefinition')
      .mockResolvedValue(givenBody);
    const runPopupSpy = jest.spyOn(popupController, 'runPopup');
    const printInside = jest
      .spyOn(officeDisplayService, '_printObject')
      .mockImplementationOnce(() => {});
    // {objectId, projectId, isReport = true, selectedCell, bindingId, isRefresh, dossierData, body, isPrompted, promptsAnswers}
    const options = {
      objectId: 'id123',
      projectId: 'p123',
      mstrObjectType: mstrObjectEnum.mstrObjectType.report,
    };
    const mockDialog = { close: () => {} };
    sessionHelper.setDialog(mockDialog);
    // when
    await officeDisplayService.printObject(options);
    // then
    expect(getObjectDefinitionSpy).toBeCalledWith(
      options.objectId,
      options.projectId,
      options.mstrObjectType
    );
    const { preLoadReport } = reduxStore.getState().officeReducer;
    expect(preLoadReport).toEqual(givenBody);
    expect(runPopupSpy).toBeCalledWith(PopupTypeEnum.loadingPage, 22, 28);
    expect(printInside).toBeCalledWith(options);
  });

  it('should add report to store as the first element in the array', () => {
    // given
    const report = {
      id: 'firstTestId',
      name: 'firstTestName',
      bindId: 'firstBindId',
      projectId: 'firstProjectId',
      envUrl: 'firstEnvUrl'
    };
    // when
    officeDisplayService.addReportToStore(report);
    const reportState = reduxStore.getState().officeReducer.reportArray;
    // then
    expect(reportState).toBeDefined();
    expect(reportState[0]).toEqual(report);
  });

  it('should call preserveReport on office store service', async () => {
    // given
    jest
      .spyOn(officeDisplayService, '_fetchInsertDataIntoExcel')
      .mockReturnValueOnce({});
    jest
      .spyOn(officeDisplayService, '_createOfficeTable')
      .mockReturnValueOnce({});
    jest
      .spyOn(officeApiHelper, 'createColumnsHeaders')
      .mockReturnValueOnce(() => {});
    jest.spyOn(officeApiHelper, 'getSelectedCell').mockReturnValueOnce({});
    jest.spyOn(officeApiHelper, 'bindNamedItem').mockReturnValueOnce({});
    jest.spyOn(officeApiHelper, 'formatTable').mockReturnValueOnce({});
    jest.spyOn(officeApiHelper, 'formatNumbers').mockReturnValueOnce({});

    const mockDialog = { close: () => {} };
    sessionHelper.setDialog(mockDialog);
    const instanceId = null;
    const objectId = null;
    // when
    await officeDisplayService.printObject({
      instanceId,
      objectId,
      projectId: mstrContext.projectId,
      isRefresh: false,
      selectedCell: 'A1'
    });
    // then
    expect(officeStoreService.preserveReport).toBeCalled();
    expect(officeStoreService.preserveReport).toBeCalledWith({
      id: givenReport.id,
      name: givenReport.name,
      bindId: excelTableNameMock,
      envUrl: mstrContext.envUrl,
      projectId: mstrContext.projectId,
      isLoading: false,
      crosstabHeaderDimensions: {
        columnsX: 6,
        columnsY: 2,
        rowsX: 2
      },
      isCrosstab: givenReport.definition.grid.crossTab,
      objectType: 'report'
    });
  });

  it('should call deleteReport on office store service', async () => {
    // given
    officeStoreService.deleteReport = jest.fn();
    authenticationHelper.validateAuthToken = jest
      .fn()
      .mockImplementation(() => {});
    officeApiHelper.getExcelContext = jest.fn().mockImplementation(() => ({
      workbook: {
        tables: {
          getItem: () => ({
            delete: () => {},
            clearFilters: () => {}
          })
        }
      },
      sync: () => {}
    }));
    const report = {
      id: 'firstTestId',
      name: 'firstTestName',
      bindId: 'firstBindId',
      projectId: 'firstProjectId',
      envUrl: 'firstEnvUrl'
    };
    officeDisplayService.addReportToStore(report);
    // when
    const bindingId = reduxStore.getState().officeReducer.reportArray[0].id;
    await officeDisplayService.removeReportFromExcel(bindingId);
    // then
    expect(authenticationHelper.validateAuthToken).toBeCalled();
    expect(officeStoreService.deleteReport).toBeCalled();
  });

  it('should not call deleteReport on office store service if there is no report', async () => {
    // given
    officeStoreService.deleteReport = jest.fn();
    authenticationHelper.validateAuthToken = jest
      .fn()
      .mockImplementation(() => {});
    const report = {
      id: 'firstTestId',
      name: 'firstTestName',
      bindId: 'firstBindId',
      projectId: 'firstProjectId',
      envUrl: 'firstEnvUrl'
    };
    officeDisplayService.addReportToStore(report);
    // when
    const bindingId = reduxStore.getState().officeReducer.reportArray[0].id;
    await officeDisplayService.removeReportFromExcel(bindingId);
    // then
    expect(authenticationHelper.validateAuthToken).toBeCalled();
    expect(officeStoreService.deleteReport).toBeCalled();
  });

  it('should not call deleteReport on office store service', async () => {
    // given
    officeStoreService.deleteReport = jest.fn();
    authenticationHelper.validateAuthToken = jest
      .fn()
      .mockImplementation(() => {
        throw Error();
      });
    const report = {
      id: 'firstTestId',
      name: 'firstTestName',
      bindId: 'firstBindId',
      projectId: 'firstProjectId',
      envUrl: 'firstEnvUrl'
    };
    officeDisplayService.addReportToStore(report);
    // when
    const bindingId = reduxStore.getState().officeReducer.reportArray[0].id;
    await officeDisplayService.removeReportFromExcel(bindingId);
    // then
    expect(authenticationHelper.validateAuthToken).toBeCalled();
    expect(officeStoreService.deleteReport).not.toBeCalled();
  });

  describe.skip('_createOfficeTable', async () => {
    it('should return officeTable proper name and invoke required methods', async () => {
      // given
      const mockedTable = {
        getHeaderRowRange: jest.fn().mockReturnValue({ values: [] }),
        getDataBodyRange: jest.fn().mockReturnValue({ values: [] }),
        load: jest.fn(),
        rows: {
          add: jest.fn(),
          clearFilters: jest.fn()
        }
      };
      const mockedWorksheet = {
        tables: { add: jest.fn().mockReturnValue(mockedTable) },
        getRange: jest.fn().mockReturnValue({
          value: 'A1:B5',
          getUsedRangeOrNullObject: jest
            .fn()
            .mockReturnValue({ isNullObject: true }),
          getOffsetRange: jest.fn(),
          getCell: jest.fn().mockReturnValue({
            getOffsetRange: jest.fn().mockReturnValue({
              getBoundingRect: jest.fn(),
              getResizedRange: jest.fn().mockReturnValue({ clear: jest.fn() })
            })
          })
        }),
        activate: jest.fn()
      };
      jest
        .spyOn(officeDisplayService, '_checkRangeValidity')
        .mockReturnValueOnce({});
      jest.spyOn(officeDisplayService, '_styleHeaders').mockReturnValueOnce({});
      jest.spyOn(officeApiHelper, 'getRange').mockReturnValueOnce('A1:B5');

      const getActiveWorksheetMock = jest.fn();
      getActiveWorksheetMock.mockReturnValue(mockedWorksheet);
      officeContextMock.workbook.worksheets.getActiveWorksheet = getActiveWorksheetMock;
      officeContextMock.sync = jest.fn();
      officeContextMock.trackedObjects = { add: jest.fn() };
      const startCell = 'A1';
      const chosenObjectName = 'someReportName';
      // when
      const result = await officeDisplayService._createOfficeTable(
        reportV2,
        officeContextMock,
        startCell,
        chosenObjectName
      );
      // then
      expect(getActiveWorksheetMock).toBeCalled();
      expect(result.name).toEqual(chosenObjectName);
    });
    it('should delete prevOfficeTable on refresh if table definition changed and range is available', async () => {
      // given
      const mockedTable = {
        getHeaderRowRange: jest.fn().mockReturnValue({ values: [] }),
        getDataBodyRange: jest.fn().mockReturnValue({ values: [] }),
        load: jest.fn(),
        rows: {
          add: jest.fn(),
          clearFilters: jest.fn()
        }
      };
      const mockedWorksheet = {
        tables: { add: jest.fn().mockReturnValue(mockedTable) },
        getRange: jest.fn().mockReturnValue({
          value: 'A1:B5',
          getUsedRangeOrNullObject: jest
            .fn()
            .mockReturnValue({ isNullObject: true }),
          getOffsetRange: jest.fn(),
          getCell: jest.fn().mockReturnValue({
            getOffsetRange: jest.fn().mockReturnValue({
              getBoundingRect: jest.fn(),
              getResizedRange: jest.fn().mockReturnValue({ clear: jest.fn() })
            })
          })
        }),
        activate: jest.fn()
      };
      const mockedPrevTable = {
        delete: jest.fn(),
        rows: { count: 1, load: jest.fn() },
        columns: { count: 1 },
        worksheet: mockedWorksheet
      };
      jest
        .spyOn(officeApiHelper, 'createColumnsHeaders')
        .mockReturnValueOnce(() => {});
      jest
        .spyOn(officeDisplayService, '_checkRangeValidity')
        .mockReturnValueOnce({});
      jest.spyOn(officeDisplayService, '_styleHeaders').mockReturnValueOnce({});
      jest.spyOn(officeApiHelper, 'getRange').mockReturnValueOnce('A1:B5');

      const getActiveWorksheetMock = jest.fn();
      getActiveWorksheetMock.mockReturnValue(mockedWorksheet);
      officeContextMock.workbook.worksheets.getActiveWorksheet = getActiveWorksheetMock;
      officeContextMock.sync = jest.fn();
      officeContextMock.trackedObjects = { add: jest.fn() };
      const startCell = 'A1';
      const chosenObjectName = 'someReportName';
      // when
      const result = await officeDisplayService._createOfficeTable(
        givenReport,
        officeContextMock,
        startCell,
        chosenObjectName,
        mockedPrevTable
      );
      // then
      expect(mockedPrevTable.delete).toBeCalled();
      expect(result.name).toEqual(chosenObjectName);
    });
  });
  describe.skip('_checkRangeValidity', async () => {
    it('should return null when data range is empty', async () => {
      // given
      jest.spyOn(officeDisplayService, '_checkRangeValidity').mockRestore();
      const mockedWorksheet = {
        getRange: jest.fn().mockReturnValue({
          value: [],
          getUsedRangeOrNullObject: jest
            .fn()
            .mockReturnValue({ isNullObject: true })
        }),
        activate: jest.fn()
      };
      const mockedRange = mockedWorksheet.getRange();
      officeContextMock.sync = jest.fn();
      officeContextMock.trackedObjects = { add: jest.fn() };

      // when
      const result = await officeDisplayService._checkRangeValidity(
        officeContextMock,
        mockedRange
      );
      // then
      expect(result).toBeUndefined();
    });
    it('should return OverlappingTables error when data range is not empty', async () => {
      // given
      const mockedWorksheet = {
        getRange: jest.fn().mockReturnValue({
          value: [],
          getUsedRangeOrNullObject: jest
            .fn()
            .mockReturnValue({ isNullObject: false })
        }),
        activate: jest.fn()
      };
      const mockedRange = mockedWorksheet.getRange();
      officeContextMock.sync = jest.fn();
      officeContextMock.trackedObjects = { add: jest.fn() };
      try {
        // when
        await officeDisplayService._checkRangeValidity(
          officeContextMock,
          mockedRange
        );
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(OverlappingTablesError);
      }
    });
  });
  describe.skip('_FetchInsertDataIntoExcel', () => {
    it('should call getObjectGenerator', () => {
      // given
      const mockConnectionData = {
        objectId: 'objectId',
        projectId: 'projectId',
        mstrObjectType: 'report',
        isCrosstab: true,
        body: {}
      };
      const mockOfficeData = { excelContext: {}, officeTable: {} };
      const mockGetObjectContentGenerator = jest
        .spyOn(mstrObjectRestService, 'getObjectContentGenerator')
        .mockReturnValueOnce([]);
      const options = {
        connectionData: mockConnectionData,
        officeData: mockOfficeData,
        instanceDefinition: givenReport,
        isRefresh: false
      };
      // when
      officeDisplayService._fetchInsertDataIntoExcel(options);
      // then
      expect(mockGetObjectContentGenerator).toBeCalled();
    });
  });
  describe.skip('_appendRowsToTable', () => {
    it('should not call range.clear on import', () => {
      // given
      const mockClear = jest.fn();
      const mockOfficeTable = { getDataBodyRange: () => ({ getRow: () => ({ getResizedRange: () => ({ getOffsetRange: () => ({ clear: mockClear }) }) }) }) };
      // when
      officeDisplayService._appendRowsToTable(mockOfficeTable, [], 0, false);
      // then
      expect(mockClear).not.toBeCalled();
    });
    it('should call range.clear on refresh', () => {
      // given
      const mockClear = jest.fn();
      const mockOfficeTable = { getDataBodyRange: () => ({ getRow: () => ({ getResizedRange: () => ({ getOffsetRange: () => ({ clear: mockClear }) }) }) }) };
      // when
      officeDisplayService._appendRowsToTable(mockOfficeTable, [], 0, true);
      // then
      expect(mockClear).toBeCalled();
    });
  });

  describe.skip.skip('delete report', () => {
    it('should fail', () => {
      // given
      // when
      // then
      expect(false).toBeTruthy();
    });
    it.skip('it should fail', () => {
      // given
      // when
      expect(false).toBeTruthy();
      // then
    });
  });

  it('should print proper warning message when empty prompted report', async () => {
    const changedMock = jest
      .spyOn(mstrObjectRestService, 'createInstance')
      .mockResolvedValue({ mstrTable: { rows: [] } });
    jest
      .spyOn(officeApiHelper, 'getSelectedCell')
      .mockImplementationOnce(() => {});
    jest
      .spyOn(officeApiHelper, 'formatNumbers')
      .mockImplementationOnce(() => {});
    jest.spyOn(officeApiHelper, 'formatTable').mockImplementationOnce(() => {});
    jest
      .spyOn(officeApiHelper, 'bindNamedItem')
      .mockImplementationOnce(() => {});
    jest
      .spyOn(officeDisplayService, '_dispatchPrintFinish')
      .mockImplementationOnce(() => {});
    jest
      .spyOn(officeDisplayService, '_createOfficeTable')
      .mockImplementationOnce(() => {});
    jest
      .spyOn(officeDisplayService, '_fetchInsertDataIntoExcel')
      .mockImplementationOnce(() => {});
    const options = {
      objectId: 'id123',
      projectId: 'p123',
      mstrObjectType: 'report',
      isPrompted: true,
      promptsAnswers: []
    };
    // when
    const resultMessage = await officeDisplayService._printObject(options);
    // then
    expect(resultMessage).toBeDefined();
    expect(resultMessage).toEqual({
      message: ALL_DATA_FILTERED_OUT,
      type: 'warning'
    });
  });
});
