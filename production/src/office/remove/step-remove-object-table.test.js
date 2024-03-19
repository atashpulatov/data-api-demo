import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';
import { officeRemoveHelper } from './office-remove-helper';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepRemoveObjectTable from './step-remove-object-table';

describe('StepRemoveObjectTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('removeObjectTable should log exceptions', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationStepDispatcher, 'completeRemoveObjectTable').mockImplementation();

    // when
    await stepRemoveObjectTable.removeObjectTable({ objectWorkingId: 'objectWorkingIdTest' }, {});

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(officeApiHelper.getExcelContext).toThrowError(Error);

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(operationStepDispatcher.completeRemoveObjectTable).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeRemoveObjectTable).toBeCalledWith('objectWorkingIdTest');
  });

  it.each`
    isCrosstabParam | crosstabHeaderDimensionsParam
    ${true}         | ${{}}
    ${false}        | ${{}}
    ${undefined}    | ${{}}
    ${true}         | ${{ crosstabHeaderDimensionsParam: 42 }}
    ${false}        | ${{ crosstabHeaderDimensionsParam: 42 }}
    ${undefined}    | ${{ crosstabHeaderDimensionsParam: 42 }}
  `(
    'removeObjectTable should work as expected',
    async ({ isCrosstabParam, crosstabHeaderDimensionsParam }) => {
      // given
      const getItemMock = jest.fn().mockReturnValue({ sth: 42 });

      const excelContextMock = {
        workbook: {
          tables: {
            getItem: getItemMock,
          },
        },
      };

      jest.spyOn(officeApiHelper, 'getExcelContext').mockReturnValue(excelContextMock);

      jest.spyOn(officeRemoveHelper, 'checkIfObjectExist').mockReturnValue(true);

      jest
        .spyOn(officeApiCrosstabHelper, 'getCrosstabHeadersSafely')
        .mockReturnValue({ validColumnsY: 2, validRowsX: 'validRowsXTest' });

      jest.spyOn(officeRemoveHelper, 'removeExcelTable').mockImplementation();
      jest.spyOn(officeApiCrosstabHelper, 'clearCrosstabRange').mockImplementation();
      jest.spyOn(operationStepDispatcher, 'completeRemoveObjectTable').mockImplementation();

      const objectData = {
        objectWorkingId: 'objectWorkingIdTest',
        bindId: 'bindIdTest',
        isCrosstab: isCrosstabParam,
        crosstabHeaderDimensions: crosstabHeaderDimensionsParam,
      };

      // when
      await stepRemoveObjectTable.removeObjectTable(objectData, {});

      // then
      expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
      expect(officeApiHelper.getExcelContext).toBeCalledWith();

      expect(getItemMock).toBeCalledTimes(1);
      expect(getItemMock).toBeCalledWith('bindIdTest');

      expect(officeApiCrosstabHelper.getCrosstabHeadersSafely).toBeCalledTimes(1);
      expect(officeApiCrosstabHelper.getCrosstabHeadersSafely).toBeCalledWith(
        crosstabHeaderDimensionsParam,
        { sth: 42 },
        excelContextMock
      );

      expect(officeRemoveHelper.removeExcelTable).toBeCalledTimes(1);
      expect(officeRemoveHelper.removeExcelTable).toBeCalledWith(
        { sth: 42 },
        excelContextMock,
        false
      );

      expect(operationStepDispatcher.completeRemoveObjectTable).toBeCalledTimes(1);
      expect(operationStepDispatcher.completeRemoveObjectTable).toBeCalledWith(
        'objectWorkingIdTest'
      );
    }
  );
});
