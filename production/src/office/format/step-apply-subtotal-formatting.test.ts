import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeFormatSubtotals from './office-format-subtotals';
import stepApplySubtotalFormatting from './step-apply-subtotal-formatting';
import { ObjectImportType } from '../../mstr-object/constants';

describe('StepApplySubtotalFormatting', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
    subtotalsAddressesLength
    ${undefined}
    ${0}
  `(
    'applySubtotalFormattingRedux should work as expected - subtotalsAddresses.length is 0 or undefined',
    async ({ subtotalsAddressesLength }) => {
      // given
      const objectData = {} as ObjectData;

      const operationData = {
        objectWorkingId: 2137,
        instanceDefinition: {
          mstrTable: {
            subtotalsInfo: {
              subtotalsAddresses: {
                length: subtotalsAddressesLength,
              },
            },
          },
        },
      } as unknown as OperationData;

      jest.spyOn(officeFormatSubtotals, 'applySubtotalFormatting').mockImplementation();

      jest.spyOn(operationStepDispatcher, 'completeFormatSubtotals').mockImplementation();

      // when
      await stepApplySubtotalFormatting.applySubtotalFormattingRedux(objectData, operationData);

      // then
      expect(officeFormatSubtotals.applySubtotalFormatting).not.toBeCalled();

      expect(operationStepDispatcher.completeFormatSubtotals).toBeCalledTimes(1);
      expect(operationStepDispatcher.completeFormatSubtotals).toBeCalledWith(2137);
    }
  );

  it('applySubtotalFormattingRedux should work as expected - subtotalsAddresses.length is defined', async () => {
    // given
    const objectData = {} as ObjectData;

    const operationData = {
      objectWorkingId: 2137,
      excelContext: 'excelContextTest',
      instanceDefinition: {
        mstrTable: {
          subtotalsInfo: {
            subtotalsAddresses: {
              length: 42,
            },
          },
        },
      },
      officeTable: 'officeTableTest',
    } as unknown as OperationData;

    jest.spyOn(officeFormatSubtotals, 'applySubtotalFormatting').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeFormatSubtotals').mockImplementation();

    // when
    await stepApplySubtotalFormatting.applySubtotalFormattingRedux(objectData, operationData);

    // then
    expect(officeFormatSubtotals.applySubtotalFormatting).toBeCalledTimes(1);
    expect(officeFormatSubtotals.applySubtotalFormatting).toBeCalledWith(
      'officeTableTest',
      'excelContextTest',
      {
        subtotalsInfo: {
          subtotalsAddresses: {
            length: 42,
          },
        },
      }
    );

    expect(operationStepDispatcher.completeFormatSubtotals).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeFormatSubtotals).toBeCalledWith(2137);
  });
});
