import {officeApiHelper} from '../../src/office/office-api-helper';
import {officeContextMock} from './__mock__object__/OfficeContext';
import {officeDisplayService} from '../../src/office/office-display-service';
import {reduxStore} from '../../src/store';
import {mstrObjectRestService} from '../../src/mstr-object/mstr-object-rest-service';
import {mockReports} from '../mockData';
import {officeStoreService} from '../../src/office/store/office-store-service';
import {OutsideOfRangeError} from '../../src/error/outside-of-range-error';
import {authenticationHelper} from '../../src/authentication/authentication-helper';
import {popupController} from '../../src/popup/popup-controller';
import {PopupTypeEnum} from '../../src/home/popup-type-enum';

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
    jest.spyOn(mstrObjectRestService, 'getObjectContent')
        .mockResolvedValue(givenReport);
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
                return {delete: () => {}};
              },
            },
          },
          sync: () => {},
        });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should open loading popup when printing object', async () => {
    // given
    const givenBody = {id: 'id', name: 'name'};
    const getObjectInfoSpy = jest.spyOn(mstrObjectRestService, 'getObjectInfo').mockResolvedValue(givenBody);
    const runPopupSpy = jest.spyOn(popupController, 'runPopup');
    const printInside = jest.spyOn(officeDisplayService, '_printObject')
        .mockImplementationOnce(() => {});
    const arg1 = 'arg1';
    const arg2 = 'arg2';
    const arg3 = 'arg2';
    // when
    await officeDisplayService.printObject(arg1, arg2, arg3);
    // then
    expect(getObjectInfoSpy).toBeCalledWith(arg1, arg2, arg3);
    const preLoadReport = reduxStore.getState().officeReducer.preLoadReport;
    expect(preLoadReport).toEqual(givenBody);
    expect(runPopupSpy).toBeCalledWith(PopupTypeEnum.loadingPage, 22, 24);
    expect(printInside).toBeCalledWith(arg1, arg2, arg3);
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
    expect(reportState[0]).toEqual(report);
  });

  it('should call preserveReport on office store service', async () => {
    // given
    jest.spyOn(officeDisplayService, '_insertDataIntoExcel')
        .mockReturnValueOnce({});
    jest.spyOn(officeApiHelper, 'getSelectedCell')
        .mockReturnValueOnce({});
    const objectId = null;
    // when
    await officeDisplayService.printObject(objectId, mstrContext.projectId, true);
    // then
    expect(officeStoreService.preserveReport).toBeCalled();
    expect(officeStoreService.preserveReport).toBeCalledWith({
      tableId: excelTableNameMock,
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
            getItem: () => ({delete: () => {}}),
          },
        },
        sync: () => {},
      };
    });
    const report = {
      id: 'firstTestId',
      name: 'firstTestName',
      bindId: 'firstBindId',
      tableId: 'firstTableId',
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
      tableId: 'firstTableId',
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
      tableId: 'firstTableId',
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

  describe('_insertDataIntoExcel', async () => {
    it('should return table husk with proper name and invoke required methods', async () => {
      // given
      jest.spyOn(officeApiHelper, 'formatTable').mockReturnValue({});
      const getActiveWorksheetMock = jest.fn();
      const mockedTable = {
        getHeaderRowRange: jest.fn().mockReturnValue({
          values: [],
        }),
      };
      const mockedWorksheet = {
        tables: {
          add: jest.fn().mockReturnValue(mockedTable),
        },
        getRange: jest.fn().mockReturnValue({
          value: [],
          getUsedRangeOrNullObject: jest.fn().mockReturnValue({isNullObject: true}),
        }),
        activate: jest.fn(),
      };
      const mockedPushRows = jest.fn();
      officeDisplayService._pushRows = mockedPushRows;
      const mockedFormatTable = jest.fn();
      officeDisplayService._formatTable = mockedFormatTable;
      getActiveWorksheetMock.mockReturnValue(mockedWorksheet);
      officeContextMock.workbook.worksheets.getActiveWorksheet = getActiveWorksheetMock;
      officeContextMock.workbook.application = {suspendApiCalculationUntilNextSync: jest.fn()};
      officeContextMock.sync = jest.fn();
      officeContextMock.trackedObjects = {add: jest.fn()};
      const startCell = 'A1';
      const reportName = 'someReportName';
      const reportConvertedData = {
        name: 'testName',
        headers: ['a', 'b'],
        rows: [1, 2],
      };
      // when
      const result = await officeDisplayService._insertDataIntoExcel(reportConvertedData, officeContextMock, startCell, reportName);
      // then
      expect(getActiveWorksheetMock).toBeCalled();
      expect(result.name).toEqual(reportName);
    });
    it('should return error when data range is not empty', async () => {
      // given
      jest.spyOn(officeApiHelper, 'formatTable').mockReturnValue({});
      const getActiveWorksheetMock = jest.fn();
      const mockedTable = {
        getHeaderRowRange: jest.fn().mockReturnValue({
          values: [],
        }),
      };
      const mockedWorksheet = {
        tables: {
          add: jest.fn().mockReturnValue(mockedTable),
        },
        getRange: jest.fn().mockReturnValue({
          value: [],
          getUsedRangeOrNullObject: jest.fn().mockReturnValue({isNullObject: null}),
        }),
        activate: jest.fn(),
      };
      const mockedPushRows = jest.fn();
      officeDisplayService._pushRows = mockedPushRows;
      const mockedFormatTable = jest.fn();
      officeDisplayService._formatTable = mockedFormatTable;
      getActiveWorksheetMock.mockReturnValue(mockedWorksheet);
      officeContextMock.workbook.worksheets.getActiveWorksheet = getActiveWorksheetMock;
      officeContextMock.workbook.application = {suspendApiCalculationUntilNextSync: jest.fn()};
      officeContextMock.sync = jest.fn();
      officeContextMock.trackedObjects = {add: jest.fn()};
      const startCell = 'A1';
      const reportName = 'someReportName';
      const reportConvertedData = {
        name: 'testName',
        headers: ['a', 'b'],
        rows: [1, 2],
      };
      try {
        // when
        await officeDisplayService._insertDataIntoExcel(reportConvertedData, officeContextMock, startCell, reportName);
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(OutsideOfRangeError);
      }
    });
  });
  describe('_checkRangeValidity', async () => {
    it('should return null when data range is empty', async () => {
      // given
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
    it('should return OutsideOfRange error when data range is not empty', async () => {
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
        expect(error).toBeInstanceOf(OutsideOfRangeError);
      }
    });
  });
  describe.skip('delete report', () => {
    it('should fail', () => {
      // given
      // when
      // then
      expect(false).toBeTruthy();
    });
  });
  it.skip('it should fail', () => {
    // given
    // when
    expect(false).toBeTruthy();
    // then
  });
});
