import { getObjectDetailsForWorksheet } from './object-info-helper';

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
      ['ID'],
      ['123456789'],
      [''],
      ['Paged-By'],
      ['Page 1, Page 2'],
      [''],
    ];

    const expectedIndexesToFormat = [0, 2, 5, 8, 11, 14, 17, 20, 23];

    // when
    const { objectDetailValues, indexesToFormat } = getObjectDetailsForWorksheet(object);

    // then
    expect(objectDetailValues).toEqual(expectedObjectDetailValues);
    expect(indexesToFormat).toEqual(expectedIndexesToFormat);
  });
});
