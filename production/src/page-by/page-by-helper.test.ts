import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { pageByHelper } from './page-by-helper';

import { reduxStore, RootState } from '../store';

import { InstanceDefinition } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectAndWorksheetNamingOption } from '../right-side-panel/settings-side-panel/settings-side-panel-types';
import { ObjectData } from '../types/object-types';
import { PageByData, PageByDisplayType } from './page-by-types';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { OperationTypes } from '../operation/operation-type-names';

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
    const siblings = pageByHelper.getAllPageByObjects(mockedObjectData[0].objectWorkingId);

    // then
    expect(siblings).toHaveLength(3);
  });

  it('should return all page by siblings based on passed source object', () => {
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
    const siblings = pageByHelper.getAllPageBySiblings(mockedObjectData[0].objectWorkingId);

    // then
    expect(siblings).toHaveLength(2);
  });

  it('should call dispatch actions for siblings', () => {
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

    /*     const initialState = {
      operationsReducer: {
        operations: [
          {
            objectWorkingId: 1,
            operationType: 'REFRESH',
          },
          {
            objectWorkingId: 2,
            operationType: 'REFRESH',
          },
        ],
      } as unknown as OperationState,
    }; */

    /* // @ts-expect-error
    createStore(rootReducer, initialState); */

    jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockReturnValueOnce(mockedObjectData[0]);
    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    jest.spyOn(reduxStore, 'getState').mockReturnValue({
      objectReducer: { objects: mockedObjectData },
      operationReducer: {
        operations: [
          // @ts-expect-error
          {
            objectWorkingId: 1,
            operationType: OperationTypes.REFRESH_OPERATION,
          },
          // @ts-expect-error
          {
            objectWorkingId: 2,
            operationType: OperationTypes.REFRESH_OPERATION,
          },
        ],
      },
    });

    // when
    pageByHelper.clearOperationsForPageBySiblings(mockedObjectData[0].objectWorkingId);

    // then
    expect(mockedDispatch).toHaveBeenCalled();
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
});
