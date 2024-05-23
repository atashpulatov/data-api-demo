import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { pageByHelper } from './page-by-helper';

import { reduxStore, RootState } from '../store';

import { InstanceDefinition } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectAndWorksheetNamingOption } from '../right-side-panel/settings-side-panel/settings-side-panel-types';
import { ObjectData } from '../types/object-types';
import { PageByData, PageByDisplayType } from './page-by-types';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { ObjectImportType } from '../mstr-object/constants';

import { pageByDataResponse } from '../../__mocks__/page-by-data-response';

describe('Page-by helper', () => {
  const expectedElements = [
    [
      {
        name: 'Region',
        value: 'East Coast',
        valueId:
          'WE31F9F64492596FFC88E52873A8C45D4:1DAD64C6445BCD938F11FFAEC3A4A980;8D679D4B11D3E4981000E787EC6DE8A4',
      },
    ],
    [
      {
        name: 'Region',
        value: 'West Coast',
        valueId:
          'W051E87C14073A1C7E382B29F3E6D1A18:1DAD64C6445BCD938F11FFAEC3A4A980;8D679D4B11D3E4981000E787EC6DE8A4',
      },
    ],
    [
      {
        name: 'Region',
        value: 'Central and South',
        valueId:
          'W703FC02A43136C5D290286BCA3EA5D27:1DAD64C6445BCD938F11FFAEC3A4A980;8D679D4B11D3E4981000E787EC6DE8A4',
      },
    ],
    [
      {
        name: 'Region',
        value: 'Web',
        valueId:
          'W047F5F6E4F0CBBF6FB476CA6604C6AC9:1DAD64C6445BCD938F11FFAEC3A4A980;8D679D4B11D3E4981000E787EC6DE8A4',
      },
    ],
    [
      {
        name: 'Region',
        value: 'Total',
        valueId:
          'W1CE03D47405E8526E5FBE28263497882:1DAD64C6445BCD938F11FFAEC3A4A980;8D679D4B11D3E4981000E787EC6DE8A4',
      },
    ],
  ];

  const instanceDefinition = {
    instanceId: 'instanceId',
  };

  it("should return valid combinations of Report's Page-by elements", async () => {
    // given
    const objectData = {
      mstrObjectType: mstrObjectEnum.mstrObjectType.report,
      objectId: 'objectId',
      projectId: 'projectId',
    };

    jest.spyOn(mstrObjectRestService, 'getPageByElements').mockResolvedValue(pageByDataResponse);

    // when
    const validPageByData = await pageByHelper.getValidPageByData(objectData, instanceDefinition);

    // then
    expect(validPageByData).toEqual(expectedElements);
  });

  it('should return undefined for Dashboard', async () => {
    // given
    const objectData = {
      mstrObjectType: mstrObjectEnum.mstrObjectType.dossier,
      objectId: 'objectId',
      projectId: 'projectId',
    };

    // when
    const validPageByData = await pageByHelper.getValidPageByData(objectData, instanceDefinition);

    // then
    expect(validPageByData).toEqual(undefined);
  });

  it('should correctly parse valid Page-by elements', () => {
    // given
    const { pageBy, validPageByElements } = pageByDataResponse;

    // when
    const validPageByData = pageByHelper.parseValidPageByElements(pageBy, validPageByElements);

    // then
    expect(validPageByData).toEqual(expectedElements);
  });

  it('should correctly get page by data for default page', () => {
    // given
    const mockedPageByDisplayType = PageByDisplayType.DEFAULT_PAGE;
    const mockedPageByLinkId = 'pageByLinkId';
    const mockedInstanceDefinition = {
      definition: {
        grid: {
          pageBy: pageByDataResponse.pageBy,
        },
      },
      data: {
        currentPageBy: pageByDataResponse.validPageByElements.items[0],
      },
    } as unknown as InstanceDefinition;

    const mockedExpectedPageByData = {
      pageByLinkId: mockedPageByLinkId,
      pageByDisplayType: mockedPageByDisplayType,
      elements: expectedElements[0],
    };

    // when
    const pageByData = pageByHelper.getPageByDataForDefaultPage(
      mockedInstanceDefinition,
      mockedPageByLinkId,
      mockedPageByDisplayType
    );

    // then
    expect(pageByData).toEqual(mockedExpectedPageByData);
  });

  it('should  call getPageByDataForDefaultPage for display type DEFAULT_PAGE', () => {
    // given
    const pageByData = {
      pageByDisplayType: PageByDisplayType.DEFAULT_PAGE,
      pageByLinkId: 'pageByLinkId',
    } as unknown as PageByData;
    const mockedInstanceDefinition = {};

    jest.spyOn(pageByHelper, 'getPageByDataForDefaultPage').mockImplementation();

    // when
    pageByHelper.getPageByDataForDisplayType(pageByData, mockedInstanceDefinition);

    // then
    expect(pageByHelper.getPageByDataForDefaultPage).toHaveBeenCalledTimes(1);
  });

  it('should return all page by objects based on passed source object', () => {
    // given
    const mockedPageByData = {
      pageByDisplayType: PageByDisplayType.ALL_PAGES,
      pageByLinkId: 'pageByLinkId',
    };
    const mockedObjectData = [
      {
        objectWorkingId: 1,
        pageByData: mockedPageByData,
      },
      {
        objectWorkingId: 2,
        pageByData: mockedPageByData,
      },
      {
        objectWorkingId: 3,
        pageByData: mockedPageByData,
      },
    ] as unknown as ObjectData[];

    jest
      .spyOn(reduxStore, 'getState')
      // @ts-expect-error
      .mockReturnValueOnce({ objectReducer: { objects: mockedObjectData } });
    jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockReturnValueOnce(mockedObjectData[0]);

    // when
    const { sourceObject } = pageByHelper.getAllPageByObjects(mockedObjectData[0].objectWorkingId);

    // then
    expect(sourceObject.objectWorkingId).toEqual(mockedObjectData[0].objectWorkingId);
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

      jest.spyOn(reduxStore, 'getState').mockImplementation(
        () =>
          ({
            settingsReducer: { objectAndWorksheetNamingSetting },
          }) as RootState
      );
      // when
      const worksheetName = await pageByHelper.prepareNameBasedOnPageBySettings(
        objectName,
        pageByData
      );

      // then
      expect(worksheetName).toEqual(expectedResult);
    }
  );

  it('getPageByConfigurations should work properly', () => {
    // given
    officeReducerHelper.reduxStore.getState = jest.fn().mockImplementation(() => ({
      objectReducer: {
        objects: [
          {
            objectWorkingId: 1,
            pageByData: {
              pageByLinkId: '2',
              elements: [{ name: 'name1', value: 'value1', valueId: '1' }],
            },
          },
          {
            objectWorkingId: 2,
            pageByData: {
              pageByLinkId: '2',
              elements: [{ name: 'name2', value: 'value2', valueId: '2' }],
            },
          },
        ],
      },
    }));

    // when
    const result = pageByHelper.getPageByConfigurations(1, [
      [{ name: 'name1', value: 'value1', valueId: '1' }],
      [{ name: 'name2', value: 'value2', valueId: '2' }],
    ]);

    // then
    expect(result).toEqual([
      [{ id: '1', name: 'name1', value: 'value1' }],
      [{ id: '2', name: 'name2', value: 'value2' }],
    ]);
  });

  it.each`
    pageBy                       | pageByDisplaySetting              | importType                          | expectedResult
    ${[]}                        | ${PageByDisplayType.SELECT_PAGES} | ${ObjectImportType.TABLE}           | ${0}
    ${pageByDataResponse.pageBy} | ${PageByDisplayType.DEFAULT_PAGE} | ${ObjectImportType.IMAGE}           | ${false}
    ${pageByDataResponse.pageBy} | ${PageByDisplayType.ALL_PAGES}    | ${ObjectImportType.FORMATTED_TABLE} | ${false}
    ${pageByDataResponse.pageBy} | ${PageByDisplayType.SELECT_PAGES} | ${ObjectImportType.PIVOT_TABLE}     | ${false}
    ${pageByDataResponse.pageBy} | ${PageByDisplayType.SELECT_PAGES} | ${ObjectImportType.TABLE}           | ${true}
    ${pageByDataResponse.pageBy} | ${PageByDisplayType.SELECT_PAGES} | ${ObjectImportType.IMAGE}           | ${true}
    ${pageByDataResponse.pageBy} | ${PageByDisplayType.SELECT_PAGES} | ${ObjectImportType.FORMATTED_TABLE} | ${true}
  `(
    'should return $expectedResult when pageBy is $pageBy, pageByDisplaySetting is $pageByDisplaySetting, and importType is $importType',
    ({ pageBy, pageByDisplaySetting, importType, expectedResult }) => {
      // given
      jest.spyOn(reduxStore, 'getState').mockImplementation(
        () =>
          ({
            settingsReducer: { pageByDisplaySetting },
          }) as RootState
      );

      // when
      const result = pageByHelper.getShouldOpenPageByModal(pageBy, importType);

      // then
      expect(result).toBe(expectedResult);
    }
  );
});
