import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepFetchInsertDataIntoExcel from '../../../office/import/step-fetch-insert-data-into-excel';
import { mstrObjectRestService } from '../../../mstr-object/mstr-object-rest-service';
import officeInsertService from '../../../office/import/office-insert-service';
import operationErrorHandler from '../../../operation/operation-error-handler';
import { officeApiHelper } from '../../../office/api/office-api-helper';

describe('StepFetchInsertDataIntoExcel', () => {
  const objectDataMock = {
    objectId: 'objectIdTest',
    projectId: 'projectIdTest',
    dossierData: 'dossierDataTest',
    mstrObjectType: 'mstrObjectTypeTest',
    body: 'bodyTest',
    preparedInstanceId: 'preparedInstanceIdTest',
    manipulationsXML: 'manipulationsXMLTest',
    promptsAnswers: 'promptsAnswersTest',
    visualizationInfo: 'visualizationInfoTest',
    displayAttrFormNames: 'displayAttrFormNamesTest',
    objectWorkingId: 'objectWorkingIdTest',
    subtotalsInfo: {}
  };

  const mstrTableMock = {
    subtotalsInfo: {
      importSubtotal: false
    },
  };

  const suspendApiCalculationUntilNextSyncMock = jest.fn();

  const excelContextMock = {
    workbook: {
      application: {
        suspendApiCalculationUntilNextSync: suspendApiCalculationUntilNextSyncMock,
      },
    },
  };

  const operationDataMock = {
    objectWorkingId: 'objectWorkingIdTest',
    operationType: 'operationTypeTest',
    tableChanged: 'tableChangedTest',
    officeTable: 'officeTableTest',
    excelContext: excelContextMock,
    instanceDefinition: {
      columns: 42,
      rows: 'rowsTest',
      mstrTable: mstrTableMock,
    },
  };

  const resultInstanceDefinition = {
    columns: 42,
    rows: 'rowsTest',
    mstrTable: {
      subtotalsInfo: {
        importSubtotal: true,
        subtotalsAddresses: [],
      },
    },
  };

  const limit = 4761;

  afterEach(() => {
    suspendApiCalculationUntilNextSyncMock.mockClear();
    jest.restoreAllMocks();
  });

  it('getOfficeTableImport should handle an error', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(mstrObjectRestService, 'fetchContentGenerator').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel({ subtotalsInfo: {} }, operationDataMock);

    // then
    expect(mstrObjectRestService.fetchContentGenerator).toBeCalledTimes(1);

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith({ subtotalsInfo: {} }, operationDataMock, new Error('errorTest'));

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));
  });

  it('fetchInsertDataIntoExcel should work as expected - empty rowGenerator', async () => {
    // given

    jest.spyOn(officeInsertService, 'appendRows').mockImplementation();

    jest.spyOn(officeInsertService, 'syncChangesToExcel').mockImplementation();

    jest.spyOn(mstrObjectRestService, 'fetchContentGenerator').mockReturnValue([]);

    jest.spyOn(stepFetchInsertDataIntoExcel, 'getSubtotalCoordinates').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(
      operationStepDispatcher, 'completeFetchInsertData'
    ).mockImplementation();

    // when
    await stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel(objectDataMock, operationDataMock);

    // then
    expect(mstrObjectRestService.fetchContentGenerator).toBeCalledTimes(1);
    expect(mstrObjectRestService.fetchContentGenerator).toBeCalledWith({
      ...objectDataMock,
      limit,
      instanceDefinition: resultInstanceDefinition
    });

    expect(officeInsertService.appendRows).not.toBeCalled();

    expect(mstrTableMock.subtotalsInfo.subtotalsAddresses).toEqual([]);
    expect(mstrTableMock.subtotalsInfo.importSubtotal).toEqual(true);

    expect(stepFetchInsertDataIntoExcel.getSubtotalCoordinates).not.toBeCalled();

    expect(officeInsertService.syncChangesToExcel).toBeCalledTimes(1);
    expect(officeInsertService.syncChangesToExcel).toBeCalledWith([], true);

    expect(operationStepDispatcher.updateOperation).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateOperation).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      instanceDefinition: resultInstanceDefinition,
    });

    expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      subtotalsInfo: { subtotalsAddresses: [] },
    });

    expect(operationStepDispatcher.completeFetchInsertData).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeFetchInsertData).toBeCalledWith('objectWorkingIdTest');
  });

  it.each`
  resultImportSubtotal | paramImportSubtotal | suspendApiCalculationUntilNextSyncCallsNo | getSubtotalCoordinatesCallsNo

  ${true}              | ${undefined}        | ${1}                                      | ${1}
  ${false}             | ${false}            | ${1}                                      | ${0}
  ${true}              | ${true}             | ${1}                                      | ${1}

  `('fetchInsertDataIntoExcel should work as expected - 1 row returned by rowGenerator',
  async ({
    resultImportSubtotal,
    paramImportSubtotal,
    suspendApiCalculationUntilNextSyncCallsNo,
    getSubtotalCoordinatesCallsNo
  }) => {
    // given
    objectDataMock.subtotalsInfo.importSubtotal = paramImportSubtotal;
    resultInstanceDefinition.mstrTable.subtotalsInfo.importSubtotal = resultImportSubtotal;

    jest.spyOn(officeInsertService, 'appendRows').mockImplementation();

    jest.spyOn(officeInsertService, 'syncChangesToExcel').mockImplementation();

    jest.spyOn(mstrObjectRestService, 'fetchContentGenerator').mockReturnValue(
      [{
        row: [42, 42],
        header: 'headerTest',
        subtotalAddress: 'subtotalAddressTest',
        metricsInRows: []
      }]
    );

    jest.spyOn(stepFetchInsertDataIntoExcel, 'getSubtotalCoordinates').mockImplementation();

    jest.spyOn(stepFetchInsertDataIntoExcel, 'createNewDefinition').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeFetchInsertData').mockImplementation();

    // when
    await stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel(objectDataMock, operationDataMock);

    // then
    expect(mstrObjectRestService.fetchContentGenerator).toBeCalledTimes(1);
    expect(mstrObjectRestService.fetchContentGenerator).toBeCalledWith({
      ...objectDataMock,
      limit,
      instanceDefinition: resultInstanceDefinition
    });

    expect(suspendApiCalculationUntilNextSyncMock).toBeCalledTimes(suspendApiCalculationUntilNextSyncCallsNo);

    expect(officeInsertService.appendRows).toBeCalledTimes(1);
    expect(officeInsertService.appendRows).toBeCalledWith(
      'officeTableTest',
      excelContextMock,
      [42, 42],
      0,
      'operationTypeTest',
      'tableChangedTest',
      [],
      'headerTest',
      {
        subtotalsInfo: {
          importSubtotal: resultImportSubtotal,
          subtotalsAddresses: [],
        }
      },
    );

    expect(stepFetchInsertDataIntoExcel.getSubtotalCoordinates).toBeCalledTimes(getSubtotalCoordinatesCallsNo);

    expect(stepFetchInsertDataIntoExcel.createNewDefinition).not.toBeCalled();

    expect(mstrTableMock.subtotalsInfo.subtotalsAddresses).toEqual([]);
    expect(mstrTableMock.subtotalsInfo.importSubtotal).toEqual(resultImportSubtotal);

    expect(officeInsertService.syncChangesToExcel).toBeCalledTimes(2);
    expect(officeInsertService.syncChangesToExcel).toHaveBeenNthCalledWith(1, [], false);
    expect(officeInsertService.syncChangesToExcel).toHaveBeenNthCalledWith(2, [], true);

    expect(operationStepDispatcher.updateOperation).toBeCalledTimes(2);
    expect(operationStepDispatcher.updateOperation).toHaveBeenNthCalledWith(1, { loadedRows: 2, objectWorkingId: 'objectWorkingIdTest', });
    expect(operationStepDispatcher.updateOperation).toHaveBeenNthCalledWith(2,
      {
        objectWorkingId: 'objectWorkingIdTest',
        instanceDefinition: resultInstanceDefinition,
      });

    expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      subtotalsInfo: {
        subtotalsAddresses: [],
        importSubtotal: paramImportSubtotal,
      },
    });

    expect(operationStepDispatcher.completeFetchInsertData).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeFetchInsertData).toBeCalledWith('objectWorkingIdTest');
  });

  it.each`
  resultImportSubtotal | paramImportSubtotal | suspendApiCalculationUntilNextSyncCallsNo | getSubtotalCoordinatesCallsNo

  ${true}              | ${undefined}        | ${2}                                      | ${2}
  ${false}             | ${false}            | ${2}                                      | ${0}
  ${true}              | ${true}             | ${2}                                      | ${2}
  
  `('fetchInsertDataIntoExcel should work as expected - 2 rows returned by rowGenerator',
  async ({
    resultImportSubtotal,
    paramImportSubtotal,
    suspendApiCalculationUntilNextSyncCallsNo,
    getSubtotalCoordinatesCallsNo
  }) => {
    // given
    objectDataMock.subtotalsInfo.importSubtotal = paramImportSubtotal;
    resultInstanceDefinition.mstrTable.subtotalsInfo.importSubtotal = resultImportSubtotal;

    jest.spyOn(officeInsertService, 'appendRows').mockImplementation();

    jest.spyOn(officeInsertService, 'syncChangesToExcel').mockImplementation();

    jest.spyOn(mstrObjectRestService, 'fetchContentGenerator').mockReturnValue(
      [{
        row: [42, 42],
        header: 'headerOneTest',
        subtotalAddress: 'subtotalAddressOneTest',
        metricsInRows: [
          {
            id: 'testMetricId1',
            name: 'testMetricName1',
          },
          {
            id: 'testMetricId2',
            name: 'testMetricName2',
          },
        ]
      },
      {
        row: [42, 42, 42, 42],
        header: 'headerTwoTest',
        subtotalAddress: 'subtotalAddressTwoTest',
        metricsInRows: [],
      }]
    );

    jest.spyOn(stepFetchInsertDataIntoExcel, 'getSubtotalCoordinates').mockImplementation();

    jest.spyOn(stepFetchInsertDataIntoExcel, 'createNewDefinition').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeFetchInsertData').mockImplementation();

    // when
    await stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel(objectDataMock, operationDataMock);

    // then
    expect(mstrObjectRestService.fetchContentGenerator).toBeCalledTimes(1);
    expect(mstrObjectRestService.fetchContentGenerator).toBeCalledWith({
      ...objectDataMock,
      limit,
      instanceDefinition: {
        columns: 42,
        mstrTable: {
          subtotalsInfo: {
            subtotalsAddresses: [],
            importSubtotal: resultImportSubtotal,
          },
        },
        rows: 'rowsTest',
      }
    });

    expect(suspendApiCalculationUntilNextSyncMock).toBeCalledTimes(suspendApiCalculationUntilNextSyncCallsNo);

    expect(officeInsertService.appendRows).toBeCalledTimes(2);
    expect(officeInsertService.appendRows).toHaveBeenNthCalledWith(
      1,
      'officeTableTest',
      excelContextMock,
      [42, 42],
      0,
      'operationTypeTest',
      'tableChangedTest',
      [],
      'headerOneTest',
      {
        subtotalsInfo: {
          importSubtotal: resultImportSubtotal,
          subtotalsAddresses: [],
        }
      },
    );
    expect(officeInsertService.appendRows).toHaveBeenNthCalledWith(
      2,
      'officeTableTest',
      excelContextMock,
      [42, 42, 42, 42],
      2,
      'operationTypeTest',
      'tableChangedTest',
      [],
      'headerTwoTest',
      {
        subtotalsInfo: {
          importSubtotal: resultImportSubtotal,
          subtotalsAddresses: [],
        }
      },
    );

    expect(stepFetchInsertDataIntoExcel.getSubtotalCoordinates).toBeCalledTimes(getSubtotalCoordinatesCallsNo);
    expect(stepFetchInsertDataIntoExcel.createNewDefinition).toBeCalledTimes(1);

    expect(mstrTableMock.subtotalsInfo.subtotalsAddresses).toEqual([]);
    expect(mstrTableMock.subtotalsInfo.importSubtotal).toEqual(resultImportSubtotal);

    expect(officeInsertService.syncChangesToExcel).toBeCalledTimes(3);
    expect(officeInsertService.syncChangesToExcel).toHaveBeenNthCalledWith(1, [], false);
    expect(officeInsertService.syncChangesToExcel).toHaveBeenNthCalledWith(2, [], false);
    expect(officeInsertService.syncChangesToExcel).toHaveBeenNthCalledWith(3, [], true);

    expect(operationStepDispatcher.updateOperation).toBeCalledTimes(3);
    expect(operationStepDispatcher.updateOperation).toHaveBeenNthCalledWith(1, { loadedRows: 2, objectWorkingId: 'objectWorkingIdTest', });
    expect(operationStepDispatcher.updateOperation).toHaveBeenNthCalledWith(2, { loadedRows: 6, objectWorkingId: 'objectWorkingIdTest', });
    expect(operationStepDispatcher.updateOperation).toHaveBeenNthCalledWith(3,
      {
        objectWorkingId: 'objectWorkingIdTest',
        instanceDefinition: resultInstanceDefinition,
      });

    expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      subtotalsInfo: {
        subtotalsAddresses: [],
        importSubtotal: paramImportSubtotal,
      },
    });

    expect(operationStepDispatcher.completeFetchInsertData).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeFetchInsertData).toBeCalledWith('objectWorkingIdTest');
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

  it.each`
  definition | newDefinition | newMetrics | resultCreateNewDefinition
  
  ${{ name: 'testNameInDefinition' }}     | ${null}                                                                                                   | ${[{ id: 'testMetricId1', name: 'testMetricName1' }]}     | ${{ name: 'testNameInDefinition', metrics: [{ id: 'testMetricId1', name: 'testMetricName1' }] }}
  ${{ name: 'testNameInDefinition' }}     | ${{ name: 'testNameInDefinition', metrics: [{ id: 'testMetricId1', name: 'testMetricName1' }] }}          | ${[{ id: 'testMetricId2', name: 'testMetricName2' }]}     | ${{ name: 'testNameInDefinition', metrics: [{ id: 'testMetricId1', name: 'testMetricName1' }, { id: 'testMetricId2', name: 'testMetricName2' }] }}
  
  `('createNewDefinition should work as expected',
  ({ definition, newDefinition, newMetrics, resultCreateNewDefinition }) => {
    // when
    const result = stepFetchInsertDataIntoExcel.createNewDefinition(definition, newDefinition, newMetrics);

    // then
    expect(result).toEqual(resultCreateNewDefinition);
  });
});
