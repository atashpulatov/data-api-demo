import formattingHelper from './formatting-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepApplyFormatting from './step-apply-formatting';

describe('StepApplyFormatting', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const excelContextSyncMock = jest.fn();
  const excelContext = { sync: excelContextSyncMock } as unknown as Excel.RequestContext;

  it('applyFormatting should log exceptions', async () => {
    // given

    jest.spyOn(console, 'log');
    jest.spyOn(console, 'error');

    const getColumnRangeForFormattingMock = jest
      .spyOn(formattingHelper, 'getColumnRangeForFormatting')
      .mockImplementation(() => {
        throw new Error('errorTest');
      });

    jest.spyOn(operationStepDispatcher, 'completeFormatData').mockImplementation();

    const operationData = {
      objectWorkingId: 2137,
      instanceDefinition: { mstrTable: { columnInformation: [{}] } },
      excelContext,
    } as unknown as OperationData;

    // when
    await stepApplyFormatting.applyFormatting({} as ObjectData, operationData);

    // then
    expect(getColumnRangeForFormattingMock).toHaveBeenCalledTimes(1);
    expect(getColumnRangeForFormattingMock).toThrow(Error);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(new Error('errorTest'));

    expect(operationStepDispatcher.completeFormatData).toHaveBeenCalledTimes(1);
    expect(operationStepDispatcher.completeFormatData).toHaveBeenCalledWith(2137);
  });

  it('applyFormatting should work as expected', async () => {
    // given
    const operationData = {
      objectWorkingId: 2137,
      excelContext: { sync: excelContextSyncMock },
      instanceDefinition: {
        columns: 'instanceColumnsTest',
        mstrTable: {
          columnInformation: 'columnInformationTest',
          isCrosstab: 'isCrosstabTest',
          metricsInRows: 'metricsInRowsTest',
        },
      },
      officeTable: { columns: 'columnsTest' },
    } as unknown as OperationData;

    jest.spyOn(stepApplyFormatting, 'setupFormatting').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeFormatData').mockImplementation();

    // when
    await stepApplyFormatting.applyFormatting({} as ObjectData, operationData);

    // then
    expect(stepApplyFormatting.setupFormatting).toHaveBeenCalledTimes(1);
    expect(stepApplyFormatting.setupFormatting).toHaveBeenCalledWith(
      'columnInformationTest',
      'isCrosstabTest',
      0,
      { columns: 'columnsTest' },
      { sync: excelContextSyncMock },
      {} as ObjectData,
      'instanceColumnsTest',
      'metricsInRowsTest'
    );

    expect(excelContextSyncMock).toHaveBeenCalledTimes(3);

    expect(operationStepDispatcher.completeFormatData).toHaveBeenCalledTimes(1);
    expect(operationStepDispatcher.completeFormatData).toHaveBeenCalledWith(2137);
  });

  it('setupFormatting should do nothing when filteredColumnInformation is empty', () => {
    // given
    jest.spyOn(formattingHelper, 'getColumnRangeForFormatting').mockImplementation();

    // when
    stepApplyFormatting.setupFormatting(
      [],
      undefined,
      undefined,
      undefined,
      excelContext,
      {} as ObjectData
    );

    // then
    expect(formattingHelper.getColumnRangeForFormatting).not.toBeCalled();
  });

  it('setupFormatting should work as expected for 1 filteredColumnInformation attribute element', () => {
    // given
    const columnRangeMock = {} as Excel.Range;
    const ExcelTableMock = {} as Excel.Table;
    jest.spyOn(formattingHelper, 'getColumnRangeForFormatting').mockReturnValue(columnRangeMock);

    jest.spyOn(stepApplyFormatting, 'getFormat').mockImplementation();

    const filteredColumnInformation = [{ isAttribute: true }];

    // when
    stepApplyFormatting.setupFormatting(
      filteredColumnInformation,
      true,
      1,
      ExcelTableMock,
      excelContext,
      {} as ObjectData,
      2,
      true
    );

    // then
    expect(formattingHelper.getColumnRangeForFormatting).toHaveBeenCalledTimes(1);
    expect(formattingHelper.getColumnRangeForFormatting).toHaveBeenCalledWith(
      0,
      true,
      1,
      ExcelTableMock,
      2,
      true
    );

    expect(stepApplyFormatting.getFormat).not.toBeCalled();

    expect(columnRangeMock.numberFormat).toEqual('');
  });

  it('setupFormatting should work as expected for 1 filteredColumnInformation not attribute element', () => {
    // given
    const columnRangeMock = {} as Excel.Range;
    const ExcelTableMock = {} as Excel.Table;

    jest.spyOn(formattingHelper, 'getColumnRangeForFormatting').mockReturnValue(columnRangeMock);

    jest.spyOn(stepApplyFormatting, 'getFormat').mockReturnValue('getFormatTest');

    const filteredColumnInformation = [{ isAttribute: false }];

    // when
    stepApplyFormatting.setupFormatting(
      filteredColumnInformation,
      true,
      1,
      ExcelTableMock,
      excelContext,
      {} as ObjectData,
      2,
      true
    );

    // then
    expect(formattingHelper.getColumnRangeForFormatting).toHaveBeenCalledTimes(1);
    expect(formattingHelper.getColumnRangeForFormatting).toHaveBeenCalledWith(
      0,
      true,
      1,
      {},
      2,
      true
    );

    expect(stepApplyFormatting.getFormat).toHaveBeenCalledTimes(1);

    expect(columnRangeMock.numberFormat).toEqual('getFormatTest');
  });

  it.each`
    expectedNumberFormat  | getFormatCallNo | filteredColumnInformation
    ${['', '']}           | ${0}            | ${[{ isAttribute: true }, { isAttribute: true }]}
    ${['fmt 0', '']}      | ${1}            | ${[{ isAttribute: false }, { isAttribute: true }]}
    ${['', 'fmt 1']}      | ${1}            | ${[{ isAttribute: true }, { isAttribute: false }]}
    ${['fmt 0', 'fmt 1']} | ${2}            | ${[{ isAttribute: false }, { isAttribute: false }]}
  `(
    'setupFormatting should work as expected for 2 filteredColumnInformation elements',
    async ({ expectedNumberFormat, getFormatCallNo, filteredColumnInformation }) => {
      // given
      const columnRangeMock = [{}, {}] as Excel.Range[];
      const ExcelTableMock = {} as Excel.Table;

      let callNo = 0;
      jest
        .spyOn(formattingHelper, 'getColumnRangeForFormatting')
        .mockImplementation(() => columnRangeMock[callNo++]);

      jest.spyOn(stepApplyFormatting, 'getFormat').mockImplementation(() => {
        if (filteredColumnInformation[callNo - 1].isAttribute === false) {
          return `fmt ${callNo - 1}`;
        }
        return '';
      });

      // when
      await stepApplyFormatting.setupFormatting(
        filteredColumnInformation,
        true,
        1,
        ExcelTableMock,
        excelContext,
        {} as ObjectData,
        2,
        true
      );

      // then
      expect(formattingHelper.getColumnRangeForFormatting).toHaveBeenCalledTimes(2);
      expect(formattingHelper.getColumnRangeForFormatting).toHaveBeenNthCalledWith(
        1,
        0,
        true,
        1,
        ExcelTableMock,
        2,
        true
      );
      expect(formattingHelper.getColumnRangeForFormatting).toHaveBeenNthCalledWith(
        2,
        1,
        true,
        1,
        ExcelTableMock,
        2,
        true
      );

      expect(stepApplyFormatting.getFormat).toHaveBeenCalledTimes(getFormatCallNo);

      expect(columnRangeMock[0].numberFormat).toEqual(expectedNumberFormat[0]);
      expect(columnRangeMock[1].numberFormat).toEqual(expectedNumberFormat[1]);
    }
  );

  it.each`
    expectedObjectIndex | index | isCrosstab | offset
    ${9}                | ${10} | ${true}    | ${1}
    ${11}               | ${10} | ${false}   | ${1}
  `(
    'getColumnRangeForFormatting should work as expected',
    ({ expectedObjectIndex, index, isCrosstab, offset }) => {
      // given
      const getItemAtMock = jest.fn().mockReturnValue({ getDataBodyRange: jest.fn() });

      const officeTableMock = {
        columns: {
          getItemAt: getItemAtMock,
        },
      } as unknown as Excel.Table;

      // when
      formattingHelper.getColumnRangeForFormatting(index, isCrosstab, offset, officeTableMock);

      // then
      expect(getItemAtMock).toHaveBeenCalledTimes(1);
      expect(getItemAtMock).toHaveBeenCalledWith(expectedObjectIndex);
    }
  );

  it.each`
    expectedParsedFormat   | category     | formatString
    ${'General'}           | ${9}         | ${undefined}
    ${'General'}           | ${9}         | ${''}
    ${'General'}           | ${9}         | ${'formatString'}
    ${'General'}           | ${undefined} | ${''}
    ${'General'}           | ${undefined} | ${'# ?/?'}
    ${'General'}           | ${undefined} | ${'# ??/?'}
    ${'General'}           | ${undefined} | ${'# ???/?'}
    ${'General'}           | ${undefined} | ${'# ?/?a'}
    ${'General'}           | ${undefined} | ${'# ??/?a'}
    ${'General'}           | ${undefined} | ${'# ???/?a'}
    ${'[-'}                | ${undefined} | ${'[-'}
    ${'[$-'}               | ${undefined} | ${'[$-'}
    ${'[$-'}               | ${undefined} | ${'[$$-'}
    ${'[$\\$-'}            | ${undefined} | ${'[$$$-'}
    ${'[$$-'}              | ${undefined} | ${'[$$$$-'}
    ${'[$$\\$-'}           | ${undefined} | ${'[$$$$$-'}
    ${'[$$$-'}             | ${undefined} | ${'[$$$$$$-'}
    ${'a[$-'}              | ${undefined} | ${'a[$-'}
    ${'a[$-'}              | ${undefined} | ${'a[$$-'}
    ${'a[$\\$-'}           | ${undefined} | ${'a[$$$-'}
    ${'a[$$-'}             | ${undefined} | ${'a[$$$$-'}
    ${'a[$$\\$-'}          | ${undefined} | ${'a[$$$$$-'}
    ${'a[$$$-'}            | ${undefined} | ${'a[$$$$$$-'}
    ${'a[$-b'}             | ${undefined} | ${'a[$-b'}
    ${'a[$-b'}             | ${undefined} | ${'a[$$-b'}
    ${'a[$\\$-b'}          | ${undefined} | ${'a[$$$-b'}
    ${'a[$$-b'}            | ${undefined} | ${'a[$$$$-b'}
    ${'a[$$\\$-b'}         | ${undefined} | ${'a[$$$$$-b'}
    ${'a[$$$-b'}           | ${undefined} | ${'a[$$$$$$-b'}
    ${'a[$-[$-b'}          | ${undefined} | ${'a[$-[$-b'}
    ${'a[$-[$-b'}          | ${undefined} | ${'a[$$-[$$-b'}
    ${'a[$\\$-[$\\$-b'}    | ${undefined} | ${'a[$$$-[$$$-b'}
    ${'a[$$-[$$-b'}        | ${undefined} | ${'a[$$$$-[$$$$-b'}
    ${'a[$$\\$-[$$\\$-b'}  | ${undefined} | ${'a[$$$$$-[$$$$$-b'}
    ${'a[$$$-[$$$-b'}      | ${undefined} | ${'a[$$$$$$-[$$$$$$-b'}
    ${'a[$-c[$-b'}         | ${undefined} | ${'a[$-c[$-b'}
    ${'a[$-c[$-b'}         | ${undefined} | ${'a[$$-c[$$-b'}
    ${'a[$\\$-c[$\\$-b'}   | ${undefined} | ${'a[$$$-c[$$$-b'}
    ${'a[$$-c[$$-b'}       | ${undefined} | ${'a[$$$$-c[$$$$-b'}
    ${'a[$$\\$-c[$$\\$-b'} | ${undefined} | ${'a[$$$$$-c[$$$$$-b'}
    ${'a[$$$-c[$$$-b'}     | ${undefined} | ${'a[$$$$$$-c[$$$$$$-b'}
    ${'\\$'}               | ${undefined} | ${'$'}
    ${'\\$'}               | ${undefined} | ${'$"'}
    ${'\\$'}               | ${undefined} | ${'$""'}
    ${'\\$'}               | ${undefined} | ${'"$'}
    ${'\\$'}               | ${undefined} | ${'"$"'}
    ${'\\$'}               | ${undefined} | ${'"$""'}
    ${'\\$'}               | ${undefined} | ${'""$'}
    ${'\\$'}               | ${undefined} | ${'""$"'}
    ${'"'}                 | ${undefined} | ${'"'}
    ${'a'}                 | ${undefined} | ${'a'}
  `('getFormat should work as expected', ({ expectedParsedFormat, category, formatString }) => {
    // when
    const result = stepApplyFormatting.getFormat({ formatString, category });

    // then
    expect(result).toEqual(expectedParsedFormat);
  });
});
