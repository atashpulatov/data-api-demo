import { Action } from 'redux';
import { v4 as uuidv4 } from 'uuid';

import instanceDefinitionHelper from '../mstr-object/instance/instance-definition-helper';
import { officeApiService } from '../office/api/office-api-service';
import { pageByHelper } from '../page-by/page-by-helper';

import { reduxStore } from '../store';

import { PageByDataElement, PageByDisplayType } from '../page-by/page-by-types';
import { InstanceDefinition } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { TableImportPosition } from '../redux-reducer/settings-reducer/settings-reducer-types';
import { ObjectData, VisualizationInfo } from '../types/object-types';
import {
  DialogResponse,
  ObjectDialogInfo,
  ObjectToImport,
  ReportParams,
} from './dialog-controller-types';

import dossierInstanceDefinition from '../mstr-object/instance/dossier-instance-definition';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { importRequested } from '../redux-reducer/operation-reducer/operation-actions';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import {
  DEFAULT_CELL_POSITION,
  DisplayAttrFormNames,
  ObjectImportType,
} from '../mstr-object/constants';

class DialogControllerHelper {
  clearPopupStateIfNeeded = (): void => {
    // TODO: convert this to a redux action
    const { isDataOverviewOpen } = reduxStore.getState().popupStateReducer;

    if (!isDataOverviewOpen) {
      // @ts-expect-error
      reduxStore.dispatch(popupStateActions.onClearPopupState());
    } else {
      reduxStore.dispatch(officeActions.setIsDialogLoaded(false));
      // Clear reprompt/edit flags
      reduxStore.dispatch(
        // @ts-expect-error
        popupStateActions.setMstrData({
          isReprompt: undefined,
          isEdit: undefined,
        })
      );
    }
    // DE287911: Below line should always run, to ensure `editedObject` is not persisted.
    // We should evaluate adding better Redux Store clean-up after operations (Edit, Reprompt, etc.)
    // to ensure we aren't keeping old references around (e.g. editedObject, isReprompt, isEdit, etc.)
    reduxStore.dispatch(popupActions.resetState());
  };

  /**
   * Transforms the response from the dialog into an object data structure, and then calls the handleImport method.
   *
   * @param response Message received from the dialog
   */
  handleUpdateCommand = async (response: ObjectDialogInfo): Promise<void> => {
    const objectData = {
      name: response.chosenObjectName,
      objectWorkingId: response.objectWorkingId,
      objectId: response.chosenObjectId,
      projectId: response.projectId,
      mstrObjectType: mstrObjectEnum.getMstrTypeBySubtype(response.chosenObjectSubtype),
      body: response.body,
      dossierData: response.dossierData,
      promptsAnswers: response.promptsAnswers,
      importType: response.importType,
      isPrompted:
        response.promptsAnswers?.length > 0 && response.promptsAnswers[0].answers?.length > 0,
      instanceId: response.instanceId,
      subtotalsInfo: response.subtotalsInfo,
      displayAttrFormNames: response.displayAttrFormNames,
      definition: { filters: response.filterDetails },
      pageByData: response.pageByData,
      pageByConfigurations: response.pageByConfigurations,
    };

    await this.handleImport([objectData]);
  };

  /**
   * Transforms the response from the dialog into an object data structure, and then calls the handleImport method.
   *
   * @param response Message received from the dialog
   */
  handleOkCommand = async (response: DialogResponse): Promise<void> => {
    const objectsToImport: ObjectToImport[] = [];
    response.objectsDialogInfo.forEach(objectDialogInfo => {
      if (objectDialogInfo.chosenObject) {
        objectsToImport.push({
          name: objectDialogInfo.chosenObjectName,
          dossierData: objectDialogInfo.dossierData,
          objectId: objectDialogInfo.chosenObject,
          projectId: objectDialogInfo.chosenProject,
          mstrObjectType: mstrObjectEnum.getMstrTypeBySubtype(objectDialogInfo.chosenSubtype),
          importType: objectDialogInfo.importType,
          isPrompted:
            objectDialogInfo.isPrompted || objectDialogInfo.promptsAnswers?.answers?.length > 0,
          promptsAnswers: objectDialogInfo.promptsAnswers,
          visualizationInfo: objectDialogInfo.visualizationInfo,
          preparedInstanceId: objectDialogInfo.preparedInstanceId,
          definition: { filters: objectDialogInfo.filterDetails },
          displayAttrFormNames: objectDialogInfo.displayAttrFormNames,
          pageByConfigurations: objectDialogInfo.pageByConfigurations,
        });
      }
    });

    await this.handleImport(objectsToImport);
  };

  /**
   * Method used for handling import of the object selected by the user.
   * For Page-by Reports, it will loop through all valid combinations of Page-by elements, creating new import request for each.
   *
   * @param objectsToImport Contains information about the MSTR objects to be imported
   */
  handleImport = async (objectsToImport: ObjectToImport[]): Promise<void | Action> => {
    let startCell = DEFAULT_CELL_POSITION; // Needed only for importing multiple objects
    const pageKeysSet: Set<string> = new Set();

    for (let index = 0; index < objectsToImport.length; index++) {
      startCell = await this.handleSingleObjectImport(
        objectsToImport,
        index,
        startCell,
        pageKeysSet
      );
    }
  };

  /**
   * Method used for handling import of a deafult Page-by attributes combination of the object.
   *
   * @param pageByLinkId Unique identifier of the Page-by sibling
   * @param objectData Contains information about the MSTR object
   * @param preparedInstanceDefinition Contains information about the object's instance
   * @param pageByDisplayType Contains information about the currently selected Page-by display setting
   */
  handleDefaultPageImport = (
    pageByLinkId: string,
    objectData: ObjectData,
    preparedInstanceDefinition: InstanceDefinition,
    pageByDisplayType: PageByDisplayType
  ): Action => {
    const pageByData = {
      pageByLinkId,
      pageByDisplayType,
      elements: [] as PageByDataElement[],
    };

    return reduxStore.dispatch(
      importRequested({ object: { ...objectData, pageByData }, preparedInstanceDefinition })
    );
  };

  /**
   * Method used for handling import multiple valid Page-by attributes combinations of the object.
   *
   * @param pageByLinkId Unique identifier of the Page-by sibling
   * @param pageByCombinations Contains information about the valid Page-by elements combinations
   * @param objectData Contains information about the MSTR object
   * @param preparedInstanceDefinition Contains information about the object's instance
   * @param pageByDisplayType Contains information about the currently selected Page-by display setting
   */
  handleMultiplePagesImport = (
    pageByLinkId: string,
    pageByCombinations: PageByDataElement[][],
    objectData: ObjectData,
    preparedInstanceDefinition: InstanceDefinition,
    pageByDisplayType: PageByDisplayType
  ): void => {
    pageByCombinations.forEach((validCombination, pageByIndex) => {
      const pageByData = {
        pageByLinkId,
        pageByDisplayType,
        elements: validCombination,
      };

      reduxStore.dispatch(
        importRequested({
          object: {
            ...objectData,
            pageByData,
            insertNewWorksheet: true,
          },
          preparedInstanceDefinition,
          pageByIndex,
        })
      );
    });
  };

  closeDialog = (dialog: Office.Dialog): void => {
    try {
      return dialog.close();
    } catch (e) {
      console.info('Attempted to close an already closed dialog');
    }
  };

  // Used to reset dialog-related state variables in Redux Store
  // and the dialog reference stored in the class object.
  resetDialogStates = (): void => {
    reduxStore.dispatch(popupActions.resetState());
    // @ts-expect-error
    reduxStore.dispatch(popupStateActions.onClearPopupState());
    // @ts-expect-error
    reduxStore.dispatch(officeActions.hideDialog());
  };

  getObjectPreviousState = (reportParams: ReportParams): ObjectData => {
    const { objects } = reduxStore.getState().objectReducer;
    const indexOfOriginalValues = objects.findIndex(
      (report: ObjectData) => report.bindId === reportParams.object.bindId
    );
    const originalValues = objects[indexOfOriginalValues];

    if (originalValues.displayAttrFormNames) {
      return { ...originalValues };
    }
    return {
      ...originalValues,
      displayAttrFormNames: DisplayAttrFormNames.AUTOMATIC,
    };
  };

  getIsMultipleRepromptQueueEmpty = (): boolean => {
    const { index = 0, total = 0 } = reduxStore.getState().repromptsQueueReducer;
    return total === 0 || (total >= 1 && index === total);
  };

  getIsDialogAlreadyOpenForMultipleReprompt = (): boolean => {
    const { index = 0, total = 0 } = reduxStore.getState().repromptsQueueReducer;
    return total > 1 && index > 1;
  };

  /**
   * Method used for handling import of a single object.
   *
   * @param objectsToImport Contains information about the MSTR objects and pageByConfigurations
   * @param index Index of the object to be imported
   * @param startCell Contains information about the starting cell for the import operation
   * @param pageKeysSet Contains information about already imported Page-by keys
   * @returns startCell with applied offset
   */
  async handleSingleObjectImport(
    objectsToImport: ObjectToImport[],
    index: number,
    startCell: string,
    pageKeysSet: Set<string>
  ): Promise<string> {
    const objectToImport = objectsToImport[index];
    const preparedInstanceDefinition = await this.getPreparedInstanceDefinition(objectToImport);
    const { pageBy } = preparedInstanceDefinition?.definition.grid ?? {};

    if (objectsToImport.length > 1) {
      const { rowCellOffset, columnCellOffset } = this.getMultipleImportOffset(
        preparedInstanceDefinition
      );
      const insertNewWorksheetOnMultipleImport = this.checkInsertNewWorksheet(
        objectToImport,
        pageKeysSet,
        index
      );

      reduxStore.dispatch(
        importRequested({
          object: { ...objectToImport, insertNewWorksheet: insertNewWorksheetOnMultipleImport },
          preparedInstanceDefinition,
          startCell,
        })
      );

      startCell = officeApiService.offsetCellBy(startCell, rowCellOffset, columnCellOffset);
    } else if (!pageBy?.length || objectToImport.importType === ObjectImportType.PIVOT_TABLE) {
      reduxStore.dispatch(importRequested({ object: objectToImport, preparedInstanceDefinition }));
    } else {
      await this.handlePageByImport(objectToImport, preparedInstanceDefinition);
    }
    return startCell;
  }

  /**
   * Method used for preparing the instance definition of the object to be imported.
   *
   * @param objectToImport Contains information about the MSTR object and pageByConfigurations
   * @returns InstanceDefinition of object being imported
   */
  async getPreparedInstanceDefinition(objectToImport: ObjectData): Promise<InstanceDefinition> {
    let preparedInstanceDefinition;
    if (objectToImport.mstrObjectType === mstrObjectEnum.mstrObjectType.report) {
      preparedInstanceDefinition =
        await instanceDefinitionHelper.createReportInstance(objectToImport);
    } else if (objectToImport.mstrObjectType === mstrObjectEnum.mstrObjectType.visualization) {
      preparedInstanceDefinition = (
        await dossierInstanceDefinition.getDossierInstanceDefinition(objectToImport)
      ).instanceDefinition;
    }
    return preparedInstanceDefinition;
  }

  /**
   * Method used for determining whether to insert new worksheet on multiple import.
   *
   * @param objectToImport Contains information about the MSTR object and pageByConfigurations
   * @param pageKeysSet Contains information about the Page-by keys
   * @param index Index of the object to be imported
   * @returns Flag indicating whether to insert new worksheet on multiple import
   */
  checkInsertNewWorksheet(
    objectToImport: ObjectData,
    pageKeysSet: Set<string>,
    index: number
  ): boolean {
    let insertNewWorksheetOnMultipleImport = !index;

    if (objectToImport.mstrObjectType === mstrObjectEnum.mstrObjectType.visualization) {
      const { pageKey } = objectToImport.visualizationInfo as VisualizationInfo;

      if (pageKeysSet.has(pageKey)) {
        insertNewWorksheetOnMultipleImport = false;
      } else {
        pageKeysSet.add(pageKey);
        insertNewWorksheetOnMultipleImport = true;
      }
    }
    return insertNewWorksheetOnMultipleImport;
  }

  /**
   * Method used for handling import of the page-by object selected by the user.
   * It will loop through all valid combinations of Page-by elements, creating new import request for each.
   *
   * @param objectToImport Contains information about the MSTR object and pageByConfigurations
   * @param preparedInstanceDefinition Contains information about the object's instance
   */
  async handlePageByImport(
    objectToImport: ObjectToImport,
    preparedInstanceDefinition: InstanceDefinition
  ): Promise<void> {
    const pageByLinkId = uuidv4();
    const { pageByConfigurations, ...objectData } = objectToImport;

    const { settingsReducer } = reduxStore.getState();
    const { pageByDisplaySetting } = settingsReducer;

    const parsedPageByConfigurations =
      pageByConfigurations && pageByHelper.parseSelectedPageByConfigurations(pageByConfigurations);

    const validPageByData = await pageByHelper.getValidPageByData(
      objectData,
      preparedInstanceDefinition
    );

    switch (pageByDisplaySetting) {
      case PageByDisplayType.DEFAULT_PAGE:
        this.handleDefaultPageImport(
          pageByLinkId,
          objectData,
          preparedInstanceDefinition,
          pageByDisplaySetting
        );
        break;
      case PageByDisplayType.ALL_PAGES:
        this.handleMultiplePagesImport(
          pageByLinkId,
          validPageByData,
          objectData,
          preparedInstanceDefinition,
          pageByDisplaySetting
        );
        break;
      case PageByDisplayType.SELECT_PAGES:
        this.handleMultiplePagesImport(
          pageByLinkId,
          parsedPageByConfigurations,
          objectData,
          preparedInstanceDefinition,
          pageByDisplaySetting
        );
        break;
      default:
        break;
    }
  }

  /**
   * Method used for calculating the offset for the next import operation when importing multiple objects.
   *
   * @param preparedInstanceDefinition Contains information about the object's instance
   * @returns rowCellOffset and columnCellOffset
   */
  getMultipleImportOffset(preparedInstanceDefinition: InstanceDefinition): {
    rowCellOffset: number;
    columnCellOffset: number;
  } {
    const {
      mstrTable: { crosstabHeaderDimensions, tableSize },
    } = preparedInstanceDefinition;
    const { columns, rows } = tableSize;

    const { tableImportPosition } = reduxStore.getState().settingsReducer;
    let columnCellOffset = 0;
    let rowCellOffset = 0;
    const { columnsY, rowsX } = crosstabHeaderDimensions || {};

    if (tableImportPosition === TableImportPosition.HORIZONTAL) {
      const crosstabColumnOffset = crosstabHeaderDimensions ? rowsX : 0;

      columnCellOffset = columns + crosstabColumnOffset + 1; // +1 for empty row between imported tables
    } else if (tableImportPosition === TableImportPosition.VERTICAL) {
      const crosstabRowOffset = crosstabHeaderDimensions ? columnsY - 1 : 0; // -1 since we dont need empty line for table header

      rowCellOffset = rows + crosstabRowOffset + 2; // +2 for empty row between imported tables + headers
    }
    return { rowCellOffset, columnCellOffset };
  }
}

export const dialogControllerHelper = new DialogControllerHelper();
