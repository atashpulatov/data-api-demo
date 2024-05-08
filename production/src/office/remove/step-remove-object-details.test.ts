import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';
import { officeRemoveHelper } from './office-remove-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepRemoveObjectDetails from './step-remove-object-details';

describe('StepRemoveObjectDetails', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('removeObjectDetails should log exceptions', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationStepDispatcher, 'completeRemoveObjectDetails').mockImplementation();

    // when
    await stepRemoveObjectDetails.removeObjectDetails(
      { objectWorkingId: 2137 } as ObjectData,
      {} as OperationData
    );

    // then
    expect(officeApiHelper.getExcelContext).toHaveBeenCalledTimes(1);
    expect(officeApiHelper.getExcelContext).toThrow(Error);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(new Error('errorTest'));

    expect(operationStepDispatcher.completeRemoveObjectDetails).toHaveBeenCalledTimes(1);
    expect(operationStepDispatcher.completeRemoveObjectDetails).toHaveBeenCalledWith(2137);
  });

  it.each`
    isCrosstabParam
    ${true}
    ${false}
  `('removeObjectDetails should work as expected', async ({ isCrosstabParam }) => {
    // given
    const clearMock = jest.fn();
    const getRowsAboveMock = jest.fn().mockReturnValue({
      clear: clearMock,
    });
    const excelContextMock = {
      workbook: {
        tables: {
          getItem: jest.fn().mockReturnValue({
            getRange: jest.fn().mockReturnValue({
              getCell: jest.fn().mockReturnValue({
                getRowsAbove: getRowsAboveMock,
                load: jest.fn(),
              }),
              getRowsAbove: getRowsAboveMock,
            }),
          }),
        },
      },
      sync: jest.fn(),
      trackedObjects: {
        add: jest.fn(),
      },
    } as unknown as Excel.RequestContext;

    jest.spyOn(officeApiHelper, 'getExcelContext').mockResolvedValue(excelContextMock);

    jest.spyOn(officeApiHelper, 'getStartCellOfRange').mockReturnValue('A1');

    jest.spyOn(officeRemoveHelper, 'checkIfObjectExist').mockResolvedValue(true);

    jest
      .spyOn(officeApiCrosstabHelper, 'getCrosstabHeadersSafely')
      .mockResolvedValue({ validColumnsY: 2, validRowsX: 'validRowsXTest' });

    jest.spyOn(operationStepDispatcher, 'completeRemoveObjectDetails').mockImplementation();

    const objectData = {
      objectWorkingId: 2137,
      bindId: 'bindIdTest',
      isCrosstab: isCrosstabParam,
      startCell: 'A1',
      objectSettings: { objectDetailsSize: 2 },
    } as unknown as ObjectData;

    // when
    await stepRemoveObjectDetails.removeObjectDetails(objectData, {} as OperationData);

    // then
    expect(officeApiHelper.getExcelContext).toHaveBeenCalledTimes(1);
    expect(officeApiHelper.getExcelContext).toHaveBeenCalledWith();

    expect(excelContextMock.workbook.tables.getItem).toHaveBeenCalledTimes(1);
    expect(excelContextMock.workbook.tables.getItem).toHaveBeenCalledWith('bindIdTest');

    expect(officeApiCrosstabHelper.getCrosstabHeadersSafely).toHaveBeenCalledTimes(1);

    expect(clearMock).toHaveBeenCalledTimes(2);

    expect(operationStepDispatcher.completeRemoveObjectDetails).toHaveBeenCalledTimes(1);
    expect(operationStepDispatcher.completeRemoveObjectDetails).toHaveBeenCalledWith(2137);
  });

  it.each`
    isCrosstabParam
    ${true}
    ${false}
  `('should not call clear function when startCell is different', async ({ isCrosstabParam }) => {
    // given
    const clearMock = jest.fn();
    const getRowsAboveMock = jest.fn().mockReturnValue({
      clear: clearMock,
    });
    const excelContextMock = {
      workbook: {
        tables: {
          getItem: jest.fn().mockReturnValue({
            getRange: jest.fn().mockReturnValue({
              getCell: jest.fn().mockReturnValue({
                getRowsAbove: getRowsAboveMock,
                load: jest.fn(),
              }),
              getRowsAbove: getRowsAboveMock,
            }),
          }),
        },
      },
      sync: jest.fn(),
      trackedObjects: {
        add: jest.fn(),
      },
    } as unknown as Excel.RequestContext;

    jest.spyOn(officeApiHelper, 'getExcelContext').mockResolvedValue(excelContextMock);

    jest.spyOn(officeApiHelper, 'getStartCellOfRange').mockReturnValue('B1');

    jest.spyOn(officeRemoveHelper, 'checkIfObjectExist').mockResolvedValue(true);

    jest
      .spyOn(officeApiCrosstabHelper, 'getCrosstabHeadersSafely')
      .mockResolvedValue({ validColumnsY: 2, validRowsX: 'validRowsXTest' });

    jest.spyOn(operationStepDispatcher, 'completeRemoveObjectDetails').mockImplementation();

    const objectData = {
      objectWorkingId: 2137,
      bindId: 'bindIdTest',
      isCrosstab: isCrosstabParam,
      startCell: 'A1',
      objectSettings: { objectDetailsSize: 2 },
    } as unknown as ObjectData;

    // when
    await stepRemoveObjectDetails.removeObjectDetails(objectData, {} as OperationData);

    // then
    expect(officeApiHelper.getExcelContext).toHaveBeenCalledTimes(1);
    expect(officeApiHelper.getExcelContext).toHaveBeenCalledWith();

    expect(excelContextMock.workbook.tables.getItem).toHaveBeenCalledTimes(1);
    expect(excelContextMock.workbook.tables.getItem).toHaveBeenCalledWith('bindIdTest');

    expect(officeApiCrosstabHelper.getCrosstabHeadersSafely).toHaveBeenCalledTimes(1);

    expect(clearMock).not.toHaveBeenCalled();

    expect(operationStepDispatcher.completeRemoveObjectDetails).toHaveBeenCalledTimes(1);
    expect(operationStepDispatcher.completeRemoveObjectDetails).toHaveBeenCalledWith(2137);
  });
});
