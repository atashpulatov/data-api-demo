import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import { officeRemoveHelper } from '../../../office/remove/office-remove-helper';
import stepRemoveObjectTable from '../../../office/remove/step-remove-object-table';

describe('StepRemoveObjectStore', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
  expectedIsCrosstab | expectedCrosstabHeaderDimensions  | isCrosstabParam   | crosstabHeaderDimensionsParam

  ${true}            | ${{}}                             | ${true}           | ${undefined}
  ${false}           | ${{}}                             | ${false}          | ${undefined}
  ${false}           | ${{}}                             | ${undefined}      | ${undefined}

  ${true}            | ${{}}                             | ${true}           | ${{}}
  ${false}           | ${{}}                             | ${false}          | ${{}}
  ${false}           | ${{}}                             | ${undefined}      | ${{}}

  ${true}            | ${'crosstabHeaderDimensionsTest'} | ${true}           | ${'crosstabHeaderDimensionsTest'}
  ${false}           | ${'crosstabHeaderDimensionsTest'} | ${false}          | ${'crosstabHeaderDimensionsTest'}
  ${false}           | ${'crosstabHeaderDimensionsTest'} | ${undefined}      | ${'crosstabHeaderDimensionsTest'}

  `('stepRemoveObjectStore should work as expected',
  async ({
    expectedIsCrosstab,
    expectedCrosstabHeaderDimensions,
    isCrosstabParam,
    crosstabHeaderDimensionsParam,
  }) => {
    // given
    const getItemMock = jest.fn().mockReturnValue('officeTableTest');
    const syncMock = jest.fn();

    /* eslint-disable object-curly-newline */
    const excelContextMock = {
      workbook: {
        tables: {
          getItem: getItemMock,
        }
      },
      sync: syncMock,
    };
    /* eslint-enable object-curly-newline */

    const getExcelContextMock = jest.spyOn(officeApiHelper, 'getExcelContext').mockReturnValue(excelContextMock);

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

    expect(removeExcelTableMock).toBeCalledTimes(1);
    expect(removeExcelTableMock).toBeCalledWith(
      'officeTableTest',
      excelContextMock,
      expectedIsCrosstab,
      expectedCrosstabHeaderDimensions
    );

    expect(syncMock).toBeCalledTimes(1);
    expect(syncMock).toBeCalledWith();

    expect(completeRemoveObjectTableMock).toBeCalledTimes(1);
    expect(completeRemoveObjectTableMock).toBeCalledWith('objectWorkingIdTest');
  });
});
