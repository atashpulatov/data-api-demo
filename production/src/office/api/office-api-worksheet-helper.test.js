import { officeApiWorksheetHelper } from './office-api-worksheet-helper';

import { reduxStore } from '../../store';

import { ObjectAndWorksheetNamingOption } from '../../right-side-panel/settings-side-panel/settings-side-panel-types';

describe('OfficeApiWorksheetHelper', () => {
  beforeAll(() => {
    officeApiWorksheetHelper.init(reduxStore);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
    objectName                                    | expectedResult
    ${'name'}                                     | ${'name'}
    ${'Test'}                                     | ${'Test (3)'}
    ${'some random name'}                         | ${'some random name'}
    ${'some name'}                                | ${'some name (4)'}
    ${'*test?'}                                   | ${'_test_'}
    ${''}                                         | ${'_'}
    ${'test name having over 31 characters'}      | ${'test name having over 31 cha...'}
    ${'some test name having over 31 characters'} | ${'some test name having ov ...(2)'}
  `('prepareWorksheetName should return proper name', async ({ objectName, expectedResult }) => {
    // given
    const mockSync = jest.fn();
    const context = {
      workbook: {
        worksheets: {
          load: jest.fn().mockImplementation(),
          items: [
            { name: 'Test' },
            { name: 'Test (2)' },
            { name: 'some name' },
            { name: 'some name (2)' },
            { name: 'some name (3)' },
            { name: 'some test name having over 3...' },
          ],
        },
      },
      sync: mockSync,
    };

    // when
    const worksheetName = await officeApiWorksheetHelper.prepareWorksheetName(context, objectName);

    // then
    expect(worksheetName).toEqual(expectedResult);
  });

  it('renameExistingWorksheet should execute prepareWorksheetName', async () => {
    // given
    const prepareWorksheetNameMock = jest
      .spyOn(officeApiWorksheetHelper, 'prepareWorksheetName')
      .mockImplementation();

    const mockSync = jest.fn();
    const mockGetUsedRangeOrNullObject = jest
      .fn()
      .mockImplementation(() => ({ isNullObject: true }));
    const context = {
      workbook: {
        worksheets: {
          getActiveWorksheet: jest.fn().mockImplementation(() => ({
            getUsedRangeOrNullObject: mockGetUsedRangeOrNullObject,
          })),
        },
      },
      sync: mockSync,
    };

    // when
    await officeApiWorksheetHelper.renameExistingWorksheet(context, 'object name');

    // then
    expect(prepareWorksheetNameMock).toBeCalledTimes(1);
    expect(prepareWorksheetNameMock).toBeCalledWith(context, 'object name', undefined);
  });

  it.each`
    objectName | pageByData                          | objectAndWorksheetNamingSetting                             | expectedResult
    ${'Test'}  | ${{ elements: [{ value: 'pop' }] }} | ${ObjectAndWorksheetNamingOption.REPORT_NAME}               | ${'Test'}
    ${'Test'}  | ${{ elements: [{ value: 'pop' }] }} | ${ObjectAndWorksheetNamingOption.PAGE_NAME}                 | ${'pop'}
    ${'Test'}  | ${{ elements: [{ value: 'pop' }] }} | ${ObjectAndWorksheetNamingOption.REPORT_NAME_AND_PAGE_NAME} | ${'Test - pop'}
    ${'Test'}  | ${{ elements: [{ value: 'pop' }] }} | ${ObjectAndWorksheetNamingOption.PAGE_NAME_AND_REPORT_NAME} | ${'pop - Test'}
  `(
    'prepareNameBasedOnPageBySettings should return proper name',
    async ({ objectName, pageByData, objectAndWorksheetNamingSetting, expectedResult }) => {
      // given

      jest.spyOn(reduxStore, 'getState').mockReturnValue({
        settingsReducer: { objectAndWorksheetNamingSetting },
      });
      // when
      const worksheetName = await officeApiWorksheetHelper.prepareNameBasedOnPageBySettings(
        objectName,
        pageByData
      );

      // then
      expect(worksheetName).toEqual(expectedResult);
    }
  );
});
