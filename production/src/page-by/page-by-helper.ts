import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';

import { PageByDataElement, PageByResponse } from './page-by-types';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';

class PageByHelper {
  /**
   * Gets valid combinations of Report's Page-by elements
   *
   * @param objectData Contains information about the object
   * @param instanceDefinition Defninition of the object's instance
   * @returns Two-dimensional array of valid Page-by elements combinations
   */
  getValidPageByData = async (
    objectData: any,
    instanceDefinition: any
  ): Promise<PageByDataElement[][]> => {
    if (objectData.mstrObjectType !== mstrObjectEnum.mstrObjectType.report) {
      return;
    }

    const pageByElements = await mstrObjectRestService.getPageByElements(
      objectData.objectId,
      objectData.projectId,
      instanceDefinition.instanceId
    );

    return this.parseValidPageByElements(pageByElements);
  };

  /**
   * Creates new pageByDataElement for each valid combination of Page-by elements
   *
   * @param pageByElements Response from the pageBy/elements REST API endpoint containing information about the object's Page-by elements
   * @returns Two-dimensional array of valid Page-by elements combinations
   */
  parseValidPageByElements = (pageByElements: PageByResponse): PageByDataElement[][] => {
    const { pageBy, validPageByElements } = pageByElements;

    const validPageByData: PageByDataElement[][] = [];

    validPageByElements?.items?.forEach(combination => {
      const pageByDataElement: PageByDataElement[] = combination.map((value, index) => ({
        name: pageBy[index].name,
        value: pageBy[index].elements[value].formValues[0],
        valueId: pageBy[index].elements[value].id,
      }));

      validPageByData.push(pageByDataElement);
    });

    return validPageByData;
  };
}

export const pageByHelper = new PageByHelper();
