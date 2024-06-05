import { officeApiHelper } from '../api/office-api-helper';
import { officeApiWorksheetHelper } from '../api/office-api-worksheet-helper';

import { reduxStore, RootState } from '../../store';

import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepRemoveWorksheet from './step-remove-worksheet';

const excelContextMock = {
  workbook: {
    worksheets: {
      sheets: [0, 1],
      getItem: jest.fn(),
    },
  },
} as unknown as Excel.RequestContext;

const objectData = {
  objectWorkingId: 1000,
  worksheet: { name: 'worksheetName', id: 'worksheetId' },
} as ObjectData;

describe('StepRemoveWorksheet', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('removeWorksheet should work as expected when shape API is supported', async () => {
    // given
    jest.spyOn(officeApiHelper, 'getExcelContext').mockResolvedValue(excelContextMock);

    const mockedStore = {
      officeReducer: { isShapeAPISupported: true },
    } as RootState;

    jest.spyOn(reduxStore, 'getState').mockReturnValueOnce(mockedStore);
    jest.spyOn(officeApiWorksheetHelper, 'removeWorksheetIfEmpty').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'completeRemoveWorksheet').mockImplementation();

    // when
    await stepRemoveWorksheet.removeWorksheet(objectData);

    // then
    expect(officeApiHelper.getExcelContext).toHaveBeenCalledTimes(1);

    expect(officeApiWorksheetHelper.removeWorksheetIfEmpty).toHaveBeenCalledTimes(1);
    expect(officeApiWorksheetHelper.removeWorksheetIfEmpty).toHaveBeenCalledWith(
      excelContextMock,
      'worksheetId'
    );

    expect(operationStepDispatcher.completeRemoveWorksheet).toHaveBeenCalledTimes(1);
    expect(operationStepDispatcher.completeRemoveWorksheet).toHaveBeenCalledWith(1000);
  });

  it('removeWorksheetIfEmpty should not be called when shape API is not supported', async () => {
    // given
    const mockedStore = {
      officeReducer: { isShapeAPISupported: false },
    } as RootState;

    jest.spyOn(reduxStore, 'getState').mockReturnValueOnce(mockedStore);
    jest.spyOn(officeApiWorksheetHelper, 'removeWorksheetIfEmpty').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'completeRemoveWorksheet').mockImplementation();

    // when
    await stepRemoveWorksheet.removeWorksheet(objectData);

    // then
    expect(officeApiWorksheetHelper.removeWorksheetIfEmpty).not.toHaveBeenCalled();

    expect(operationStepDispatcher.completeRemoveWorksheet).toHaveBeenCalledTimes(1);
    expect(operationStepDispatcher.completeRemoveWorksheet).toHaveBeenCalledWith(1000);
  });
});
