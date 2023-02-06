import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';

describe('OfficeApiWorksheetHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
    objectName                                      | expectedResult
    ${'name'}                                       | ${'name'}
    ${'Test'}                                       | ${'Test (3)'}
    ${'some random name'}                           | ${'some random name'}
    ${'some name'}                                  | ${'some name (4)'}
    ${'*test?'}                                     | ${'_test_'}
    ${''}                                           | ${'_'}
    ${'test name having over 31 characters'}        | ${'test name having over 31 cha...'}
    ${'some test name having over 31 characters'}   | ${'some test name having ov ...(2)'}
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
          ]
        }
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
    const prepareWorksheetNameMock = jest.spyOn(officeApiWorksheetHelper, 'prepareWorksheetName').mockImplementation();

    const mockSync = jest.fn();
    const mockGetUsedRangeOrNullObject = jest.fn().mockImplementation(() => ({ isNullObject: true }));
    const context = {
      workbook: {
        worksheets: {
          getActiveWorksheet: jest.fn().mockImplementation(() => ({
            getUsedRangeOrNullObject: mockGetUsedRangeOrNullObject
          })),
        }
      },
      sync: mockSync,
    };

    // when
    await officeApiWorksheetHelper.renameExistingWorksheet(context, 'object name');

    // then
    expect(prepareWorksheetNameMock).toBeCalledTimes(1);
    expect(prepareWorksheetNameMock).toBeCalledWith(context, 'object name');
  });
});
