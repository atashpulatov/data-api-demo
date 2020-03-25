
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
    const objectData = { objectWorkingId: 'testObjectWorkingId' };

    /* eslint-disable object-curly-newline */
    const operationData = {
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

    const mockApplySubtotalFormatting = jest.spyOn(officeFormatSubtotals, 'applySubtotalFormatting');

    const mockCompleteFormatSubtotals = jest.spyOn(
      operationStepDispatcher, 'completeFormatSubtotals'
    ).mockImplementation();

    // when
    await stepApplySubtotalFormatting.applySubtotalFormattingRedux(objectData, operationData);

    // then
    expect(mockApplySubtotalFormatting).not.toBeCalled();

    expect(mockCompleteFormatSubtotals).toBeCalledTimes(1);
    expect(mockCompleteFormatSubtotals).toBeCalledWith('testObjectWorkingId');
  });

  it('applySubtotalFormattingRedux should work as expected - subtotalsAddresses.length is defined', async () => {
    // given
    const objectData = { objectWorkingId: 'testObjectWorkingId' };

    /* eslint-disable object-curly-newline */
    const operationData = {
      excelContext: 'testExcelContext',
      instanceDefinition: {
        mstrTable: {
          subtotalsInfo: {
            subtotalsAddresses: {
              length: 42
            }
          }
        }
      },
      officeTable: 'testOfficeTable',
    };
    /* eslint-enable object-curly-newline */

    const mockApplySubtotalFormatting = jest.spyOn(officeFormatSubtotals, 'applySubtotalFormatting')
      .mockImplementation();

    const mockCompleteFormatSubtotals = jest.spyOn(
      operationStepDispatcher, 'completeFormatSubtotals'
    ).mockImplementation();

    // when
    await stepApplySubtotalFormatting.applySubtotalFormattingRedux(objectData, operationData);

    // then
    expect(mockApplySubtotalFormatting).toBeCalledTimes(1);
    expect(mockApplySubtotalFormatting).toBeCalledWith({
      excelContext: 'testExcelContext',
      officeTable: 'testOfficeTable'
    }, {
      /* eslint-disable object-curly-newline */
      subtotalsInfo: {
        subtotalsAddresses: {
          length: 42
        }
      }
      /* eslint-enable object-curly-newline */
    });

    expect(mockCompleteFormatSubtotals).toBeCalledTimes(1);
    expect(mockCompleteFormatSubtotals).toBeCalledWith('testObjectWorkingId');
  });
});
