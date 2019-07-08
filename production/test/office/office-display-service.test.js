import {officeApiHelper} from '../../src/office/office-api-helper';
import {officeContextMock} from './__mock__object__/OfficeContext';
import {officeDisplayService} from '../../src/office/office-display-service';
import {reduxStore} from '../../src/store';
import {mstrObjectRestService} from '../../src/mstr-object/mstr-object-rest-service';
import {mockReports} from '../mockData';
import {officeStoreService} from '../../src/office/store/office-store-service';
import {authenticationHelper} from '../../src/authentication/authentication-helper';
import {popupController} from '../../src/popup/popup-controller';
import {PopupTypeEnum} from '../../src/home/popup-type-enum';
import {sessionHelper} from '../../src/storage/session-helper';
import {OverlappingTablesError} from '../../src/error/overlapping-tables-error';
import {officeConverterService} from '../../src/office/office-converter-service';
import {ALL_DATA_FILTERED_OUT} from '../../src/error/constants';

jest.mock('../../src/mstr-object/mstr-object-rest-service');
jest.mock('../../src/office/store/office-store-service');
jest.mock('../../src/authentication/authentication-helper');

describe('OfficeDisplayService', () => {
  const givenReport = mockReports[0];
  const excelTableNameMock = 'table';

  const mstrContext = {
    envUrl: 'url',
    projectId: 'pId',
  };

  beforeAll(() => {
    givenReport.mstrTable = officeConverterService.createTable(givenReport);

    jest.spyOn(officeApiHelper, 'findAvailableOfficeTableId')
        .mockReturnValue(excelTableNameMock);
    jest.spyOn(officeApiHelper, 'getCurrentMstrContext')
        .mockReturnValue(mstrContext);
    jest.spyOn(officeApiHelper, 'getOfficeContext')
        .mockReturnValue({
          document: {
            bindings: {
              releaseByIdAsync: jest.fn(),
            },
          },
        });
    jest.spyOn(officeApiHelper, 'getExcelContext')
        .mockReturnValue({
          workbook: {
            tables: {
              getItem: () => {
                return {
                  delete: () => {},
                  clearFilters: () => {},
                };
              },
            },
            worksheets: {
              getActiveWorksheet: () => {},
            },
            bindings: {
              getItem: () => {
                return {
                  getTable: () => {},
                };
              },
            },
          },
          sync: () => {},
        });
  });

  beforeEach(() => {
    const changedMock = jest.spyOn(mstrObjectRestService, 'createInstance').mockResolvedValue({
      mstrTable: {
        rows: [],
      },
    });
    changedMock.mockRestore();

    jest.spyOn(mstrObjectRestService, 'createInstance')
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
    const getObjectDefinitionSpy = jest.spyOn(mstrObjectRestService, 'createInstance');
    jest.spyOn(officeApiHelper, 'getSelectedCell').mockImplementationOnce(() => {});
    jest.spyOn(officeApiHelper, 'formatNumbers').mockImplementationOnce(() => {});
    jest.spyOn(officeApiHelper, 'formatTable').mockImplementationOnce(() => {});
    jest.spyOn(officeApiHelper, 'bindNamedItem').mockImplementationOnce(() => {});
    jest.spyOn(officeDisplayService, '_dispatchPrintFinish').mockImplementationOnce(() => {});
    jest.spyOn(officeDisplayService, '_createOfficeTable').mockImplementationOnce(() => {});
    jest.spyOn(officeDisplayService, '_fetchInsertDataIntoExcel').mockImplementationOnce(() => {});
    const options = {objectId: 'id123', projectId: 'p123', isReport: true};
    // when
    await officeDisplayService._printObject(options);
    // then
    expect(getObjectDefinitionSpy).toBeCalled();
    expect(getObjectDefinitionSpy).toBeCalledWith(options.objectId, options.projectId, options.isReport, undefined, undefined);
  });

  it('should open loading popup when printing object', async () => {
    // given
    const givenBody = {id: 'id', name: 'name'};
    const getObjectDefinitionSpy = jest.spyOn(mstrObjectRestService, 'getObjectDefinition').mockResolvedValue(givenBody);
    const runPopupSpy = jest.spyOn(popupController, 'runPopup');
    const printInside = jest.spyOn(officeDisplayService, '_printObject').mockImplementationOnce(() => {});
    // {objectId, projectId, isReport = true, selectedCell, bindingId, isRefresh, dossierData, body, isPrompted, promptAnswers}
    const options = {objectId: 'id123', projectId: 'p123', isReport: true};
    const mockDialog = {
      close: () => {},
    };
    sessionHelper.setDialog(mockDialog);
    // when
    await officeDisplayService.printObject(options);
    // then
    expect(getObjectDefinitionSpy).toBeCalledWith(options.objectId, options.projectId, options.isReport);
    const preLoadReport = reduxStore.getState().officeReducer.preLoadReport;
    expect(preLoadReport).toEqual(givenBody);
    expect(runPopupSpy).toBeCalledWith(PopupTypeEnum.loadingPage, 22, 28);
    expect(printInside).toBeCalledWith(options);
  });

  it('should add report to store', () => {
    // given
    const report = {
      id: 'firstTestId',
      name: 'firstTestName',
      bindId: 'firstBindId',
      projectId: 'firstProjectId',
      envUrl: 'firstEnvUrl',
    };
    // when
    officeDisplayService.addReportToStore(report);
    const reportState = reduxStore.getState().officeReducer.reportArray;
    // then
    expect(reportState).toBeDefined();
    expect(reportState[reportState.length - 1]).toEqual(report);
  });

  it('should call preserveReport on office store service', async () => {
    // given
    jest.spyOn(officeDisplayService, '_fetchInsertDataIntoExcel').mockReturnValueOnce({});
    jest.spyOn(officeDisplayService, '_createOfficeTable').mockReturnValueOnce({});
    jest.spyOn(officeApiHelper, 'getSelectedCell').mockReturnValueOnce({});
    jest.spyOn(officeApiHelper, 'bindNamedItem').mockReturnValueOnce({});
    jest.spyOn(officeApiHelper, 'formatTable').mockReturnValueOnce({});
    jest.spyOn(officeApiHelper, 'formatNumbers').mockReturnValueOnce({});

    const mockDialog = {
      close: () => {},
    };
    sessionHelper.setDialog(mockDialog);
    const instanceId = null;
    const objectId = null;
    // when
    await officeDisplayService.printObject({instanceId, objectId, projectId: mstrContext.projectId, isRefresh: false, selectedCell: 'A1'});
    // then
    expect(officeStoreService.preserveReport).toBeCalled();
    expect(officeStoreService.preserveReport).toBeCalledWith({
      id: givenReport.id,
      name: givenReport.name,
      bindId: excelTableNameMock,
      envUrl: mstrContext.envUrl,
      projectId: mstrContext.projectId,
      isLoading: false,
      objectType: 'report',
    });
  });

  it('should call deleteReport on office store service', async () => {
    // given
    officeStoreService.deleteReport = jest.fn();
    authenticationHelper.validateAuthToken = jest.fn().mockImplementation(() => {});
    officeApiHelper.getExcelContext = jest.fn().mockImplementation(() => {
      return {
        workbook: {
          tables: {
            getItem: () => ({
              delete: () => {},
              clearFilters: () => {},
            }),
          },
        },
        sync: () => {},
      };
    });
    const report = {
      id: 'firstTestId',
      name: 'firstTestName',
      bindId: 'firstBindId',
      projectId: 'firstProjectId',
      envUrl: 'firstEnvUrl',
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
    authenticationHelper.validateAuthToken = jest.fn().mockImplementation(() => {});
    const report = {
      id: 'firstTestId',
      name: 'firstTestName',
      bindId: 'firstBindId',
      projectId: 'firstProjectId',
      envUrl: 'firstEnvUrl',
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
    authenticationHelper.validateAuthToken = jest.fn().mockImplementation(() => {
      throw Error();
    });
    const report = {
      id: 'firstTestId',
      name: 'firstTestName',
      bindId: 'firstBindId',
      projectId: 'firstProjectId',
      envUrl: 'firstEnvUrl',
    };
    officeDisplayService.addReportToStore(report);
    // when
    const bindingId = reduxStore.getState().officeReducer.reportArray[0].id;
    await officeDisplayService.removeReportFromExcel(bindingId);
    // then
    expect(authenticationHelper.validateAuthToken).toBeCalled();
    expect(officeStoreService.deleteReport).not.toBeCalled();
  });

  describe('_createOfficeTable', async () => {
    it('should return officeTable proper name and invoke required methods', async () => {
      // given
      const mockedTable = {
        getHeaderRowRange: jest.fn().mockReturnValue({
          values: [],
        }),
        getDataBodyRange: jest.fn().mockReturnValue({
          values: [],
        }),
        load: jest.fn(),
        rows: {
          add: jest.fn(),
          clearFilters: jest.fn(),
        },
      };
      const mockedWorksheet = {
        tables: {
          add: jest.fn().mockReturnValue(mockedTable),
        },
        getRange: jest.fn().mockReturnValue({
          value: 'A1:B5',
          getUsedRangeOrNullObject: jest.fn().mockReturnValue({isNullObject: true}),
        }),
        activate: jest.fn(),
      };
      jest.spyOn(officeDisplayService, '_checkRangeValidity').mockReturnValueOnce({});
      jest.spyOn(officeApiHelper, 'getRange').mockReturnValueOnce('A1:B5');

      const getActiveWorksheetMock = jest.fn();
      getActiveWorksheetMock.mockReturnValue(mockedWorksheet);
      officeContextMock.workbook.worksheets.getActiveWorksheet = getActiveWorksheetMock;
      officeContextMock.sync = jest.fn();
      officeContextMock.trackedObjects = {add: jest.fn()};
      const startCell = 'A1';
      const reportName = 'someReportName';
      // when
      const result = await officeDisplayService._createOfficeTable(givenReport, officeContextMock, startCell, reportName);
      // then
      expect(getActiveWorksheetMock).toBeCalled();
      expect(result.name).toEqual(reportName);
    });
    it('should delete prevOfficeTable on refresh if table definition changed and range is available', async () => {
      // given
      const mockedTable = {
        getHeaderRowRange: jest.fn().mockReturnValue({
          values: [],
        }),
        getDataBodyRange: jest.fn().mockReturnValue({
          values: [],
        }),
        load: jest.fn(),
        rows: {
          add: jest.fn(),
          clearFilters: jest.fn(),
        },
      };
      const mockedWorksheet = {
        tables: {
          add: jest.fn().mockReturnValue(mockedTable),
        },
        getRange: jest.fn().mockReturnValue({
          value: 'A1:B5',
          getUsedRangeOrNullObject: jest.fn().mockReturnValue({isNullObject: true}),
        }),
        activate: jest.fn(),
      };
      const mockedPrevTable = {
        delete: jest.fn(),
        rows: {count: 1, load: jest.fn()},
        columns: {count: 1},
        worksheet: mockedWorksheet,
      };
      jest.spyOn(officeDisplayService, '_checkRangeValidity').mockReturnValueOnce({});
      jest.spyOn(officeApiHelper, 'getRange').mockReturnValueOnce('A1:B5');

      const getActiveWorksheetMock = jest.fn();
      getActiveWorksheetMock.mockReturnValue(mockedWorksheet);
      officeContextMock.workbook.worksheets.getActiveWorksheet = getActiveWorksheetMock;
      officeContextMock.sync = jest.fn();
      officeContextMock.trackedObjects = {add: jest.fn()};
      const startCell = 'A1';
      const reportName = 'someReportName';
      // when
      const result = await officeDisplayService._createOfficeTable(givenReport, officeContextMock, startCell, reportName, mockedPrevTable);
      // then
      expect(mockedPrevTable.delete).toBeCalled();
      expect(result.name).toEqual(reportName);
    });
  });
  describe('_checkRangeValidity', async () => {
    it('should return null when data range is empty', async () => {
      // given
      jest.spyOn(officeDisplayService, '_checkRangeValidity').mockRestore();
      const mockedWorksheet = {
        getRange: jest.fn().mockReturnValue({
          value: [],
          getUsedRangeOrNullObject: jest.fn().mockReturnValue({isNullObject: true}),
        }),
        activate: jest.fn(),
      };
      const mockedRange = mockedWorksheet.getRange();
      officeContextMock.sync = jest.fn();
      officeContextMock.trackedObjects = {add: jest.fn()};

      // when
      const result = await officeDisplayService._checkRangeValidity(officeContextMock, mockedRange);
      // then
      expect(result).toBeUndefined();
    });
    it('should return OverlappingTables error when data range is not empty', async () => {
      // given
      const mockedWorksheet = {
        getRange: jest.fn().mockReturnValue({
          value: [],
          getUsedRangeOrNullObject: jest.fn().mockReturnValue({isNullObject: false}),
        }),
        activate: jest.fn(),
      };
      const mockedRange = mockedWorksheet.getRange();
      officeContextMock.sync = jest.fn();
      officeContextMock.trackedObjects = {add: jest.fn()};
      try {
        // when
        await officeDisplayService._checkRangeValidity(officeContextMock, mockedRange);
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(OverlappingTablesError);
      }
    });
  });
  describe('_FetchInsertDataIntoExcel', () => {
    it('should call getObjectGenerator', () => {
      // given
      const mockConnectionData = {objectId: 'objectId', projectId: 'projectId', isReport: true, body: {}};
      const mockOfficeData = {excelContext: {}, officeTable: {}};
      const mockGetObjectContentGenerator = jest.spyOn(mstrObjectRestService, 'getObjectContentGenerator').mockReturnValueOnce([]);
      // when
      officeDisplayService._fetchInsertDataIntoExcel(mockConnectionData, mockOfficeData, givenReport);
      // then
      expect(mockGetObjectContentGenerator).toBeCalled();
    });
  });
  describe('_appendRowsToTable', () => {
    it('should not call range.clear on import', () => {
      // given
      const mockClear = jest.fn();
      const mockOfficeTable = {getHeaderRowRange: () => ({getRowsBelow: () => ({getOffsetRange: () => ({clear: mockClear})})})};
      // when
      officeDisplayService._appendRowsToTable(mockOfficeTable, [], 0, false);
      // then
      expect(mockClear).not.toBeCalled();
    });
    it('should call range.clear on refresh', () => {
      // given
      const mockClear = jest.fn();
      const mockOfficeTable = {getHeaderRowRange: () => ({getRowsBelow: () => ({getOffsetRange: () => ({clear: mockClear})})})};
      // when
      officeDisplayService._appendRowsToTable(mockOfficeTable, [], 0, true);
      // then
      expect(mockClear).toBeCalled();
    });
  });

  describe.skip('delete report', () => {
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
    const changedMock = jest.spyOn(mstrObjectRestService, 'createInstance').mockResolvedValue({
      mstrTable: {
        rows: [],
      },
    });
    jest.spyOn(officeApiHelper, 'getSelectedCell').mockImplementationOnce(() => {});
    jest.spyOn(officeApiHelper, 'formatNumbers').mockImplementationOnce(() => {});
    jest.spyOn(officeApiHelper, 'formatTable').mockImplementationOnce(() => {});
    jest.spyOn(officeApiHelper, 'bindNamedItem').mockImplementationOnce(() => {});
    jest.spyOn(officeDisplayService, '_dispatchPrintFinish').mockImplementationOnce(() => {});
    jest.spyOn(officeDisplayService, '_createOfficeTable').mockImplementationOnce(() => {});
    jest.spyOn(officeDisplayService, '_fetchInsertDataIntoExcel').mockImplementationOnce(() => {});
    const options = {
      objectId: 'id123',
      projectId: 'p123',
      isReport: true,
      isPrompted: true,
      promptAnswers: [],
    };
    // when
    const resultMessage = await officeDisplayService._printObject(options);
    // then
    expect(resultMessage).toBeDefined();
    expect(resultMessage).toEqual({
      message: ALL_DATA_FILTERED_OUT,
      type: 'warning',
    });
  });
});
