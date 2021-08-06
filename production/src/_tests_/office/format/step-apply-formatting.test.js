import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepApplyFormatting from '../../../office/format/step-apply-formatting';
import officeFormatHyperlinks from '../../../office/format/office-format-hyperlinks';
import { officeApiHelper } from '../../../office/api/office-api-helper';

describe('StepApplyFormatting', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const excelContextSyncMock = jest.fn();

  it('applyFormatting should log exceptions', async () => {
    // given

    jest.spyOn(console, 'log');
    jest.spyOn(console, 'error');

    jest.spyOn(stepApplyFormatting, 'filterColumnInformation').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationStepDispatcher, 'completeFormatData').mockImplementation();

    const operationData = { objectWorkingId: 'objectWorkingIdTest', instanceDefinition: { mstrTable: {} }, };

    // when
    await stepApplyFormatting.applyFormatting({}, operationData);

    // then
    expect(stepApplyFormatting.filterColumnInformation).toBeCalledTimes(1);
    expect(stepApplyFormatting.filterColumnInformation).toThrowError(Error);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith('Cannot apply formatting, skipping');
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(operationStepDispatcher.completeFormatData).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeFormatData).toBeCalledWith('objectWorkingIdTest');
  });

  it('applyFormatting should work as expected', async () => {
    // given
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

    jest.spyOn(stepApplyFormatting, 'filterColumnInformation').mockReturnValue('filteredColumnInformationTest');

    jest.spyOn(stepApplyFormatting, 'calculateMetricColumnOffset').mockReturnValue('calculateOffsetTest');

    jest.spyOn(stepApplyFormatting, 'setupFormatting').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeFormatData').mockImplementation();

    // when
    await stepApplyFormatting.applyFormatting({}, operationData);

    // then
    expect(stepApplyFormatting.filterColumnInformation).toBeCalledTimes(1);
    expect(stepApplyFormatting.filterColumnInformation).toBeCalledWith('columnInformationTest');


    expect(stepApplyFormatting.calculateMetricColumnOffset).toBeCalledTimes(1);
    expect(stepApplyFormatting.calculateMetricColumnOffset).toBeCalledWith(
      'filteredColumnInformationTest',
      'isCrosstabTest',
    );

    expect(stepApplyFormatting.setupFormatting).toBeCalledTimes(1);
    expect(stepApplyFormatting.setupFormatting).toBeCalledWith(
      'filteredColumnInformationTest',
      'isCrosstabTest',
      'calculateOffsetTest',
      { columns: 'columnsTest' },
      { sync: excelContextSyncMock }
    );

    expect(excelContextSyncMock).toBeCalledTimes(2);

    expect(operationStepDispatcher.completeFormatData).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeFormatData).toBeCalledWith('objectWorkingIdTest');
  });

  it.each`
  expectedMetricColumnOffset | columnInformation | isCrosstab
  
  ${0} | ${[]}        | ${false}
  ${0} | ${[{}]}      | ${false}
  ${0} | ${[{}, {}]}  | ${false}
  ${0} | ${[]}        | ${true}
  ${0} | ${[{}]}      | ${true}
  ${0} | ${[{}, {}]}  | ${true}

  ${0} | ${[{ isAttribute: false }]}                          | ${true}
  ${0} | ${[{ isAttribute: false }, {}]}                      | ${true}
  ${0} | ${[{}, { isAttribute: false }]}                      | ${true}
  ${0} | ${[{ isAttribute: false }, { isAttribute: false }]}  | ${true}
  
  ${0} | ${[{ isAttribute: true }]}       | ${true}
  ${0} | ${[{}, { isAttribute: true }]}   | ${true}
  ${1} | ${[{ isAttribute: true }, {}]}   | ${true}
  ${1} | ${[{ isAttribute: true }, { isAttribute: false }]} | ${true}
  
  ${1} | ${[{ isAttribute: true, forms: [1] }, { isAttribute: false, forms: [1, 2] }]} | ${true}
  ${1} | ${[{ isAttribute: true, forms: [1, 2] }, { isAttribute: false, forms: [1] }]} | ${true}

  ${0} | ${[{ isAttribute: false, forms: [] }, { isAttribute: false, forms: [] }]}  | ${true}
  ${1} | ${[{ isAttribute: true, forms: [] }, { isAttribute: false, forms: [] }]}   | ${true}
  ${0} | ${[{ isAttribute: false, forms: [] }, { isAttribute: true, forms: [] }]}   | ${true}
  ${0} | ${[{ isAttribute: true, forms: [] }, { isAttribute: true, forms: [] }]}    | ${true}

  ${0} | ${[{ isAttribute: false, forms: [1] }, { isAttribute: false, forms: [1] }]}  | ${true}
  ${1} | ${[{ isAttribute: true, forms: [1] }, { isAttribute: false, forms: [1] }]}   | ${true}
  ${2} | ${[{ isAttribute: true, forms: [1] }, { isAttribute: true, forms: [1] }, { isAttribute: false, forms: [1] }]} | ${true}
  ${3} | ${[{ isAttribute: true, forms: [1] }, { isAttribute: true, forms: [1] }, { isAttribute: true, forms: [1] }, { isAttribute: false, forms: [1] }]} | ${true}
  ${0} | ${[{ isAttribute: true, forms: [1] }, { isAttribute: true, forms: [1] }, { isAttribute: true, forms: [1] }, { isAttribute: false, forms: [1] }]} | ${false}

  ${0} | ${[{ isAttribute: false, forms: [1, 2] }, { isAttribute: false, forms: [1, 2] }, { isAttribute: false, forms: [1, 2] }]} | ${true}
  ${1} | ${[{ isAttribute: true, forms: [1, 2] }, { isAttribute: false, forms: [1, 2] }, { isAttribute: false, forms: [1, 2] }]}  | ${true}
  ${2} | ${[{ isAttribute: true, forms: [1, 2] }, { isAttribute: true, forms: [1, 2] }, { isAttribute: false, forms: [1, 2] }]}   | ${true}
  ${3} | ${[{ isAttribute: true, forms: [1, 2] }, { isAttribute: true, forms: [1, 2] }, { isAttribute: true, forms: [1, 2] }, { isAttribute: false, forms: [1, 2] }]} | ${true}
  ${0} | ${[{ isAttribute: true, forms: [1, 2] }, { isAttribute: true, forms: [1, 2] }, { isAttribute: true, forms: [1, 2] }, { isAttribute: false, forms: [1, 2] }]} | ${false}

  `('calculateMetricColumnOffset should work as expected',
  ({ expectedMetricColumnOffset, columnInformation, isCrosstab }) => {
    // when
    const attributeColumnNumber = stepApplyFormatting.calculateMetricColumnOffset(columnInformation, isCrosstab);

    // then
    expect(attributeColumnNumber).toEqual(expectedMetricColumnOffset);
  });

  it('setupFormatting should do nothing when filteredColumnInformation is empty', () => {
    // given
    jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting').mockImplementation();

    // when
    stepApplyFormatting.setupFormatting([], undefined, undefined, undefined);

    // then
    expect(stepApplyFormatting.getColumnRangeForFormatting).not.toBeCalled();
  });

  it('setupFormatting should work as expected for 1 filteredColumnInformation attribute element', () => {
    // given
    const columnRangeMock = {};
    jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting').mockReturnValue(columnRangeMock);

    jest.spyOn(stepApplyFormatting, 'getFormat').mockImplementation();

    const filteredColumnInformation = [{ isAttribute: true }];

    // when
    stepApplyFormatting.setupFormatting(filteredColumnInformation, 'isCrosstabTest', 'offsetTest', 'officeTableTest');

    // then
    expect(stepApplyFormatting.getColumnRangeForFormatting).toBeCalledTimes(1);
    expect(stepApplyFormatting.getColumnRangeForFormatting).toBeCalledWith(
      0,
      'isCrosstabTest',
      'offsetTest',
      'officeTableTest',
    );

    expect(stepApplyFormatting.getFormat).not.toBeCalled();

    expect(columnRangeMock.numberFormat).toBeUndefined();
  });

  it('setupFormatting should work as expected for 1 filteredColumnInformation not attribute element', () => {
    // given
    const columnRangeMock = {};
    jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting').mockReturnValue(columnRangeMock);

    jest.spyOn(stepApplyFormatting, 'getFormat').mockReturnValue('getFormatTest');

    const filteredColumnInformation = [{ isAttribute: false }];

    // when
    stepApplyFormatting.setupFormatting(filteredColumnInformation, 'isCrosstabTest', 'offsetTest', 'officeTableTest');

    // then
    expect(stepApplyFormatting.getColumnRangeForFormatting).toBeCalledTimes(1);
    expect(stepApplyFormatting.getColumnRangeForFormatting).toBeCalledWith(
      0,
      'isCrosstabTest',
      'offsetTest',
      'officeTableTest',
    );

    expect(stepApplyFormatting.getFormat).toBeCalledTimes(1);

    expect(columnRangeMock.numberFormat).toEqual('getFormatTest');
  });

  it('setupFormatting should call format hyperlinks', () => {
    // given
    const columnRangeMock = {};
    jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting').mockReturnValue(columnRangeMock);

    jest.spyOn(stepApplyFormatting, 'getFormat').mockReturnValue('getFormatTest');
    jest.spyOn(officeFormatHyperlinks, 'formatColumnAsHyperlinks').mockImplementation(jest.fn);


    const filteredColumnInformation = [{ isAttribute: true }];

    // when
    stepApplyFormatting.setupFormatting(filteredColumnInformation, 'isCrosstabTest', 'offsetTest', 'officeTableTest');

    // then
    expect(officeFormatHyperlinks.formatColumnAsHyperlinks).toBeCalledTimes(1);
  });

  it.each`
  expectedNumberFormat  | getFormatCallNo | filteredColumnInformation
  
  ${[undefined, undefined]} | ${0} | ${[{ isAttribute: true }, { isAttribute: true }]}
  ${['fmt 0', undefined]}   | ${1} | ${[{ isAttribute: false }, { isAttribute: true }]}
  ${[undefined, 'fmt 1']}   | ${1} | ${[{ isAttribute: true }, { isAttribute: false }]}
  ${['fmt 0', 'fmt 1']}     | ${2} | ${[{ isAttribute: false }, { isAttribute: false }]}
  
  `('setupFormatting should work as expected for 2 filteredColumnInformation elements',
  async ({ expectedNumberFormat, getFormatCallNo, filteredColumnInformation }) => {
    // given
    const columnRangeMock = [{}, {}];
    let callNo = 0;
    jest.spyOn(stepApplyFormatting, 'getColumnRangeForFormatting').mockImplementation(() => columnRangeMock[callNo++]);

    jest.spyOn(stepApplyFormatting, 'getFormat').mockImplementation(() => {
      if (filteredColumnInformation[callNo - 1].isAttribute === false) {
        return `fmt ${callNo - 1}`;
      }
      return '';
    });

    // when
    await stepApplyFormatting.setupFormatting(filteredColumnInformation, 'isCrosstabTest', 'offsetTest', 'officeTableTest');

    // then
    expect(stepApplyFormatting.getColumnRangeForFormatting).toBeCalledTimes(2);
    expect(stepApplyFormatting.getColumnRangeForFormatting).toHaveBeenNthCalledWith(
      1,
      0,
      'isCrosstabTest',
      'offsetTest',
      'officeTableTest',
    );
    expect(stepApplyFormatting.getColumnRangeForFormatting).toHaveBeenNthCalledWith(
      2,
      1,
      'isCrosstabTest',
      'offsetTest',
      'officeTableTest',
    );

    expect(stepApplyFormatting.getFormat).toBeCalledTimes(getFormatCallNo);

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
  
  ${'General'} | ${undefined} | ${''}
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
  
  ${'"'} | ${undefined} | ${'"'}
  ${'a'} | ${undefined} | ${'a'}
  
  `('getFormat should work as expected', ({ expectedParsedFormat, category, formatString }) => {
  // when
  const result = stepApplyFormatting.getFormat({ formatString, category });

  // then
  expect(result).toEqual(expectedParsedFormat);
});
