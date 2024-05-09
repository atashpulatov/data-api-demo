import { PageByConfiguration } from '@mstr/connector-components';

import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import officeReducerHelper from '../office/store/office-reducer-helper';

import { reduxStore } from '../store';

import { InstanceDefinition } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectAndWorksheetNamingOption } from '../right-side-panel/settings-side-panel/settings-side-panel-types';
import { ObjectData } from '../types/object-types';
import {
  PageBy,
  PageByData,
  PageByDataElement,
  PageByDisplayType,
  ValidPageByElements,
} from './page-by-types';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import {
  refreshRequested,
  removeRequested,
} from '../redux-reducer/operation-reducer/operation-actions';

class PageByHelper {
  /**
   * Gets all Page-by elements of the source object
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   * @returns Array of objects containing information about the all Page-by objects
   */
  getAllPageByObjects = (
    objectWorkingId: number
  ): { sourceObject: ObjectData; pageBySiblings: ObjectData[] } => {
    const sourceObject =
      officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
    const { objects } = reduxStore.getState().objectReducer;

    const pageByObjects = objects.filter(
      object => object?.pageByData?.pageByLinkId === sourceObject.pageByData?.pageByLinkId
    );
    pageByObjects.sort((a, b) => a.objectWorkingId - b.objectWorkingId);

    const pageBySiblings = pageByObjects.filter(
      sibling => sibling.objectWorkingId !== objectWorkingId
    );

    return { sourceObject, pageBySiblings };
  };

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

    const { pageBy, validPageByElements } = pageByElements;

    return this.parseValidPageByElements(pageBy, validPageByElements);
  };

  /**
   * Creates new pageByDataElement for each valid combination of Page-by elements
   *
   * @param pageBy contains Page-by elements of a Report
   * @param validPageByElements containts valid Page-by combinations of Report's Page-by attributes
   * @returns Two-dimensional array of valid Page-by elements combinations
   */
  parseValidPageByElements = (
    pageBy: PageBy[],
    validPageByElements: ValidPageByElements
  ): PageByDataElement[][] => {
    const validPageByData: PageByDataElement[][] = [];

    validPageByElements?.items?.forEach(combination => {
      const pageByDataElement: PageByDataElement[] = combination.map((value, index) => {
        const { name: pageByItemName, elements } = pageBy[index];
        const { name: elementName, id, formValues } = elements[value];
        const formattedFormValues =
          (formValues?.length || 0) > 1 ? `(${formValues?.join(', ')})` : formValues?.[0];
        return {
          name: pageByItemName,
          value: formattedFormValues ?? elementName ?? '',
          valueId: id,
        };
      });

      validPageByData.push(pageByDataElement);
    });

    return validPageByData;
  };

  /**
   * Creates new pageByData for default page-by elements
   *
   * @param instanceDefinition Object containing information about MSTR object
   * @param pageByLinkId Unique identifier of the Page-by sibling
   * @param pageByDisplayType Contains information about the currently selected Page-by display setting
   * @returns Two-dimensional array of valid Page-by elements combinations
   */
  getPageByDataForDefaultPage = (
    instanceDefinition: InstanceDefinition,
    pageByLinkId: string,
    pageByDisplayType: PageByDisplayType
  ): PageByData => {
    // @ts-expect-error
    const { currentPageBy } = instanceDefinition.data;

    const { pageBy } = instanceDefinition?.definition.grid ?? {};

    const validPageByElements = {
      items: [currentPageBy],
    };

    const elements = this.parseValidPageByElements(pageBy, validPageByElements);

    const pageByData = {
      pageByLinkId,
      pageByDisplayType,
      elements: elements[0],
    };

    return pageByData;
  };

  /**
   * Gets new page by data based on object instance
   *
   * @param pageByData Contains information about Page-by data of given object
   * @param instanceDefinition Object containing information about MSTR object instance definition
   * @returns PageByData object containing information about page-by elements
   */
  getPageByDataForDisplayType = (
    pageByData: PageByData,
    instanceDefinition: InstanceDefinition
  ): PageByData => {
    const { pageByDisplayType, pageByLinkId } = pageByData;

    switch (pageByDisplayType) {
      case PageByDisplayType.DEFAULT_PAGE:
        return this.getPageByDataForDefaultPage(
          instanceDefinition,
          pageByLinkId,
          pageByDisplayType
        );
      case PageByDisplayType.ALL_PAGES:
      case PageByDisplayType.SELECT_PAGES:
      default:
        return pageByData;
    }
  };

  /**
   * Triggers refresh operation for all Page-by siblings of the source object
   *
   * @param objectWorkingId Unique identifier of the object
   */
  handleRefreshingMultiplePages = (objectWorkingId: number): void => {
    const { pageBySiblings, sourceObject } = this.getAllPageByObjects(objectWorkingId);
    pageBySiblings.push(sourceObject);

    pageBySiblings.forEach((pageByObject: ObjectData) => {
      reduxStore.dispatch(refreshRequested(pageByObject.objectWorkingId, pageByObject?.importType));
    });
  };

  /**
   * Triggers remove operation for all Page-by siblings of the source object
   *
   * @param objectWorkingId Unique identifier of the object
   */
  // TODO: combine with handleRefreshingMultiplePages
  handleRemovingMultiplePages = (objectWorkingId: number): void => {
    const { pageBySiblings, sourceObject } = this.getAllPageByObjects(objectWorkingId);
    pageBySiblings.push(sourceObject);

    pageBySiblings.forEach((pageByObject: ObjectData) => {
      reduxStore.dispatch(removeRequested(pageByObject.objectWorkingId, pageByObject?.importType));
    });
  };

  getPageByElements(pageByData: PageByData): string {
    return pageByData.elements
      ?.map(element => (element.value.includes(',') ? `(${element.value})` : element.value))
      .join(', ');
  }

  /**
   * Generates a worksheet name based on naming conventions and pageBy value
   * @param objectName Name of the object added to the new worksheet
   * @param pageByData Contains information about page-by elements
   * @return Generated worksheet name.
   */
  prepareNameBasedOnPageBySettings(objectName: string, pageByData: PageByData): string {
    const pageByElement = this.getPageByElements(pageByData);
    const { settingsReducer } = reduxStore.getState();
    const currentNamingSetting = settingsReducer.objectAndWorksheetNamingSetting;

    let newSheetName;
    switch (currentNamingSetting) {
      case ObjectAndWorksheetNamingOption.REPORT_NAME:
        newSheetName = objectName;
        break;
      case ObjectAndWorksheetNamingOption.PAGE_NAME:
        newSheetName = pageByElement;
        break;
      case ObjectAndWorksheetNamingOption.PAGE_NAME_AND_REPORT_NAME:
        newSheetName = `${pageByElement} - ${objectName}`;
        break;
      case ObjectAndWorksheetNamingOption.REPORT_NAME_AND_PAGE_NAME:
        newSheetName = `${objectName} - ${pageByElement}`;
        break;
      default:
        break;
    }

    return newSheetName;
  }

  /**
   * Parses Page-by combinations selected in the Page-by modal
   *
   * @param pageByConfigurations Array of selected Page-by configurations
   * @returns Two-dimensional array of selected page-by elements
   */
  parseSelectedPageByConfigurations = (
    pageByConfigurations: PageByConfiguration[][]
  ): PageByDataElement[][] =>
    pageByConfigurations.map(combination =>
      combination.map(({ name, value, id }) => ({ name, value, valueId: id }))
    );
}

export const pageByHelper = new PageByHelper();
