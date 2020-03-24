import officeTableCreate from '../../../office/table/office-table-create';
import stepGetOfficeTableImport from '../../../office/table/step-get-office-table-import';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepFetchInsertDataIntoExcel from '../../../office/import/step-fetch-insert-data-into-excel';
import { mstrObjectRestService } from '../../../mstr-object/mstr-object-rest-service';
import officeInsertService from '../../../office/import/office-insert-service';

describe('StepGetOfficeTableImport', () => {
  const mockObjectData = {
    objectId: 'testObjectId',
    projectId: 'testProjectId',
    dossierData: 'testDossierData',
    mstrObjectType: 'testMstrObjectType',
    body: 'testBody',
    preparedInstanceId: 'testPreparedInstanceId',
    manipulationsXML: 'testManipulationsXML',
    promptsAnswers: 'testPromptsAnswers',
    visualizationInfo: 'testVisualizationInfo',
    displayAttrFormNames: 'testDisplayAttrFormNames',
    objectWorkingId: 'testObjectWorkingId',
  };

  /* eslint-disable object-curly-newline */
  const mockMstrTable = {
    subtotalsInfo: {
      importSubtotal: false
    },
  };
  /* eslint-enable object-curly-newline */

  const mockSuspendApiCalculationUntilNextSync = jest.fn();

  /* eslint-disable object-curly-newline */
  const mockExcelContext = {
    workbook: {
      application: {
        suspendApiCalculationUntilNextSync: mockSuspendApiCalculationUntilNextSync,
      },
    },
  };
  /* eslint-enable object-curly-newline */

  const mockOperationData = {
    operationType: 'testOperationType',
    tableColumnsChanged: 'testTableColumnsChanged',
    officeTable: 'testOfficeTable',
    excelContext: mockExcelContext,
    instanceDefinition: {
      columns: 42,
      rows: 'testRows',
      mstrTable: mockMstrTable,
    },
  };

  const resultInstanceDefinition = {
    columns: 42,
    rows: 'testRows',
    mstrTable: {
      subtotalsInfo: {
        importSubtotal: false,
        subtotalsAddresses: [],
      },
    },
  };

  const generatorConfig = {
    instanceDefinition: resultInstanceDefinition,
    objectId: 'testObjectId',
    projectId: 'testProjectId',
    mstrObjectType: 'testMstrObjectType',
    dossierData: 'testDossierData',
    body: 'testBody',
    limit: 4761,
    visualizationInfo: 'testVisualizationInfo',
    displayAttrFormNames: 'testDisplayAttrFormNames',
    preparedInstanceId: 'testPreparedInstanceId',
    manipulationsXML: 'testManipulationsXML',
    promptsAnswers: 'testPromptsAnswers',
  };

  afterEach(() => {
    mockSuspendApiCalculationUntilNextSync.mockClear();
    jest.restoreAllMocks();
  });

  it('getOfficeTableImport should log and re-throw exceptions', async () => {
    // given
    console.log = jest.fn();

    const mockFetchContentGenerator = jest.spyOn(mstrObjectRestService, 'fetchContentGenerator').mockImplementation(() => {
      throw new Error('testError');
    });

    // when
    try {
      await stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel({}, mockOperationData);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('testError');
    }

    // then
    expect(mockFetchContentGenerator).toBeCalledTimes(1);
    expect(mockFetchContentGenerator).toThrowError(Error);

    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith(new Error('testError'));
  });

  it('fetchInsertDataIntoExcel should work as expected - empty rowGenerator', async () => {
    // given
    const mockAppendRows = jest.spyOn(officeInsertService, 'appendRows').mockImplementation();

    const mockSyncChangesToExcel = jest.spyOn(officeInsertService, 'syncChangesToExcel').mockImplementation();

    const mockFetchContentGenerator = jest.spyOn(mstrObjectRestService, 'fetchContentGenerator').mockReturnValue([]);

    const mockUpdateOperation = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const mockUpdateObject = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const mockCompleteFetchInsertData = jest.spyOn(
      operationStepDispatcher, 'completeFetchInsertData'
    ).mockImplementation();

    // when
    await stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel(mockObjectData, mockOperationData);

    // then
    expect(mockFetchContentGenerator).toBeCalledTimes(1);
    expect(mockFetchContentGenerator).toBeCalledWith(generatorConfig);

    expect(mockAppendRows).not.toBeCalled();

    expect(mockMstrTable.subtotalsInfo.subtotalsAddresses).toEqual([]);
    expect(mockMstrTable.subtotalsInfo.importSubtotal).toEqual(false);

    expect(mockSyncChangesToExcel).toBeCalledTimes(1);
    expect(mockSyncChangesToExcel).toBeCalledWith([], true);

    expect(mockUpdateOperation).toBeCalledTimes(1);
    expect(mockUpdateOperation).toBeCalledWith({
      objectWorkingId: 'testObjectWorkingId',
      instanceDefinition: resultInstanceDefinition,
    });

    expect(mockUpdateObject).toBeCalledTimes(1);
    expect(mockUpdateObject).toBeCalledWith({
      objectWorkingId: 'testObjectWorkingId',
      subtotalsInfo: {
        subtotalsAddresses: [],
        importSubtotal: false,
      },
    });

    expect(mockCompleteFetchInsertData).toBeCalledTimes(1);
    expect(mockCompleteFetchInsertData).toBeCalledWith('testObjectWorkingId');
  });

  it.each`
  mockImportSubtotal | resultImportSubtotal | suspendApiCalculationUntilNextSyncCallsNo | getSubtotalCoordinatesCallsNo

  ${undefined}       | ${true}              | ${1}                                      | ${1}
  ${false}           | ${false}             | ${1}                                      | ${0}
  ${true}            | ${true}              | ${1}                                      | ${1}

  `('fetchInsertDataIntoExcel should work as expected - 1 row returned by rowGenerator',
  async ({
    mockImportSubtotal,
    resultImportSubtotal,
    suspendApiCalculationUntilNextSyncCallsNo,
    getSubtotalCoordinatesCallsNo
  }) => {
    // given
    mockMstrTable.subtotalsInfo.importSubtotal = mockImportSubtotal;
    resultInstanceDefinition.mstrTable.subtotalsInfo.importSubtotal = resultImportSubtotal;

    const mockAppendRows = jest.spyOn(officeInsertService, 'appendRows').mockImplementation();

    const mockSyncChangesToExcel = jest.spyOn(officeInsertService, 'syncChangesToExcel').mockImplementation();

    const mockFetchContentGenerator = jest.spyOn(mstrObjectRestService, 'fetchContentGenerator').mockReturnValue(
      [{
        row: [42, 42],
        header: 'testHeader',
        subtotalAddress: 'testSubtotalAddress',
      }]
    );

    const mockGetSubtotalCoordinates = jest.spyOn(stepFetchInsertDataIntoExcel, 'getSubtotalCoordinates')
      .mockImplementation();

    const mockUpdateOperation = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const mockUpdateObject = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const mockCompleteFetchInsertData = jest.spyOn(
      operationStepDispatcher, 'completeFetchInsertData'
    ).mockImplementation();

    // when
    await stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel(mockObjectData, mockOperationData);

    // then
    expect(mockFetchContentGenerator).toBeCalledTimes(1);
    expect(mockFetchContentGenerator).toBeCalledWith(generatorConfig);

    expect(mockSuspendApiCalculationUntilNextSync).toBeCalledTimes(suspendApiCalculationUntilNextSyncCallsNo);

    expect(mockAppendRows).toBeCalledTimes(1);
    expect(mockAppendRows).toBeCalledWith(
      'testOfficeTable',
      mockExcelContext,
      [42, 42],
      0,
      'testOperationType',
      'testTableColumnsChanged',
      [],
      'testHeader',
      {
        subtotalsInfo: {
          importSubtotal: resultImportSubtotal,
          subtotalsAddresses: [],
        }
      },
    );

    expect(mockGetSubtotalCoordinates).toBeCalledTimes(getSubtotalCoordinatesCallsNo);

    expect(mockMstrTable.subtotalsInfo.subtotalsAddresses).toEqual([]);
    expect(mockMstrTable.subtotalsInfo.importSubtotal).toEqual(resultImportSubtotal);

    expect(mockSyncChangesToExcel).toBeCalledTimes(2);
    expect(mockSyncChangesToExcel).toHaveBeenNthCalledWith(1, [], false);
    expect(mockSyncChangesToExcel).toHaveBeenNthCalledWith(2, [], true);

    expect(mockUpdateOperation).toBeCalledTimes(1);
    expect(mockUpdateOperation).toBeCalledWith({
      objectWorkingId: 'testObjectWorkingId',
      instanceDefinition: resultInstanceDefinition,
    });

    expect(mockUpdateObject).toBeCalledTimes(1);
    expect(mockUpdateObject).toBeCalledWith({
      objectWorkingId: 'testObjectWorkingId',
      subtotalsInfo: {
        subtotalsAddresses: [],
        importSubtotal: resultImportSubtotal,
      },
    });

    expect(mockCompleteFetchInsertData).toBeCalledTimes(1);
    expect(mockCompleteFetchInsertData).toBeCalledWith('testObjectWorkingId');
  });

  it.each`
  mockImportSubtotal | resultImportSubtotal | suspendApiCalculationUntilNextSyncCallsNo | getSubtotalCoordinatesCallsNo

  ${undefined}       | ${true}              | ${2}                                      | ${2}
  ${false}           | ${false}             | ${2}                                      | ${0}
  ${true}            | ${true}              | ${2}                                      | ${2}
  
  `('fetchInsertDataIntoExcel should work as expected - 2 rows returned by rowGenerator',
  async ({
    mockImportSubtotal,
    resultImportSubtotal,
    suspendApiCalculationUntilNextSyncCallsNo,
    getSubtotalCoordinatesCallsNo
  }) => {
    // given
    mockMstrTable.subtotalsInfo.importSubtotal = mockImportSubtotal;
    resultInstanceDefinition.mstrTable.subtotalsInfo.importSubtotal = resultImportSubtotal;

    const mockAppendRows = jest.spyOn(officeInsertService, 'appendRows').mockImplementation();

    const mockSyncChangesToExcel = jest.spyOn(officeInsertService, 'syncChangesToExcel').mockImplementation();

    const mockFetchContentGenerator = jest.spyOn(mstrObjectRestService, 'fetchContentGenerator').mockReturnValue(
      [{
        row: [42, 42],
        header: 'testHeaderOne',
        subtotalAddress: 'testSubtotalAddressOne',
      },
      {
        row: [42, 42, 42, 42],
        header: 'testHeaderTwo',
        subtotalAddress: 'testSubtotalAddressTwo',
      }]
    );

    const mockGetSubtotalCoordinates = jest.spyOn(stepFetchInsertDataIntoExcel, 'getSubtotalCoordinates')
      .mockImplementation();

    const mockUpdateOperation = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const mockUpdateObject = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const mockCompleteFetchInsertData = jest.spyOn(
      operationStepDispatcher, 'completeFetchInsertData'
    ).mockImplementation();

    // when
    await stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel(mockObjectData, mockOperationData);

    // then
    expect(mockFetchContentGenerator).toBeCalledTimes(1);
    expect(mockFetchContentGenerator).toBeCalledWith(generatorConfig);

    expect(mockSuspendApiCalculationUntilNextSync).toBeCalledTimes(suspendApiCalculationUntilNextSyncCallsNo);

    expect(mockAppendRows).toBeCalledTimes(2);
    expect(mockAppendRows).toHaveBeenNthCalledWith(
      1,
      'testOfficeTable',
      mockExcelContext,
      [42, 42],
      0,
      'testOperationType',
      'testTableColumnsChanged',
      [],
      'testHeaderOne',
      {
        subtotalsInfo: {
          importSubtotal: resultImportSubtotal,
          subtotalsAddresses: [],
        }
      },
    );
    expect(mockAppendRows).toHaveBeenNthCalledWith(
      2,
      'testOfficeTable',
      mockExcelContext,
      [42, 42, 42, 42],
      2,
      'testOperationType',
      'testTableColumnsChanged',
      [],
      'testHeaderTwo',
      {
        subtotalsInfo: {
          importSubtotal: resultImportSubtotal,
          subtotalsAddresses: [],
        }
      },
    );

    expect(mockGetSubtotalCoordinates).toBeCalledTimes(getSubtotalCoordinatesCallsNo);

    expect(mockMstrTable.subtotalsInfo.subtotalsAddresses).toEqual([]);
    expect(mockMstrTable.subtotalsInfo.importSubtotal).toEqual(resultImportSubtotal);

    expect(mockSyncChangesToExcel).toBeCalledTimes(3);
    expect(mockSyncChangesToExcel).toHaveBeenNthCalledWith(1, [], false);
    expect(mockSyncChangesToExcel).toHaveBeenNthCalledWith(2, [], false);
    expect(mockSyncChangesToExcel).toHaveBeenNthCalledWith(3, [], true);

    expect(mockUpdateOperation).toBeCalledTimes(1);
    expect(mockUpdateOperation).toBeCalledWith({
      objectWorkingId: 'testObjectWorkingId',
      instanceDefinition: resultInstanceDefinition,
    });

    expect(mockUpdateObject).toBeCalledTimes(1);
    expect(mockUpdateObject).toBeCalledWith({
      objectWorkingId: 'testObjectWorkingId',
      subtotalsInfo: {
        subtotalsAddresses: [],
        importSubtotal: resultImportSubtotal,
      },
    });

    expect(mockCompleteFetchInsertData).toBeCalledTimes(1);
    expect(mockCompleteFetchInsertData).toBeCalledWith('testObjectWorkingId');
  });

  it.each`
  subtotalAddress | subtotalsAddresses | resultSubtotalsAddresses
  
  ${[]}           | ${[]}              | ${[]}
  ${[]}           | ${[4242]}          | ${[4242]}
  ${[42]}         | ${[]}              | ${[42]}
  ${[42]}         | ${[4242]}          | ${[4242, 42]}
  ${[false]}      | ${[]}              | ${[]}
  ${[false]}      | ${[4242]}          | ${[4242]}
  ${[42, 44]}     | ${[]}              | ${[42, 44]}
  ${[42, 44]}     | ${[4242]}          | ${[4242, 42, 44]}
  
  `('getSubtotalCoordinates should work as expected',
  ({ subtotalAddress, subtotalsAddresses, resultSubtotalsAddresses }) => {
    // when
    stepFetchInsertDataIntoExcel.getSubtotalCoordinates(subtotalAddress, subtotalsAddresses);

    // then
    expect(subtotalsAddresses).toEqual(resultSubtotalsAddresses);
  });
});
