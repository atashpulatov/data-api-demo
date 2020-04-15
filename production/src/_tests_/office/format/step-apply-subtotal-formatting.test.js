import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import officeFormatSubtotals from '../../../office/format/office-format-subtotals';
import stepApplySubtotalFormatting from '../../../office/format/step-apply-subtotal-formatting';

describe('StepApplySubtotalFormatting', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
  subtotalsAddressesLength
  
  ${undefined}
  ${0}
  
  `('applySubtotalFormattingRedux should work as expected - subtotalsAddresses.length is 0 or undefined',
  async ({ subtotalsAddressesLength }) => {
    // given
    const objectData = { };

    /* eslint-disable object-curly-newline */
    const operationData = {
      objectWorkingId: 'objectWorkingIdTest',
      instanceDefinition: {
        mstrTable: {
          subtotalsInfo: {
            subtotalsAddresses: {
              length: subtotalsAddressesLength
            }
          }
        }
      },
    };
    /* eslint-enable object-curly-newline */

    jest.spyOn(officeFormatSubtotals, 'applySubtotalFormatting').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeFormatSubtotals').mockImplementation();

    // when
    await stepApplySubtotalFormatting.applySubtotalFormattingRedux(objectData, operationData);

    // then
    expect(officeFormatSubtotals.applySubtotalFormatting).not.toBeCalled();

    expect(operationStepDispatcher.completeFormatSubtotals).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeFormatSubtotals).toBeCalledWith('objectWorkingIdTest');
  });

  it('applySubtotalFormattingRedux should work as expected - subtotalsAddresses.length is defined', async () => {
    // given
    const objectData = { };

    /* eslint-disable object-curly-newline */
    const operationData = {
      objectWorkingId: 'objectWorkingIdTest',
      excelContext: 'excelContextTest',
      instanceDefinition: {
        mstrTable: {
          subtotalsInfo: {
            subtotalsAddresses: {
              length: 42
            }
          }
        }
      },
      officeTable: 'officeTableTest',
    };
    /* eslint-enable object-curly-newline */

    jest.spyOn(officeFormatSubtotals, 'applySubtotalFormatting').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeFormatSubtotals').mockImplementation();

    // when
    await stepApplySubtotalFormatting.applySubtotalFormattingRedux(objectData, operationData);

    // then
    expect(officeFormatSubtotals.applySubtotalFormatting).toBeCalledTimes(1);
    expect(officeFormatSubtotals.applySubtotalFormatting).toBeCalledWith(
      'excelContextTest',
      'officeTableTest',
      {
        /* eslint-disable object-curly-newline */
        subtotalsInfo: {
          subtotalsAddresses: {
            length: 42
          }
        }
        /* eslint-enable object-curly-newline */
      }
    );

    expect(operationStepDispatcher.completeFormatSubtotals).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeFormatSubtotals).toBeCalledWith('objectWorkingIdTest');
  });
});
