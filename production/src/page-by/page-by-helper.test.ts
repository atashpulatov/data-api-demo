import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { pageByHelper } from './page-by-helper';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';

import { pageByDataResponse } from '../../__mocks__/page-by-data-response';

describe('Page-by helper', () => {
  const expectedResponse = [
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
    expect(validPageByData).toEqual(expectedResponse);
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
    // when
    const validPageByElements = pageByHelper.parseValidPageByElements(pageByDataResponse);

    // then
    expect(validPageByElements).toEqual(expectedResponse);
  });
});
