import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepApplyFormatting from '../../../office/format/step-apply-formatting';

describe('StepApplyFormatting', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('applyFormatting should log exceptions', async () => {
    // given
    console.log = jest.fn();
    console.error = jest.fn();

    const mockFilterColumnInformation = jest.spyOn(stepApplyFormatting, 'filterColumnInformation')
      .mockImplementation(() => {
        throw new Error('testError');
      });

    // when
    await stepApplyFormatting.applyFormatting({}, { instanceDefinition: { mstrTable: {} }, });

    // then
    expect(mockFilterColumnInformation).toBeCalledTimes(1);
    expect(mockFilterColumnInformation).toThrowError(Error);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith('Cannot apply formatting, skipping');
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('testError'));
  });

  it('applyFormatting should work as expected', async () => {
    // given
    const mockExcelContextSync = jest.fn();
    const operationData = {
      objectWorkingId: 'testObjectWorkingId',
      excelContext: { sync: mockExcelContextSync, },
      instanceDefinition: {
        mstrTable: {
          columnInformation: 'testColumnInformation',
          isCrosstab: 'testIsCrosstab',
        }
      },
      officeTable: { columns: 'testColumns' },
    };

    const mockFilterColumnInformation = jest.spyOn(stepApplyFormatting, 'filterColumnInformation')
      .mockReturnValue('testFilteredColumnInformation');

    const mockCalculateAttributeColumnNumber = jest.spyOn(stepApplyFormatting, 'calculateAttributeColumnNumber')
      .mockReturnValue('testAttributeColumnNumber');

    const mockCalculateOffset = jest.spyOn(stepApplyFormatting, 'calculateOffset')
      .mockReturnValue('testCalculateOffset');

    const mockSetupFormatting = jest.spyOn(stepApplyFormatting, 'setupFormatting').mockImplementation();

    const mockCompleteFormatData = jest.spyOn(
      operationStepDispatcher, 'completeFormatData'
    ).mockImplementation();

    // when
    await stepApplyFormatting.applyFormatting({}, operationData);

    // then
    expect(mockFilterColumnInformation).toBeCalledTimes(1);
    expect(mockFilterColumnInformation).toBeCalledWith('testColumnInformation', 'testIsCrosstab');

    expect(mockCalculateAttributeColumnNumber).toBeCalledTimes(1);
    expect(mockCalculateAttributeColumnNumber).toBeCalledWith('testColumnInformation');

    expect(mockCalculateOffset).toBeCalledTimes(1);
    expect(mockCalculateOffset).toBeCalledWith(
      'testIsCrosstab',
      'testColumnInformation'.length,
      'testFilteredColumnInformation'.length,
      'testAttributeColumnNumber',
    );

    expect(mockSetupFormatting).toBeCalledTimes(1);
    expect(mockSetupFormatting).toBeCalledWith(
      'testFilteredColumnInformation',
      'testIsCrosstab',
      'testCalculateOffset',
      { columns: 'testColumns' },
    );

    expect(mockExcelContextSync).toBeCalledTimes(1);

    expect(mockCompleteFormatData).toBeCalledTimes(1);
    expect(mockCompleteFormatData).toBeCalledWith('testObjectWorkingId');
  });

  it.each`
  expectedAttributeColumnNumber | columnInformation
  
  ${0} | ${[]}
  ${1} | ${[{}]}
  ${2} | ${[{}, {}]}
  ${1} | ${[{ isAttribute: false }]}
  ${2} | ${[{ isAttribute: false }, {}]}
  ${2} | ${[{}, { isAttribute: false }]}
  ${2} | ${[{ isAttribute: false }, { isAttribute: false }]}
  
  ${1} | ${[{ isAttribute: true }]}
  ${2} | ${[{ isAttribute: true }, {}]}
  ${2} | ${[{}, { isAttribute: true }]}
  ${2} | ${[{ isAttribute: true }, { isAttribute: true }]}
  
  ${1} | ${[{ isAttribute: true, forms: undefined }]}
  ${2} | ${[{ isAttribute: true, forms: undefined }, {}]}
  ${2} | ${[{}, { isAttribute: true, forms: undefined }]}
  ${2} | ${[{ isAttribute: true, forms: undefined }, { isAttribute: true, forms: undefined }]}
  
  ${1} | ${[{ isAttribute: false, forms: [] }]}
  ${2} | ${[{ isAttribute: false, forms: [] }, {}]}
  ${2} | ${[{}, { isAttribute: false, forms: [] }]}
  ${2} | ${[{ isAttribute: false, forms: [] }, { isAttribute: false, forms: [] }]}
  
  ${1} | ${[{ isAttribute: false, forms: [1] }]}
  ${2} | ${[{ isAttribute: false, forms: [1] }, {}]}
  ${2} | ${[{}, { isAttribute: false, forms: [1] }]}
  ${2} | ${[{ isAttribute: false, forms: [1] }, { isAttribute: false, forms: [1] }]}
  
  ${1} | ${[{ isAttribute: false, forms: [1, 2] }]}
  ${2} | ${[{ isAttribute: false, forms: [1, 2] }, {}]}
  ${2} | ${[{}, { isAttribute: false, forms: [1, 2] }]}
  ${2} | ${[{ isAttribute: false, forms: [1, 2] }, { isAttribute: false, forms: [1, 2] }]}
  
  ${2} | ${[{ isAttribute: false, forms: [1] }, { isAttribute: false, forms: [1, 2] }]}
  ${2} | ${[{ isAttribute: false, forms: [1, 2] }, { isAttribute: false, forms: [1] }]}
  
  ${1} | ${[{ isAttribute: true, forms: [] }]}
  ${2} | ${[{ isAttribute: true, forms: [] }, {}]}
  ${2} | ${[{}, { isAttribute: true, forms: [] }]}
  ${2} | ${[{ isAttribute: true, forms: [] }, { isAttribute: true, forms: [] }]}
  
  ${1} | ${[{ isAttribute: true, forms: [1] }]}
  ${2} | ${[{ isAttribute: true, forms: [1] }, {}]}
  ${2} | ${[{}, { isAttribute: true, forms: [1] }]}
  ${2} | ${[{ isAttribute: true, forms: [1] }, { isAttribute: true, forms: [1] }]}
  
  ${2} | ${[{ isAttribute: true, forms: [1, 2] }]}
  ${3} | ${[{ isAttribute: true, forms: [1, 2] }, {}]}
  ${3} | ${[{}, { isAttribute: true, forms: [1, 2] }]}
  ${4} | ${[{ isAttribute: true, forms: [1, 2] }, { isAttribute: true, forms: [1, 2] }]}
  
  ${3} | ${[{ isAttribute: true, forms: [1] }, { isAttribute: true, forms: [1, 2] }]}
  ${3} | ${[{ isAttribute: true, forms: [1, 2] }, { isAttribute: true, forms: [1] }]}

  ${2} | ${[{ isAttribute: false, forms: [] }, { isAttribute: false, forms: [] }]}
  ${2} | ${[{ isAttribute: true, forms: [] }, { isAttribute: false, forms: [] }]}
  ${2} | ${[{ isAttribute: false, forms: [] }, { isAttribute: true, forms: [] }]}
  ${2} | ${[{ isAttribute: true, forms: [] }, { isAttribute: true, forms: [] }]}

  ${2} | ${[{ isAttribute: false, forms: [1] }, { isAttribute: false, forms: [1] }]}
  ${2} | ${[{ isAttribute: true, forms: [1] }, { isAttribute: false, forms: [1] }]}
  ${2} | ${[{ isAttribute: false, forms: [1] }, { isAttribute: true, forms: [1] }]}
  ${2} | ${[{ isAttribute: true, forms: [1] }, { isAttribute: true, forms: [1] }]}

  ${2} | ${[{ isAttribute: false, forms: [1, 2] }, { isAttribute: false, forms: [1, 2] }]}
  ${3} | ${[{ isAttribute: true, forms: [1, 2] }, { isAttribute: false, forms: [1, 2] }]}
  ${3} | ${[{ isAttribute: false, forms: [1, 2] }, { isAttribute: true, forms: [1, 2] }]}
  ${4} | ${[{ isAttribute: true, forms: [1, 2] }, { isAttribute: true, forms: [1, 2] }]}

  ${2} | ${[{ isAttribute: true, forms: [1] }, { isAttribute: false, forms: [1, 2] }]}
  ${3} | ${[{ isAttribute: false, forms: [1] }, { isAttribute: true, forms: [1, 2] }]}
  ${3} | ${[{ isAttribute: true, forms: [1, 2] }, { isAttribute: false, forms: [1] }]}
  ${2} | ${[{ isAttribute: false, forms: [1, 2] }, { isAttribute: true, forms: [1] }]}

  `('calculateAttributeColumnNumber should work as expected',
  ({ expectedAttributeColumnNumber, columnInformation }) => {
    // when
    const attributeColumnNumber = stepApplyFormatting.calculateAttributeColumnNumber(columnInformation);

    // then
    expect(attributeColumnNumber).toEqual(expectedAttributeColumnNumber);
  });

  it.each`
  expectedOffset | isCrosstab | columnInformationLength | filteredColumnInformationLength | attributeColumnNumber
  
  ${9}           | ${true}    | ${10}                   | ${1}                            | ${undefined}
  ${9}           | ${false}   | ${1}                    | ${undefined}                    | ${10}

  `('calculateOffset should work as expected',
  ({
    expectedOffset,
    isCrosstab,
    columnInformationLength,
    filteredColumnInformationLength,
    attributeColumnNumber
  }) => {
    // when
    const offset = stepApplyFormatting.calculateOffset(
      isCrosstab,
      columnInformationLength,
      filteredColumnInformationLength,
      attributeColumnNumber
    );

    // then
    expect(offset).toEqual(expectedOffset);
  });

  it('setupFormatting should do nothing when filteredColumnInformation is empty', () => {
    // given
    const mockGetColumnRangeForFormatting = jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting')
      .mockImplementation();

    // when
    stepApplyFormatting.setupFormatting([], undefined, undefined, undefined);

    // then
    expect(mockGetColumnRangeForFormatting).not.toBeCalled();
  });

  it('setupFormatting should work as expected for 1 filteredColumnInformation attribute element', () => {
    // given
    const mockColumnRange = {};
    const mockGetColumnRangeForFormatting = jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting')
      .mockReturnValue(mockColumnRange);

    const mockGetFormat = jest.spyOn(stepApplyFormatting, 'getFormat').mockImplementation();

    const filteredColumnInformation = [{ isAttribute: true, index: 'only' }];

    // when
    stepApplyFormatting.setupFormatting(filteredColumnInformation, 'testIsCrosstab', 'testOffset', 'testOfficeTable');

    // then
    expect(mockGetColumnRangeForFormatting).toBeCalledTimes(1);
    expect(mockGetColumnRangeForFormatting).toBeCalledWith(
      'only',
      'testIsCrosstab',
      'testOffset',
      'testOfficeTable',
    );

    expect(mockGetFormat).not.toBeCalled();

    expect(mockColumnRange.numberFormat).toEqual('');
  });

  it('setupFormatting should work as expected for 1 filteredColumnInformation not attribute element', () => {
    // given
    const mockColumnRange = {};
    const mockGetColumnRangeForFormatting = jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting')
      .mockReturnValue(mockColumnRange);

    const mockGetFormat = jest.spyOn(stepApplyFormatting, 'getFormat').mockReturnValue('testGetFormat');

    const filteredColumnInformation = [{ isAttribute: false, index: 'only' }];

    // when
    stepApplyFormatting.setupFormatting(filteredColumnInformation, 'testIsCrosstab', 'testOffset', 'testOfficeTable');

    // then
    expect(mockGetColumnRangeForFormatting).toBeCalledTimes(1);
    expect(mockGetColumnRangeForFormatting).toBeCalledWith(
      'only',
      'testIsCrosstab',
      'testOffset',
      'testOfficeTable',
    );

    expect(mockGetFormat).toBeCalledTimes(1);

    expect(mockColumnRange.numberFormat).toEqual('testGetFormat');
  });

  it.each`
  expectedNumberFormat  | getFormatCallNo | filteredColumnInformation
  
  ${['', '']}           | ${0} | ${[{ isAttribute: true, index: 'first' }, { isAttribute: true, index: 'last' }]}
  ${['fmt 1', '']}      | ${1} | ${[{ isAttribute: true, index: 'first' }, { isAttribute: false, index: 'last' }]}
  ${['', 'fmt 0']}      | ${1} | ${[{ isAttribute: false, index: 'first' }, { isAttribute: true, index: 'last' }]}
  ${['fmt 1', 'fmt 0']} | ${2} | ${[{ isAttribute: false, index: 'first' }, { isAttribute: false, index: 'last' }]}
  
  `('setupFormatting should work as expected for 2 filteredColumnInformation elements',
  ({ expectedNumberFormat, getFormatCallNo, filteredColumnInformation }) => {
    // given
    const mockColumnRange = [{}, {}];
    let callNo = 0;
    const mockGetColumnRangeForFormatting = jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting')
      .mockImplementation(() => mockColumnRange[callNo++]);

    const mockGetFormat = jest.spyOn(stepApplyFormatting, 'getFormat').mockImplementation(() => {
      if (filteredColumnInformation[filteredColumnInformation.length - callNo].isAttribute === false) {
        return `fmt ${filteredColumnInformation.length - callNo}`;
      }
      return '';
    });

    // when
    stepApplyFormatting.setupFormatting(filteredColumnInformation, 'testIsCrosstab', 'testOffset', 'testOfficeTable');

    // then
    expect(mockGetColumnRangeForFormatting).toBeCalledTimes(2);
    expect(mockGetColumnRangeForFormatting).toHaveBeenNthCalledWith(
      1,
      'last',
      'testIsCrosstab',
      'testOffset',
      'testOfficeTable',
    );
    expect(mockGetColumnRangeForFormatting).toHaveBeenNthCalledWith(
      2,
      'first',
      'testIsCrosstab',
      'testOffset',
      'testOfficeTable',
    );

    expect(mockGetFormat).toBeCalledTimes(getFormatCallNo);

    expect(mockColumnRange[0].numberFormat).toEqual(expectedNumberFormat[0]);
    expect(mockColumnRange[1].numberFormat).toEqual(expectedNumberFormat[1]);
  });

  it.each`
  expectedObjectIndex | index | isCrosstab | offset

  ${9}                | ${10} | ${true}    | ${1}     
  ${11}               | ${10} | ${false}   | ${1}     
  
  `('getColumnRangeForFormatting should work as expected',
  ({
    expectedObjectIndex,
    index,
    isCrosstab,
    offset
  }) => {
    // given
    const mockGetItemAt = jest.fn().mockReturnValue({ getDataBodyRange: jest.fn() });

    /* eslint-disable object-curly-newline */
    const mockOfficeTable = {
      columns: {
        getItemAt: mockGetItemAt
      }
    };
    /* eslint-enable object-curly-newline */

    // when
    stepApplyFormatting.getColumnRangeForFormatting(index, isCrosstab, offset, mockOfficeTable);

    // then
    expect(mockGetItemAt).toBeCalledTimes(1);
    expect(mockGetItemAt).toBeCalledWith(expectedObjectIndex);
  });

  it.each`
  expectedFilteredColumnInformation | columnInformation
  
  ${[]} | ${[]}
  ${[]} | ${[{}]}
  
  ${[{ sth: 'sth' }]}                 | ${[{ sth: 'sth' }]}
  ${[{ sth: 'sth' }, { sth: 'sth' }]} | ${[{ sth: 'sth' }, { sth: 'sth' }]}

  ${[{ isAttribute: false }]} | ${[{ isAttribute: false }]}
  ${[]}                       | ${[{ isAttribute: true }]}
  
  ${[{ isAttribute: false, sth: 'sth' }]} | ${[{ isAttribute: false, sth: 'sth' }]}
  ${[]}                                   | ${[{ isAttribute: true, sth: 'sth' }]}
  
  ${[{ isAttribute: false }, { isAttribute: false }]} | ${[{ isAttribute: false }, { isAttribute: false }]}
  ${[]}                                               | ${[{ isAttribute: true }, { isAttribute: true }]}
  
  ${[{ isAttribute: false, sth: 'sth' }, { isAttribute: false, sth: 'sth' }]} | ${[{ isAttribute: false, sth: 'sth' }, { isAttribute: false, sth: 'sth' }]}
  ${[]}                                                                       | ${[{ isAttribute: true, sth: 'sth' }, { isAttribute: true, sth: 'sth' }]}
  
  ${[{ isAttribute: false }]} | ${[{ isAttribute: true }, { isAttribute: false }]}
  ${[{ isAttribute: false }]} | ${[{ isAttribute: false }, { isAttribute: true }]}
  
  ${[{ isAttribute: false, sth: 'sth' }]} | ${[{ isAttribute: true, sth: 'sth' }, { isAttribute: false, sth: 'sth' }]}
  ${[{ isAttribute: false, sth: 'sth' }]} | ${[{ isAttribute: false, sth: 'sth' }, { isAttribute: true, sth: 'sth' }]}
  
  `('filterColumnInformation should work as expected for crosstab',
  ({ expectedFilteredColumnInformation, columnInformation }) => {
    // when
    const result = stepApplyFormatting.filterColumnInformation(columnInformation, true);

    // then
    expect(result).toEqual(expectedFilteredColumnInformation);
  });

  it.each`
  expectedFilteredColumnInformation | columnInformation
  
  ${[]} | ${[]}
  ${[]} | ${[{}]}
  
  ${[{ sth: 'sth' }]}                 | ${[{ sth: 'sth' }]}
  ${[{ sth: 'sth' }, { sth: 'sth' }]} | ${[{ sth: 'sth' }, { sth: 'sth' }]}

  ${[{ isAttribute: false }]} | ${[{ isAttribute: false }]}
  ${[{ isAttribute: true }]}  | ${[{ isAttribute: true }]}
  
  ${[{ isAttribute: false, sth: 'sth' }]} | ${[{ isAttribute: false, sth: 'sth' }]}
  ${[{ isAttribute: true, sth: 'sth' }]}  | ${[{ isAttribute: true, sth: 'sth' }]}
  
  ${[{ isAttribute: false }, { isAttribute: false }]} | ${[{ isAttribute: false }, { isAttribute: false }]}
  ${[{ isAttribute: true }, { isAttribute: true }]}   | ${[{ isAttribute: true }, { isAttribute: true }]}
  
  ${[{ isAttribute: false, sth: 'sth' }, { isAttribute: false, sth: 'sth' }]} | ${[{ isAttribute: false, sth: 'sth' }, { isAttribute: false, sth: 'sth' }]}
  ${[{ isAttribute: true, sth: 'sth' }, { isAttribute: true, sth: 'sth' }]}   | ${[{ isAttribute: true, sth: 'sth' }, { isAttribute: true, sth: 'sth' }]}
  
  ${[{ isAttribute: true }, { isAttribute: false }]} | ${[{ isAttribute: true }, { isAttribute: false }]}
  ${[{ isAttribute: false }, { isAttribute: true }]} | ${[{ isAttribute: false }, { isAttribute: true }]}
  
  ${[{ isAttribute: true, sth: 'sth' }, { isAttribute: false, sth: 'sth' }]} | ${[{ isAttribute: true, sth: 'sth' }, { isAttribute: false, sth: 'sth' }]}
  ${[{ isAttribute: false, sth: 'sth' }, { isAttribute: true, sth: 'sth' }]} | ${[{ isAttribute: false, sth: 'sth' }, { isAttribute: true, sth: 'sth' }]}
  
  `('filterColumnInformation should work as expected for non crosstab',
  ({ expectedFilteredColumnInformation, columnInformation }) => {
    // when
    const result = stepApplyFormatting.filterColumnInformation(columnInformation, false);

    // then
    expect(result).toEqual(expectedFilteredColumnInformation);
  });
});

it.each`
  expectedParsedFormat | category | formatString
  
  ${'General'} | ${9} | ${undefined}
  ${'General'} | ${9} | ${''}
  ${'General'} | ${9} | ${'formatString'}
  
  ${'General'} | ${undefined} | ${'# ?/?'}
  ${'General'} | ${undefined} | ${'# ??/?'}
  ${'General'} | ${undefined} | ${'# ???/?'}
  ${'General'} | ${undefined} | ${'# ?/?a'}
  ${'General'} | ${undefined} | ${'# ??/?a'}
  ${'General'} | ${undefined} | ${'# ???/?a'}
  
  ${'[-'} | ${undefined} | ${'[-'}
  ${'[$-'} | ${undefined} | ${'[$-'}
  ${'[$-'} | ${undefined} | ${'[$$-'}
  ${'[$\\$-'} | ${undefined} | ${'[$$$-'}
  ${'[$$-'} | ${undefined} | ${'[$$$$-'}
  ${'[$$\\$-'} | ${undefined} | ${'[$$$$$-'}
  ${'[$$$-'} | ${undefined} | ${'[$$$$$$-'}

  ${'a[$-'} | ${undefined} | ${'a[$-'}
  ${'a[$-'} | ${undefined} | ${'a[$$-'}
  ${'a[$\\$-'} | ${undefined} | ${'a[$$$-'}
  ${'a[$$-'} | ${undefined} | ${'a[$$$$-'}
  ${'a[$$\\$-'} | ${undefined} | ${'a[$$$$$-'}
  ${'a[$$$-'} | ${undefined} | ${'a[$$$$$$-'}

  ${'a[$-b'} | ${undefined} | ${'a[$-b'}
  ${'a[$-b'} | ${undefined} | ${'a[$$-b'}
  ${'a[$\\$-b'} | ${undefined} | ${'a[$$$-b'}
  ${'a[$$-b'} | ${undefined} | ${'a[$$$$-b'}
  ${'a[$$\\$-b'} | ${undefined} | ${'a[$$$$$-b'}
  ${'a[$$$-b'} | ${undefined} | ${'a[$$$$$$-b'}

  ${'a[$-[$-b'} | ${undefined} | ${'a[$-[$-b'}
  ${'a[$-[$-b'} | ${undefined} | ${'a[$$-[$$-b'}
  ${'a[$\\$-[$\\$-b'} | ${undefined} | ${'a[$$$-[$$$-b'}
  ${'a[$$-[$$-b'} | ${undefined} | ${'a[$$$$-[$$$$-b'}
  ${'a[$$\\$-[$$\\$-b'} | ${undefined} | ${'a[$$$$$-[$$$$$-b'}
  ${'a[$$$-[$$$-b'} | ${undefined} | ${'a[$$$$$$-[$$$$$$-b'}

  ${'a[$-c[$-b'} | ${undefined} | ${'a[$-c[$-b'}
  ${'a[$-c[$-b'} | ${undefined} | ${'a[$$-c[$$-b'}
  ${'a[$\\$-c[$\\$-b'} | ${undefined} | ${'a[$$$-c[$$$-b'}
  ${'a[$$-c[$$-b'} | ${undefined} | ${'a[$$$$-c[$$$$-b'}
  ${'a[$$\\$-c[$$\\$-b'} | ${undefined} | ${'a[$$$$$-c[$$$$$-b'}
  ${'a[$$$-c[$$$-b'} | ${undefined} | ${'a[$$$$$$-c[$$$$$$-b'}

  ${'\\$'} | ${undefined} | ${'$'}
  ${'\\$'} | ${undefined} | ${'$"'}
  ${'\\$'} | ${undefined} | ${'$""'}
  ${'\\$'} | ${undefined} | ${'"$'}
  ${'\\$'} | ${undefined} | ${'"$"'}
  ${'\\$'} | ${undefined} | ${'"$""'}
  ${'\\$'} | ${undefined} | ${'""$'}
  ${'\\$'} | ${undefined} | ${'""$"'}
  
  ${''} | ${undefined} | ${''}
  ${'"'} | ${undefined} | ${'"'}
  ${'a'} | ${undefined} | ${'a'}
  
  `('getFormat should work as expected', ({ expectedParsedFormat, category, formatString }) => {
  // when
  const result = stepApplyFormatting.getFormat({ formatString, category });

  // then
  expect(result).toEqual(expectedParsedFormat);
});
