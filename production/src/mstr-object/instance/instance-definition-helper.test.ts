import { pageByHelper } from '../../page-by/page-by-helper';
import instanceDefinitionHelper from './instance-definition-helper';

import { PageByDisplayType } from '../../page-by/page-by-types';
import { ObjectData } from '../../types/object-types';

describe('Instance definition helper', () => {
  it('should  call getPageByDataForDefaultPage for display type DEFAULT_PAGE', () => {
    // given
    const objectData = {
      pageByData: {
        pageByDisplayType: PageByDisplayType.DEFAULT_PAGE,
        pageByLinkId: 'pageByLinkId',
      },
    } as unknown as ObjectData;
    const instanceDefinition = {};

    jest.spyOn(pageByHelper, 'getPageByDataForDefaultPage').mockImplementation();

    // when
    instanceDefinitionHelper.getPageByDataForDisplayType(objectData, instanceDefinition);

    // then
    expect(pageByHelper.getPageByDataForDefaultPage).toHaveBeenCalledTimes(1);
  });
});
