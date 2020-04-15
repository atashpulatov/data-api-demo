import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import { officeRemoveHelper } from '../../../office/remove/office-remove-helper';
import stepRemoveObjectTable from '../../../office/remove/step-remove-object-table';
import { officeApiCrosstabHelper } from '../../../office/api/office-api-crosstab-helper';

describe('StepRemoveObjectStore', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('removeObjectTable should log exceptions', async () => {
    // given
    console.error = jest.fn();

    const getExcelContextMock = jest.spyOn(officeApiHelper, 'getExcelContext')
      .mockImplementation(() => {
        throw new Error('errorTest');
      });

    const completeRemoveObjectTableMock = jest.spyOn(operationStepDispatcher, 'completeRemoveObjectTable')
      .mockImplementation();

    // when
    await stepRemoveObjectTable.removeObjectTable({ objectWorkingId: 'objectWorkingIdTest' }, {});

    // then
    expect(getExcelContextMock).toBeCalledTimes(1);
    expect(getExcelContextMock).toThrowError(Error);

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(completeRemoveObjectTableMock).toBeCalledTimes(1);
    expect(completeRemoveObjectTableMock).toBeCalledWith('objectWorkingIdTest');
  });

  it.each`
  expectedIsCrosstab | isCrosstabParam | crosstabHeaderDimensionsParam

  ${true}            | ${true}         | ${{}}
  ${false}           | ${false}        | ${{}}
  ${false}           | ${undefined}    | ${{}}

  ${true}            | ${true}         | ${{ crosstabHeaderDimensionsParam: 42 }}
  ${false}           | ${false}        | ${{ crosstabHeaderDimensionsParam: 42 }}
  ${false}           | ${undefined}    | ${{ crosstabHeaderDimensionsParam: 42 }}

  `('stepRemoveObjectStore should work as expected',
  async ({
    expectedIsCrosstab,
    isCrosstabParam,
    crosstabHeaderDimensionsParam,
  }) => {
    // given
    const getItemMock = jest.fn().mockReturnValue({ sth: 42 });
    const syncMock = jest.fn();

    const excelContextMock = {
      workbook: {
        tables: {
          getItem: getItemMock,
        }
      },
      sync: syncMock,
    };

    const getExcelContextMock = jest.spyOn(officeApiHelper, 'getExcelContext').mockReturnValue(excelContextMock);

    const clearEmptyCrosstabRowMock = jest.spyOn(officeApiCrosstabHelper, 'clearEmptyCrosstabRow').mockImplementation();

    const getCrosstabHeadersSafelyMock = jest.spyOn(officeApiCrosstabHelper, 'getCrosstabHeadersSafely')
      .mockReturnValue({ validColumnsY: 'validColumnsYTest', validRowsX: 'validRowsXTest' });

    const expectedCrosstabHeaderDimensions = {
      ...crosstabHeaderDimensionsParam,
      columnsY: 'validColumnsYTest',
      rowsX: 'validRowsXTest',
    };


    const removeExcelTableMock = jest.spyOn(officeRemoveHelper, 'removeExcelTable').mockImplementation();

    const completeRemoveObjectTableMock = jest.spyOn(
      operationStepDispatcher, 'completeRemoveObjectTable'
    ).mockImplementation();

    const objectData = {
      objectWorkingId: 'objectWorkingIdTest',
      bindId: 'bindIdTest',
      isCrosstab: isCrosstabParam,
      crosstabHeaderDimensions: crosstabHeaderDimensionsParam,
    };

    // when
    await stepRemoveObjectTable.removeObjectTable(objectData, {});

    // then
    expect(getExcelContextMock).toBeCalledTimes(1);
    expect(getExcelContextMock).toBeCalledWith();

    expect(getItemMock).toBeCalledTimes(1);
    expect(getItemMock).toBeCalledWith('bindIdTest');

    expect(clearEmptyCrosstabRowMock).toBeCalledTimes(1);
    expect(clearEmptyCrosstabRowMock).toBeCalledWith({ sth: 42, showHeaders: true });

    expect(getCrosstabHeadersSafelyMock).toBeCalledTimes(1);
    expect(getCrosstabHeadersSafelyMock).toBeCalledWith(
      crosstabHeaderDimensionsParam,
      { sth: 42, showHeaders: true },
      excelContextMock,
    );

    expect(removeExcelTableMock).toBeCalledTimes(1);
    expect(removeExcelTableMock).toBeCalledWith(
      { sth: 42, showHeaders: true },
      excelContextMock,
      expectedIsCrosstab,
      expectedCrosstabHeaderDimensions,
    );

    expect(syncMock).toBeCalledTimes(1);
    expect(syncMock).toBeCalledWith();

    expect(completeRemoveObjectTableMock).toBeCalledTimes(1);
    expect(completeRemoveObjectTableMock).toBeCalledWith('objectWorkingIdTest');
  });
});
