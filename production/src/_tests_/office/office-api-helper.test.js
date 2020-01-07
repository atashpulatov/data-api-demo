import { officeApiHelper } from '../../office/office-api-helper';
import { IncorrectInputTypeError } from '../../office/incorrect-input-type';
import { OfficeError, OfficeBindingError } from '../../office/office-error';
import { reduxStore } from '../../store';
import { sessionProperties } from '../../storage/session-properties';
import { historyProperties } from '../../history/history-properties';
import { officeProperties } from '../../office/office-properties';

// FIXME: these were disabled anyway. Needs to be redone.
describe('OfficeApiHelper', () => {
  beforeAll(() => {
    officeApiHelper.excel = {};
  });
  it('should convert simple excel column name to number', () => {
    // given
    const columnName = 'A';
    // when
    const result = officeApiHelper.lettersToNumber(columnName);
    // then
    expect(result).toEqual(1);
  });
  it('should convert complex excel column name to number', () => {
    // given
    const columnName = 'CA';
    // when
    const result = officeApiHelper.lettersToNumber(columnName);
    // then
    expect(result).toEqual(79);
  });
  it('should throw an error due to number instead of column name', () => {
    // given
    const columnName = '23';
    let result;
    // when
    try {
      result = officeApiHelper.lettersToNumber(columnName);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(IncorrectInputTypeError);
    }
    expect(result).toBeUndefined();
  });
  it('should throw an error due to incorrect column name', () => {
    // given
    const columnName = 'alamaKota';
    let result;
    // when
    try {
      result = officeApiHelper.lettersToNumber(columnName);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(IncorrectInputTypeError);
    }
    expect(result).toBeUndefined();
  });
  it('should return proper range for normal case range starting at A1', () => {
    // given
    const headerCount = 12;
    const startCell = 'A1';
    // when
    const result = officeApiHelper.getRange(headerCount, startCell);
    // then
    expect(result).toEqual('A1:L1');
  });

  it('should return proper range for normal case range starting at AL1234', () => {
    // given
    const headerCount = 12;
    const startCell = 'AL1234';
    // when
    const result = officeApiHelper.getRange(headerCount, startCell);
    // then
    expect(result).toEqual('AL1234:AW1234');
  });

  it('should return proper range for very small range', () => {
    // given
    const headerCount = 1;
    const startCell = 'A1';
    // when
    const result = officeApiHelper.getRange(headerCount, startCell);
    // then
    expect(result).toEqual('A1:A1');
  });

  it('should return proper range for very huge range', () => {
    // given
    const headerCount = 1001;
    const startCell = 'A1';
    // when
    const result = officeApiHelper.getRange(headerCount, startCell);
    // then
    expect(result).toEqual('A1:ALM1');
  });

  it('should return proper 2D range when defining row count', () => {
    // given
    const headerCount = 1001;
    const startCell = 'A1';
    const rowCount = 1000;
    // when
    const result = officeApiHelper.getRange(headerCount, startCell, rowCount);
    // then
    expect(result).toEqual('A1:ALM1001');
  });

  it('should error due to incorrect start cell', () => {
    // given
    const headerCount = 1001;
    const startCell = 'A!1';
    let result;
    // when
    try {
      result = officeApiHelper.getRange(headerCount, startCell);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(IncorrectInputTypeError);
    }
    expect(result).toBeUndefined();
  });

  it('should throw error due to incorrect header count', () => {
    // given
    const headerCount = 'asd';
    const startCell = 'A1';
    let result;
    // when
    try {
      result = officeApiHelper.getRange(headerCount, startCell);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(IncorrectInputTypeError);
    }
    expect(result).toBeUndefined();
  });
  it('should forward error different than OfficeExtension.Error', () => {
    // given
    const error = new Error();
    // when
    const callThatThrows = () => {
      officeApiHelper.handleOfficeApiException(error);
    };
    // then
    expect(callThatThrows).toThrowError();
  });
  it.skip('should return proper bindingsArray', () => {
    // given
    const entryArray = [
      { id: 'SimpleReport_B2_BD1E844211E85FF536AB0080EFB5F215_projectId_envUrl' },
      { id: 'ComplexReport_DB5_BD1E84FF536AB0080EFB5F215_projectId_envUrl' },
      { id: 'Simple_B542_BD1E844211E85FF53EFB5F215_projectId_envUrl' },
      { id: 'Report_B22222_BD11E85FF536AB0080EFB5F215_projectId_envUrl' },
      { id: 'port_BASDFFF2_4211E85FF536AB0080EFB5F215_projectId_envUrl' },
    ];
    const resultExpectedArray = [
      {
        id: 'BD1E844211E85FF536AB0080EFB5F215',
        name: 'SimpleReport',
        bindId: 'SimpleReport_B2_BD1E844211E85FF536AB0080EFB5F215_projectId_envUrl',
        projectId: 'projectId',
        envUrl: 'envUrl',
      },
      {
        id: 'BD1E84FF536AB0080EFB5F215',
        name: 'ComplexReport',
        bindId: 'ComplexReport_DB5_BD1E84FF536AB0080EFB5F215_projectId_envUrl',
        projectId: 'projectId',
        envUrl: 'envUrl',
      },
      {
        id: 'BD1E844211E85FF53EFB5F215',
        name: 'Simple',
        bindId: 'Simple_B542_BD1E844211E85FF53EFB5F215_projectId_envUrl',
        projectId: 'projectId',
        envUrl: 'envUrl',
      },
      {
        id: 'BD11E85FF536AB0080EFB5F215',
        name: 'Report',
        bindId: 'Report_B22222_BD11E85FF536AB0080EFB5F215_projectId_envUrl',
        projectId: 'projectId',
        envUrl: 'envUrl',
      },
      {
        id: '4211E85FF536AB0080EFB5F215',
        name: 'port',
        bindId: 'port_BASDFFF2_4211E85FF536AB0080EFB5F215_projectId_envUrl',
        projectId: 'projectId',
        envUrl: 'envUrl',
      },
    ];
    // when
    const resultArray = officeApiHelper._excelBindingsToStore(entryArray);
    // then
    expect(resultArray).toEqual(resultExpectedArray);
  });
  it.skip('should throw error due to undefined forwarded', () => {
    // given
    const entryArray = undefined;
    // when
    const wrongMethodCall = () => {
      officeApiHelper._excelBindingsToStore(entryArray);
    };
    // then
    expect(wrongMethodCall).toThrowError(OfficeError);
    expect(wrongMethodCall).toThrowError('Bindings should not be undefined!');
  });
  it.skip('should throw error due to non array type forwarder', () => {
    // given
    const entryArray = {};
    // when
    const wrongMethodCall = () => {
      officeApiHelper._excelBindingsToStore(entryArray);
    };
    // then
    expect(wrongMethodCall).toThrowError(OfficeError);
    expect(wrongMethodCall).toThrowError('Bindings must be of Array type!');
  });
  it('should return current mstr context data', () => {
    // given
    const project = {
      projectId: 'testProjectId',
      projectName: 'testProjectName',
    };
    const envUrl = 'testEnvUrl';
    const username = 'testusername';
    reduxStore.dispatch({
      type: sessionProperties.actions.logIn,
      values: {
        username,
        envUrl,
        password: '',
      },
    });
    reduxStore.dispatch({
      type: historyProperties.actions.goInsideProject,
      projectId: project.projectId,
      projectName: project.projectName,
    });
    // when
    const result = officeApiHelper.getCurrentMstrContext();
    // then
    expect(result.envUrl).toBe(envUrl);
  });
  it('should find proper office table id with only a-z and number characters', async () => {
    // given
    const mockLoad = () => {};
    const context = {
      workbook: {
        tables: {
          load: mockLoad,
          getItemOrNullObject: () => ({
            load: mockLoad,
            isNull: true,
          }),
        },
      },
      sync: () => {},
    };
    // when
    const parsedReportName = await officeApiHelper.findAvailableOfficeTableId(context);
    // then
    expect(/^[a-zA-Z0-9]+$/.test(parsedReportName)).toBeTruthy();
  });
  describe.skip('createBindingId', () => {
    it('should return proper bindingId', () => {
      // given
      const chosenObjectId = 'someReportId';
      const chosenObjectName = 'someReportName';
      const envUrl = 'someTestUrl';
      const projectId = 'someTestProjectId';
      const convertedReportDataMock = {
        id: chosenObjectId,
        name: chosenObjectName,
      };
      const separator = '_';
      const tableName = 'someTableName';
      const expectedBindId = `${chosenObjectName}_${tableName}_${chosenObjectId}_${projectId}_${envUrl}`;
      // when
      const receivedBindId = officeApiHelper.createBindingId(convertedReportDataMock, tableName, projectId, envUrl, separator);
      // then
      expect(receivedBindId).toEqual(expectedBindId);
    });
    it('should return proper bindingId with different separator', () => {
      // given
      const chosenObjectId = 'someReportId';
      const chosenObjectName = 'someReportName';
      const envUrl = 'someTestUrl';
      const projectId = 'someTestProjectId';
      const convertedReportDataMock = {
        id: chosenObjectId,
        name: chosenObjectName,
      };
      const separator = '-';
      const tableName = 'someTableName';
      const expectedBindId = `${chosenObjectName}-${tableName}-${chosenObjectId}-${projectId}-${envUrl}`;
      // when
      const receivedBindId = officeApiHelper.createBindingId(convertedReportDataMock, tableName, projectId, envUrl, separator);
      // then
      expect(receivedBindId).toEqual(expectedBindId);
    });
    it('should throw error due to missing convertedReportData', () => {
      // given
      const convertedReportDataMock = undefined;
      const separator = '-';
      const tableName = 'someTableName';
      const envUrl = 'someTestUrl';
      const projectId = 'someTestProjectId';
      // when
      const wrongMethodCall = () => {
        officeApiHelper.createBindingId(convertedReportDataMock, tableName, projectId, envUrl, separator);
      };
      // then
      expect(wrongMethodCall).toThrowError(OfficeBindingError);
      expect(wrongMethodCall).toThrowError('Missing reportConvertedData');
    });
    it('should throw error due to missing tableName', () => {
      // given
      const chosenObjectId = 'someReportId';
      const chosenObjectName = 'someReportName';
      const envUrl = 'someTestUrl';
      const projectId = 'someTestProjectId';
      const convertedReportDataMock = {
        id: chosenObjectId,
        name: chosenObjectName,
      };
      const tableName = undefined;
      const separator = '-';
      // when
      const wrongMethodCall = () => {
        officeApiHelper.createBindingId(convertedReportDataMock, tableName, projectId, envUrl, separator);
      };
      // then
      expect(wrongMethodCall).toThrowError(OfficeBindingError);
      expect(wrongMethodCall).toThrowError('Missing tableName');
    });
    it('should throw error due to missing projectId', () => {
      // given
      const chosenObjectId = 'someReportId';
      const chosenObjectName = 'someReportName';
      const envUrl = 'someTestUrl';
      const tableName = 'someTableName';
      const convertedReportDataMock = {
        id: chosenObjectId,
        name: chosenObjectName,
      };
      const projectId = undefined;
      const separator = '-';
      // when
      const wrongMethodCall = () => {
        officeApiHelper.createBindingId(convertedReportDataMock, tableName, projectId, envUrl, separator);
      };
      // then
      expect(wrongMethodCall).toThrowError(OfficeBindingError);
      expect(wrongMethodCall).toThrowError('Missing projectId');
    });
    it('should throw error due to missing envUrl', () => {
      // given
      const chosenObjectId = 'someReportId';
      const chosenObjectName = 'someReportName';
      const projectId = 'someProjectId';
      const tableName = 'someTableName';
      const convertedReportDataMock = {
        id: chosenObjectId,
        name: chosenObjectName,
      };

      const envUrl = undefined;
      const separator = '-';
      // when
      const wrongMethodCall = () => {
        officeApiHelper.createBindingId(convertedReportDataMock, tableName, projectId, envUrl, separator);
      };
      // then
      expect(wrongMethodCall).toThrowError(OfficeBindingError);
      expect(wrongMethodCall).toThrowError('Missing envUrl');
    });
    it('should return proper bindingId despite not providing separator', () => {
      // given
      const chosenObjectId = 'someReportId';
      const chosenObjectName = 'someReportName';
      const envUrl = 'someTestUrl';
      const projectId = 'someTestProjectId';
      const convertedReportDataMock = {
        id: chosenObjectId,
        name: chosenObjectName,
      };
      const tableName = 'someTableName';
      const expectedBindId = `${chosenObjectName}_${tableName}_${chosenObjectId}_${projectId}_${envUrl}`;
      // when
      const receivedBindId = officeApiHelper.createBindingId(convertedReportDataMock, tableName, projectId, envUrl);
      // then
      expect(receivedBindId).toEqual(expectedBindId);
    });
  });
  describe('getSelectedCell', () => {
    it('should return starting cell from range address(single cell)', async () => {
      // given
      const loadMock = jest.fn().mockImplementation(() => 'Sheet1!A12');
      const getCellMock = jest.fn().mockImplementation(() => ({
        load: loadMock,
        address: loadMock(),
      }));
      const mockSync = jest.fn();
      const context = {
        workbook: { getSelectedRange: jest.fn().mockImplementation(() => ({ getCell: getCellMock, })), },
        sync: mockSync,
      };
      // when
      const result = await officeApiHelper.getSelectedCell(context);
      // then
      expect(context.workbook.getSelectedRange).toBeCalled();
      expect(getCellMock).toBeCalled();
      expect(loadMock).toBeCalled();
      expect(loadMock).toBeCalledWith(officeProperties.officeAddress);
      expect(result).toEqual('A12');
      expect(mockSync).toBeCalled();
    });
    it('should return starting cell from range address(multiple cells)', async () => {
      // given
      const loadMock = jest.fn().mockImplementation(() => 'Sheet1!A12:B14');
      const mockSync = jest.fn();
      const getCellMock = jest.fn().mockImplementation(() => ({
        load: loadMock,
        address: loadMock(),
      }));
      const context = {
        workbook: { getSelectedRange: jest.fn().mockImplementation(() => ({ getCell: getCellMock, })), },
        sync: mockSync,
      };
      // when
      const result = await officeApiHelper.getSelectedCell(context);
      // then
      expect(context.workbook.getSelectedRange).toBeCalled();
      expect(getCellMock).toBeCalled();
      expect(loadMock).toBeCalled();
      expect(loadMock).toBeCalledWith(officeProperties.officeAddress);
      expect(result).toEqual('A12');
      expect(mockSync).toBeCalled();
    });
  });
  describe('getStartCell', () => {
    it('should return starting cell from range address(single cell)', () => {
      // given
      const range = 'Sheet1!A12';
      // when
      const result = officeApiHelper.getStartCell(range);
      // then
      expect(result).toEqual('A12');
    });
    it('should return starting cell from range address(multiple cells)', () => {
      // given
      const range = 'Sheet1!ABC12:BDE15';
      // when
      const result = officeApiHelper.getStartCell(range);
      // then
      expect(result).toEqual('ABC12');
    });
    it('should return starting cell with sheet name including !', () => {
      // given
      const range = 'No!Sheet1!ABC12:BDE15';
      // when
      const result = officeApiHelper.getStartCell(range);
      // then
      expect(result).toEqual('ABC12');
    });
  });
  describe.skip('loadExistingReportBingings', () => {
    it('should not load anything due to empty bindings', async () => {
      // given
      const context = {};
      const mockArray = [];
      const originalGetBindingsFromWorkbook = officeApiHelper._getBindingsFromWorkbook;
      const originalExcelBindingsToStore = officeApiHelper._excelBindingsToStore;
      const originalGetOfficeContext = officeApiHelper.getOfficeContext;
      const mockMethodGetBindingsFromWorkbook = jest.fn().mockImplementation(() => mockArray);
      const mockGetOfficeContext = jest.fn().mockImplementation(() => context);
      const mockMethodExcelBindingsToStore = jest.fn().mockImplementation(() => [
        {
          id: 'BD1E844211E85FF536AB0080EFB5F215',
          name: 'SimpleReport',
          bindId: 'SimpleReport_B2_BD1E844211E85FF536AB0080EFB5F215_projectId_envUrl',
          projectId: 'projectId',
          envUrl: 'envUrl',
        },
        {
          id: 'BD1E84FF536AB0080EFB5F215',
          name: 'ComplexReport',
          bindId: 'ComplexReport_DB5_BD1E84FF536AB0080EFB5F215_projectId_envUrl',
          projectId: 'projectId',
          envUrl: 'envUrl',
        },
      ]);
      officeApiHelper._getBindingsFromWorkbook = mockMethodGetBindingsFromWorkbook;
      officeApiHelper._excelBindingsToStore = mockMethodExcelBindingsToStore;
      officeApiHelper.getOfficeContext = mockGetOfficeContext;
      // when
      await officeApiHelper.loadExistingReportBindingsExcel();
      const officeState = reduxStore.getState().officeReducer;
      // then
      expect(officeState.reportArray).toHaveLength(2);
      expect(mockGetOfficeContext).toBeCalled();
      expect(mockMethodGetBindingsFromWorkbook).toBeCalled();
      expect(mockMethodGetBindingsFromWorkbook).toBeCalledWith(context);
      expect(mockMethodExcelBindingsToStore).toBeCalled();
      expect(mockMethodExcelBindingsToStore).toBeCalledWith(mockArray);

      officeApiHelper._getBindingsFromWorkbook = originalGetBindingsFromWorkbook;
      officeApiHelper._excelBindingsToStore = originalExcelBindingsToStore;
      officeApiHelper.getOfficeContext = originalGetOfficeContext;
    });
  });
});
