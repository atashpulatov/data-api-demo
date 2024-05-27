import officeTableHelperRange from '../office/table/office-table-helper-range';
import { checkRangeForObjectInfo, getObjectDetailsForWorksheet } from './object-info-helper';

import { reduxStore } from '../store';

import { initialWorksheetObjectInfoSettings } from '../redux-reducer/settings-reducer/settings-constants';

describe('getObjectDetailsForWorksheet', () => {
  it('should return the object detail values and values to format', () => {
    // given
    const object = {
      mstrObjectType: { name: 'report' },
      name: 'Test Report',
      details: {
        owner: { name: 'John Doe' },
        description: 'Test description',
        filters: {
          metricLimitsText: '-',
          viewFilterText: 'Test view filter',
          reportFilterText: 'Test report filter',
          reportLimitsText: 'Test report limits',
        },
        importedBy: 'Jane Smith',
        modifiedDate: '2024-01-01',
        createdDate: '2024-01-01',
      },
      objectId: '123456789',
      pageByData: {
        elements: [{ value: 'Page 1' }, { value: 'Page 2' }],
      },
    } as any;

    jest.spyOn(reduxStore, 'getState').mockImplementation(
      () =>
        ({
          settingsReducer: {
            worksheetObjectInfoSettings: initialWorksheetObjectInfoSettings.map(setting => ({
              ...setting,
              toggleChecked: true,
            })),
          },
        }) as any
    );

    const expectedObjectDetailValues = [
      ['Test Report'],
      [''],
      ['Owner'],
      ['John Doe'],
      [''],
      ['Description'],
      ['Test description'],
      [''],
      ['Report Filter'],
      ['Test report filter'],
      [''],
      ['Report Limits'],
      ['Test report limits'],
      [''],
      ['View Filter'],
      ['Test view filter'],
      [''],
      ['Imported By'],
      ['Jane Smith'],
      [''],
      ['Date Modified'],
      ['1/1/2024 12:00 AM'],
      [''],
      ['Date Created'],
      ['1/1/2024 12:00 AM'],
      [''],
      ['ID'],
      ['123456789'],
      [''],
      ['Paged-By'],
      ['Page 1, Page 2'],
      [''],
    ];

    const expectedIndexesToFormat = [0, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29];

    // when
    const { objectDetailValues, indexesToFormat } = getObjectDetailsForWorksheet(object);

    // then
    expect(objectDetailValues).toEqual(expectedObjectDetailValues);
    expect(indexesToFormat).toEqual(expectedIndexesToFormat);
  });
});

describe('checkRangeForObjectInfo', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
    previousObjectDetailsSize | newObjectDetailsSize | isCrosstab | checkRangeValidityCallNo | expectedRange
    ${2}                      | ${5}                 | ${true}    | ${1}                     | ${'A17:D19'}
    ${2}                      | ${5}                 | ${false}   | ${1}                     | ${'A16:C18'}
    ${5}                      | ${2}                 | ${true}    | ${1}                     | ${'A7:D9'}
    ${5}                      | ${2}                 | ${false}   | ${1}                     | ${'A7:C9'}
  `(
    'should check range validity for rows=$rows, columns=$columns, previousObjectDetailsSize=$previousObjectDetailsSize, newObjectDetailsSize=$newObjectDetailsSize, isCrosstab=$isCrosstab',
    async ({
      previousObjectDetailsSize,
      newObjectDetailsSize,
      isCrosstab,
      checkRangeValidityCallNo,
      expectedRange,
    }) => {
      // given
      const mockWorksheet = { getRange: jest.fn() };
      const mockExcelContext = { trackedObjects: { add: jest.fn() } };
      const mockCrosstabHeaderDimensions = { rowsX: 1, columnsY: 2 };

      jest.spyOn(officeTableHelperRange, 'checkRangeValidity').mockImplementation();

      // when
      await checkRangeForObjectInfo({
        worksheet: mockWorksheet as any,
        excelContext: mockExcelContext as any,
        currentTableStartCell: 'A10',
        previousObjectDetailsSize,
        newObjectDetailsSize,
        isCrosstab,
        rows: 5,
        columns: 3,
        isNewStartCellSelected: false,
        crosstabHeaderDimensions: mockCrosstabHeaderDimensions,
      });

      // then
      expect(mockWorksheet.getRange).toHaveBeenCalledWith(expectedRange);
      expect(officeTableHelperRange.checkRangeValidity).toHaveBeenCalledTimes(
        checkRangeValidityCallNo
      );
    }
  );
});
