import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepFetchInsertDataIntoExcel from '../../../office/import/step-fetch-insert-data-into-excel';
import { mstrObjectRestService } from '../../../mstr-object/mstr-object-rest-service';
import officeInsertService from '../../../office/import/office-insert-service';
import operationErrorHandler from '../../../operation/operation-error-handler';

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
    tableColumnsChanged: 'tableColumnsChangedTest',
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
    console.error = jest.fn();

    const fetchContentGeneratorMock = jest.spyOn(mstrObjectRestService, 'fetchContentGenerator').mockImplementation(() => {
      throw new Error('errorTest');
    });

    const handleOperationErrorMock = jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel({ subtotalsInfo: {} }, operationDataMock);

    // then
    expect(fetchContentGeneratorMock).toBeCalledTimes(1);

    expect(handleOperationErrorMock).toBeCalledTimes(1);
    expect(handleOperationErrorMock).toBeCalledWith({ subtotalsInfo: {} }, operationDataMock, new Error('errorTest'));

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));
  });

  it('fetchInsertDataIntoExcel should work as expected - empty rowGenerator', async () => {
    // given
    const appendRowsMock = jest.spyOn(officeInsertService, 'appendRows').mockImplementation();

    const syncChangesToExcelMock = jest.spyOn(officeInsertService, 'syncChangesToExcel').mockImplementation();

    const fetchContentGeneratorMock = jest.spyOn(mstrObjectRestService, 'fetchContentGenerator').mockReturnValue([]);

    const getSubtotalCoordinatesMock = jest.spyOn(stepFetchInsertDataIntoExcel, 'getSubtotalCoordinates')
      .mockImplementation();

    const updateOperationMock = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const updateObjectMock = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const completeFetchInsertDataMock = jest.spyOn(
      operationStepDispatcher, 'completeFetchInsertData'
    ).mockImplementation();

    // when
    await stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel(objectDataMock, operationDataMock);

    // then
    expect(fetchContentGeneratorMock).toBeCalledTimes(1);
    expect(fetchContentGeneratorMock).toBeCalledWith({
      ...objectDataMock,
      limit,
      instanceDefinition: resultInstanceDefinition
    });

    expect(appendRowsMock).not.toBeCalled();

    expect(mstrTableMock.subtotalsInfo.subtotalsAddresses).toEqual([]);
    expect(mstrTableMock.subtotalsInfo.importSubtotal).toEqual(true);

    expect(getSubtotalCoordinatesMock).not.toBeCalled();

    expect(syncChangesToExcelMock).toBeCalledTimes(1);
    expect(syncChangesToExcelMock).toBeCalledWith([], true);

    expect(updateOperationMock).toBeCalledTimes(1);
    expect(updateOperationMock).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      instanceDefinition: resultInstanceDefinition,
    });

    expect(updateObjectMock).toBeCalledTimes(1);
    expect(updateObjectMock).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      subtotalsInfo: { subtotalsAddresses: [] },
    });

    expect(completeFetchInsertDataMock).toBeCalledTimes(1);
    expect(completeFetchInsertDataMock).toBeCalledWith('objectWorkingIdTest');
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

    const appendRowsMock = jest.spyOn(officeInsertService, 'appendRows').mockImplementation();

    const syncChangesToExcelMock = jest.spyOn(officeInsertService, 'syncChangesToExcel').mockImplementation();

    const fetchContentGeneratorMock = jest.spyOn(mstrObjectRestService, 'fetchContentGenerator').mockReturnValue(
      [{
        row: [42, 42],
        header: 'headerTest',
        subtotalAddress: 'subtotalAddressTest',
      }]
    );

    const getSubtotalCoordinatesMock = jest.spyOn(stepFetchInsertDataIntoExcel, 'getSubtotalCoordinates')
      .mockImplementation();

    const updateOperationMock = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const updateObjectMock = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const completeFetchInsertDataMock = jest.spyOn(
      operationStepDispatcher, 'completeFetchInsertData'
    ).mockImplementation();

    // when
    await stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel(objectDataMock, operationDataMock);

    // then
    expect(fetchContentGeneratorMock).toBeCalledTimes(1);
    expect(fetchContentGeneratorMock).toBeCalledWith({
      ...objectDataMock,
      limit,
      instanceDefinition: resultInstanceDefinition
    });

    expect(suspendApiCalculationUntilNextSyncMock).toBeCalledTimes(suspendApiCalculationUntilNextSyncCallsNo);

    expect(appendRowsMock).toBeCalledTimes(1);
    expect(appendRowsMock).toBeCalledWith(
      'officeTableTest',
      excelContextMock,
      [42, 42],
      0,
      'operationTypeTest',
      'tableColumnsChangedTest',
      [],
      'headerTest',
      {
        subtotalsInfo: {
          importSubtotal: resultImportSubtotal,
          subtotalsAddresses: [],
        }
      },
    );

    expect(getSubtotalCoordinatesMock).toBeCalledTimes(getSubtotalCoordinatesCallsNo);

    expect(mstrTableMock.subtotalsInfo.subtotalsAddresses).toEqual([]);
    expect(mstrTableMock.subtotalsInfo.importSubtotal).toEqual(resultImportSubtotal);

    expect(syncChangesToExcelMock).toBeCalledTimes(2);
    expect(syncChangesToExcelMock).toHaveBeenNthCalledWith(1, [], false);
    expect(syncChangesToExcelMock).toHaveBeenNthCalledWith(2, [], true);

    expect(updateOperationMock).toBeCalledTimes(2);
    expect(updateOperationMock).toHaveBeenNthCalledWith(1, { loadedRows: 2, objectWorkingId: 'objectWorkingIdTest', });
    expect(updateOperationMock).toHaveBeenNthCalledWith(2,
      {
        objectWorkingId: 'objectWorkingIdTest',
        instanceDefinition: resultInstanceDefinition,
      });

    expect(updateObjectMock).toBeCalledTimes(1);
    expect(updateObjectMock).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      subtotalsInfo: {
        subtotalsAddresses: [],
        importSubtotal: paramImportSubtotal,
      },
    });

    expect(completeFetchInsertDataMock).toBeCalledTimes(1);
    expect(completeFetchInsertDataMock).toBeCalledWith('objectWorkingIdTest');
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

    const appendRowsMock = jest.spyOn(officeInsertService, 'appendRows').mockImplementation();

    const syncChangesToExcelMock = jest.spyOn(officeInsertService, 'syncChangesToExcel').mockImplementation();

    const fetchContentGeneratorMock = jest.spyOn(mstrObjectRestService, 'fetchContentGenerator').mockReturnValue(
      [{
        row: [42, 42],
        header: 'headerOneTest',
        subtotalAddress: 'subtotalAddressOneTest',
      },
      {
        row: [42, 42, 42, 42],
        header: 'headerTwoTest',
        subtotalAddress: 'subtotalAddressTwoTest',
      }]
    );

    const getSubtotalCoordinatesMock = jest.spyOn(stepFetchInsertDataIntoExcel, 'getSubtotalCoordinates')
      .mockImplementation();

    const updateOperationMock = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const updateObjectMock = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const completeFetchInsertDataMock = jest.spyOn(
      operationStepDispatcher, 'completeFetchInsertData'
    ).mockImplementation();

    // when
    await stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel(objectDataMock, operationDataMock);

    // then
    expect(fetchContentGeneratorMock).toBeCalledTimes(1);
    expect(fetchContentGeneratorMock).toBeCalledWith({
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

    expect(appendRowsMock).toBeCalledTimes(2);
    expect(appendRowsMock).toHaveBeenNthCalledWith(
      1,
      'officeTableTest',
      excelContextMock,
      [42, 42],
      0,
      'operationTypeTest',
      'tableColumnsChangedTest',
      [],
      'headerOneTest',
      {
        subtotalsInfo: {
          importSubtotal: resultImportSubtotal,
          subtotalsAddresses: [],
        }
      },
    );
    expect(appendRowsMock).toHaveBeenNthCalledWith(
      2,
      'officeTableTest',
      excelContextMock,
      [42, 42, 42, 42],
      2,
      'operationTypeTest',
      'tableColumnsChangedTest',
      [],
      'headerTwoTest',
      {
        subtotalsInfo: {
          importSubtotal: resultImportSubtotal,
          subtotalsAddresses: [],
        }
      },
    );

    expect(getSubtotalCoordinatesMock).toBeCalledTimes(getSubtotalCoordinatesCallsNo);

    expect(mstrTableMock.subtotalsInfo.subtotalsAddresses).toEqual([]);
    expect(mstrTableMock.subtotalsInfo.importSubtotal).toEqual(resultImportSubtotal);

    expect(syncChangesToExcelMock).toBeCalledTimes(3);
    expect(syncChangesToExcelMock).toHaveBeenNthCalledWith(1, [], false);
    expect(syncChangesToExcelMock).toHaveBeenNthCalledWith(2, [], false);
    expect(syncChangesToExcelMock).toHaveBeenNthCalledWith(3, [], true);

    expect(updateOperationMock).toBeCalledTimes(3);
    expect(updateOperationMock).toHaveBeenNthCalledWith(1, { loadedRows: 2, objectWorkingId: 'objectWorkingIdTest', });
    expect(updateOperationMock).toHaveBeenNthCalledWith(2, { loadedRows: 6, objectWorkingId: 'objectWorkingIdTest', });
    expect(updateOperationMock).toHaveBeenNthCalledWith(3,
      {
        objectWorkingId: 'objectWorkingIdTest',
        instanceDefinition: resultInstanceDefinition,
      });

    expect(updateObjectMock).toBeCalledTimes(1);
    expect(updateObjectMock).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      subtotalsInfo: {
        subtotalsAddresses: [],
        importSubtotal: paramImportSubtotal,
      },
    });

    expect(completeFetchInsertDataMock).toBeCalledTimes(1);
    expect(completeFetchInsertDataMock).toBeCalledWith('objectWorkingIdTest');
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
