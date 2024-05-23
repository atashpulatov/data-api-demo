import formattingHelper from './formatting-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepFormatHyperlinks from './step-format-hyperlinks';

describe('StepFormatHyperlinks', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const excelContextSyncMock = jest.fn();

  it('formatHyperlinks should work as expected', async () => {
    // Given
    const operationData = {
      objectWorkingId: 212,
      excelContext: { sync: excelContextSyncMock },
      instanceDefinition: {
        columns: 'instanceColumnsTest',
        mstrTable: {
          columnInformation: 'columnInformationTest',
          isCrosstab: 'isCrosstabTest',
          metricsInRows: 'metricsInRowsTest',
        },
      },
      officeTable: {
        columns: 'columnsTest',
        rows: {
          getItemAt: jest.fn(() => ({
            getRange: jest.fn(),
          })),
        },
      },
    } as unknown as OperationData;

    const completeFormatDataSpy = jest
      .spyOn(operationStepDispatcher, 'completeFormatHyperlinks')
      .mockImplementation(() => {});

    // When
    await stepFormatHyperlinks.formatHyperlinks(
      { objectWorkingId: 212 } as ObjectData,
      operationData
    );

    // Then
    expect(excelContextSyncMock).toHaveBeenCalledTimes(1);

    expect(completeFormatDataSpy).toHaveBeenCalledTimes(1);
    expect(completeFormatDataSpy).toHaveBeenCalledWith(212);
  });

  it('formatHyperlinks should handle error', async () => {
    // Given
    jest.spyOn(formattingHelper, 'getColumnRangeForFormatting').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationStepDispatcher, 'completeFormatData').mockImplementation();

    const handleOperationErrorSpy = jest.spyOn(operationErrorHandler, 'handleOperationError');

    const operationData = {
      objectWorkingId: 2137,
      instanceDefinition: { mstrTable: { columnInformation: [{}] } },
    } as unknown as OperationData;

    // when
    await stepFormatHyperlinks.formatHyperlinks({} as ObjectData, operationData);

    // then

    expect(handleOperationErrorSpy).toHaveBeenCalledTimes(1);
    expect(handleOperationErrorSpy).toHaveBeenCalledWith({}, operationData, new Error('errorTest'));
  });
});
