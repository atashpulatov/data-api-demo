import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import officeReducerHelper from '../office/store/office-reducer-helper';

import { reduxStore } from '../store';

import { InstanceDefinition } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';
import {
  PageBy,
  PageByData,
  PageByDataElement,
  PageByDisplayType,
  ValidPageByElements,
} from './page-by-types';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { deleteObjectNotification } from '../redux-reducer/notification-reducer/notification-action-creators';
import {
  cancelOperation,
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
  getAllPageByObjects = (objectWorkingId: number): ObjectData[] => {
    const sourceObject =
      officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
    const { objects } = reduxStore.getState().objectReducer;

    const pageByObjects = objects.filter(
      object => object?.pageByData?.pageByLinkId === sourceObject.pageByData?.pageByLinkId
    );
    return pageByObjects.sort((a, b) => a.objectWorkingId - b.objectWorkingId);
  };

  /**
   * Gets all Page-by siblings of the source object
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   * @returns Array of objects containing information about the Page-by siblings
   */
  getAllPageBySiblings = (objectWorkingId: number): ObjectData[] => {
    const allPageByElements = this.getAllPageByObjects(objectWorkingId);
    return allPageByElements.filter(sibling => sibling.objectWorkingId !== objectWorkingId);
  };

  /**
   * Clears operations for all Page-by siblings of the source object
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  clearOperationsForPageBySiblings = (objectWorkingId: number): void => {
    const pageBySiblings = this.getAllPageBySiblings(objectWorkingId);

    const { operations } = reduxStore.getState().operationReducer;

    for (const sibling of pageBySiblings) {
      const isOperationExistForSibling = operations.some(
        operation => operation.objectWorkingId === sibling.objectWorkingId
      );
      if (isOperationExistForSibling) {
        reduxStore.dispatch(cancelOperation(sibling.objectWorkingId));
        reduxStore.dispatch(deleteObjectNotification(sibling.objectWorkingId));
      }
    }
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
      const pageByDataElement: PageByDataElement[] = combination.map((value, index) => ({
        name: pageBy[index].name,
        value: pageBy[index].elements[value].formValues[0],
        valueId: pageBy[index].elements[value].id,
      }));

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
    const pageByObjects = this.getAllPageByObjects(objectWorkingId);

    pageByObjects.forEach((pageByObject: ObjectData) => {
      reduxStore.dispatch(refreshRequested(pageByObject.objectWorkingId, pageByObject?.importType));
    });
  };

  /**
   * Triggers remove operation for all Page-by siblings of the source object
   *
   * @param objectWorkingId Unique identifier of the object
   */
  handleRemovingMultiplePages = (objectWorkingId: number): void => {
    const pageByObjects = this.getAllPageByObjects(objectWorkingId);

    pageByObjects.forEach((pageByObject: ObjectData) => {
      reduxStore.dispatch(removeRequested(pageByObject.objectWorkingId, pageByObject?.importType));
    });
  };
}

export const pageByHelper = new PageByHelper();
