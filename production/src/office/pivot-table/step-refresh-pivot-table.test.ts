import { officeApiHelper } from '../api/office-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepRefreshPivotTable from './step-refresh-pivot-table';

describe('StepRefreshPivotTable', () => {
  it('refreshPivotTable should work as expected', async () => {
    // given
    const refresh = jest.fn();
    const getItem = jest.fn().mockReturnValue({ refresh });
    const sync = jest.fn();

    const excelContext = {
      workbook: {
        pivotTables: {
          getItem,
        },
      },
      sync,
    } as Partial<OperationData>;

    const objectData = {
      pivotTableId: '2137',
      objectWorkingId: 42,
    } as ObjectData;

    const operationData = {
      excelContext,
    } as OperationData;

    jest.spyOn(operationStepDispatcher, 'completeRefreshPivotTable');
    const getPivotTable = jest
      .spyOn(officeApiHelper, 'getPivotTable')
      .mockResolvedValue({ isNullObject: false, refresh } as any);

    // when
    await stepRefreshPivotTable.refreshPivotTable(objectData, operationData);

    // then
    expect(getPivotTable).toHaveBeenCalledWith(excelContext, objectData.pivotTableId);
    expect(refresh).toHaveBeenCalled();
    expect(sync).toHaveBeenCalled();
    expect(operationStepDispatcher.completeRefreshPivotTable).toHaveBeenCalledWith(
      objectData.objectWorkingId
    );
  });
});
