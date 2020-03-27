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

    const applySubtotalFormattingMock = jest.spyOn(officeFormatSubtotals, 'applySubtotalFormatting');

    const completeFormatSubtotalsMock = jest.spyOn(
      operationStepDispatcher, 'completeFormatSubtotals'
    ).mockImplementation();

    // when
    await stepApplySubtotalFormatting.applySubtotalFormattingRedux(objectData, operationData);

    // then
    expect(applySubtotalFormattingMock).not.toBeCalled();

    expect(completeFormatSubtotalsMock).toBeCalledTimes(1);
    expect(completeFormatSubtotalsMock).toBeCalledWith('objectWorkingIdTest');
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

    const applySubtotalFormattingMock = jest.spyOn(officeFormatSubtotals, 'applySubtotalFormatting')
      .mockImplementation();

    const completeFormatSubtotalsMock = jest.spyOn(
      operationStepDispatcher, 'completeFormatSubtotals'
    ).mockImplementation();

    // when
    await stepApplySubtotalFormatting.applySubtotalFormattingRedux(objectData, operationData);

    // then
    expect(applySubtotalFormattingMock).toBeCalledTimes(1);
    expect(applySubtotalFormattingMock).toBeCalledWith({
      excelContext: 'excelContextTest',
      officeTable: 'officeTableTest'
    }, {
      /* eslint-disable object-curly-newline */
      subtotalsInfo: {
        subtotalsAddresses: {
          length: 42
        }
      }
      /* eslint-enable object-curly-newline */
    });

    expect(completeFormatSubtotalsMock).toBeCalledTimes(1);
    expect(completeFormatSubtotalsMock).toBeCalledWith('objectWorkingIdTest');
  });
});
