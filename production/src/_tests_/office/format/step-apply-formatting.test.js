import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepApplyFormatting from '../../../office/format/step-apply-formatting';

describe('StepApplyFormatting', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('applyFormatting should log exceptions', async () => {
    // given
    jest.spyOn(console, 'log');
    jest.spyOn(console, 'error');

    const filterColumnInformationMock = jest.spyOn(stepApplyFormatting, 'filterColumnInformation')
      .mockImplementation(() => {
        throw new Error('errorTest');
      });

    const completeFormatDataMock = jest.spyOn(
      operationStepDispatcher, 'completeFormatData'
    ).mockImplementation();

    const operationData = { objectWorkingId: 'objectWorkingIdTest', instanceDefinition: { mstrTable: {} }, };

    // when
    await stepApplyFormatting.applyFormatting({}, operationData);

    // then
    expect(filterColumnInformationMock).toBeCalledTimes(1);
    expect(filterColumnInformationMock).toThrowError(Error);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith('Cannot apply formatting, skipping');
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(completeFormatDataMock).toBeCalledTimes(1);
    expect(completeFormatDataMock).toBeCalledWith('objectWorkingIdTest');
  });

  it('applyFormatting should work as expected', async () => {
    // given
    const excelContextSyncMock = jest.fn();
    const operationData = {
      objectWorkingId: 'objectWorkingIdTest',
      excelContext: { sync: excelContextSyncMock },
      instanceDefinition: {
        mstrTable: {
          columnInformation: 'columnInformationTest',
          isCrosstab: 'isCrosstabTest',
        }
      },
      officeTable: { columns: 'columnsTest' },
    };

    const filterColumnInformationMock = jest.spyOn(stepApplyFormatting, 'filterColumnInformation')
      .mockReturnValue('filteredColumnInformationTest');

    const calculateAttributeColumnNumberMock = jest.spyOn(stepApplyFormatting, 'calculateAttributeColumnNumber')
      .mockReturnValue('attributeColumnNumberTest');

    const calculateOffsetMock = jest.spyOn(stepApplyFormatting, 'calculateOffset')
      .mockReturnValue('calculateOffsetTest');

    const setupFormattingMock = jest.spyOn(stepApplyFormatting, 'setupFormatting').mockImplementation();

    const completeFormatDataMock = jest.spyOn(
      operationStepDispatcher, 'completeFormatData'
    ).mockImplementation();

    // when
    await stepApplyFormatting.applyFormatting({}, operationData);

    // then
    expect(filterColumnInformationMock).toBeCalledTimes(1);
    expect(filterColumnInformationMock).toBeCalledWith('columnInformationTest', 'isCrosstabTest');

    expect(calculateAttributeColumnNumberMock).toBeCalledTimes(1);
    expect(calculateAttributeColumnNumberMock).toBeCalledWith('columnInformationTest');

    expect(calculateOffsetMock).toBeCalledTimes(1);
    expect(calculateOffsetMock).toBeCalledWith(
      'isCrosstabTest',
      'columnInformationTest'.length,
      'filteredColumnInformationTest'.length,
      'attributeColumnNumberTest',
    );

    expect(setupFormattingMock).toBeCalledTimes(1);
    expect(setupFormattingMock).toBeCalledWith(
      'filteredColumnInformationTest',
      'isCrosstabTest',
      'calculateOffsetTest',
      { columns: 'columnsTest' },
    );

    expect(excelContextSyncMock).toBeCalledTimes(1);

    expect(completeFormatDataMock).toBeCalledTimes(1);
    expect(completeFormatDataMock).toBeCalledWith('objectWorkingIdTest');
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
    const getColumnRangeForFormattingMock = jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting')
      .mockImplementation();

    // when
    stepApplyFormatting.setupFormatting([], undefined, undefined, undefined);

    // then
    expect(getColumnRangeForFormattingMock).not.toBeCalled();
  });

  it('setupFormatting should work as expected for 1 filteredColumnInformation attribute element', () => {
    // given
    const columnRangeMock = {};
    const getColumnRangeForFormattingMock = jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting')
      .mockReturnValue(columnRangeMock);

    const getFormatMock = jest.spyOn(stepApplyFormatting, 'getFormat').mockImplementation();

    const filteredColumnInformation = [{ isAttribute: true, index: 'only' }];

    // when
    stepApplyFormatting.setupFormatting(filteredColumnInformation, 'isCrosstabTest', 'offsetTest', 'officeTableTest');

    // then
    expect(getColumnRangeForFormattingMock).toBeCalledTimes(1);
    expect(getColumnRangeForFormattingMock).toBeCalledWith(
      'only',
      'isCrosstabTest',
      'offsetTest',
      'officeTableTest',
    );

    expect(getFormatMock).not.toBeCalled();

    expect(columnRangeMock.numberFormat).toEqual('');
  });

  it('setupFormatting should work as expected for 1 filteredColumnInformation not attribute element', () => {
    // given
    const columnRangeMock = {};
    const getColumnRangeForFormattingMock = jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting')
      .mockReturnValue(columnRangeMock);

    const getFormatMock = jest.spyOn(stepApplyFormatting, 'getFormat').mockReturnValue('getFormatTest');

    const filteredColumnInformation = [{ isAttribute: false, index: 'only' }];

    // when
    stepApplyFormatting.setupFormatting(filteredColumnInformation, 'isCrosstabTest', 'offsetTest', 'officeTableTest');

    // then
    expect(getColumnRangeForFormattingMock).toBeCalledTimes(1);
    expect(getColumnRangeForFormattingMock).toBeCalledWith(
      'only',
      'isCrosstabTest',
      'offsetTest',
      'officeTableTest',
    );

    expect(getFormatMock).toBeCalledTimes(1);

    expect(columnRangeMock.numberFormat).toEqual('getFormatTest');
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
    const columnRangeMock = [{}, {}];
    let callNo = 0;
    const getColumnRangeForFormattingMock = jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting')
      .mockImplementation(() => columnRangeMock[callNo++]);

    const getFormatMock = jest.spyOn(stepApplyFormatting, 'getFormat').mockImplementation(() => {
      if (filteredColumnInformation[filteredColumnInformation.length - callNo].isAttribute === false) {
        return `fmt ${filteredColumnInformation.length - callNo}`;
      }
      return '';
    });

    // when
    stepApplyFormatting.setupFormatting(filteredColumnInformation, 'isCrosstabTest', 'offsetTest', 'officeTableTest');

    // then
    expect(getColumnRangeForFormattingMock).toBeCalledTimes(2);
    expect(getColumnRangeForFormattingMock).toHaveBeenNthCalledWith(
      1,
      'last',
      'isCrosstabTest',
      'offsetTest',
      'officeTableTest',
    );
    expect(getColumnRangeForFormattingMock).toHaveBeenNthCalledWith(
      2,
      'first',
      'isCrosstabTest',
      'offsetTest',
      'officeTableTest',
    );

    expect(getFormatMock).toBeCalledTimes(getFormatCallNo);

    expect(columnRangeMock[0].numberFormat).toEqual(expectedNumberFormat[0]);
    expect(columnRangeMock[1].numberFormat).toEqual(expectedNumberFormat[1]);
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
    const getItemAtMock = jest.fn().mockReturnValue({ getDataBodyRange: jest.fn() });

    const officeTableMock = {
      columns: {
        getItemAt: getItemAtMock
      }
    };

    // when
    stepApplyFormatting.getColumnRangeForFormatting(index, isCrosstab, offset, officeTableMock);

    // then
    expect(getItemAtMock).toBeCalledTimes(1);
    expect(getItemAtMock).toBeCalledWith(expectedObjectIndex);
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
