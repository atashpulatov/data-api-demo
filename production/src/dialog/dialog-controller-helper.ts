import { PageByConfiguration } from '@mstr/connector-components';
import { Action } from 'redux';
import { v4 as uuidv4 } from 'uuid';

import instanceDefinitionHelper from '../mstr-object/instance/instance-definition-helper';
import { pageByHelper } from '../page-by/page-by-helper';

import { reduxStore } from '../store';

import { PageByDataElement, PageByDisplayType } from '../page-by/page-by-types';
import { InstanceDefinition } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';
import { DialogResponse, ReportParams } from './dialog-controller-types';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { importRequested } from '../redux-reducer/operation-reducer/operation-actions';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { DisplayAttrFormNames, ObjectImportType } from '../mstr-object/constants';

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
  handleUpdateCommand = async (response: DialogResponse): Promise<void> => {
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
    };

    await this.handleImport(objectData, response.pageByConfigurations);
  };

  /**
   * Transforms the response from the dialog into an object data structure, and then calls the handleImport method.
   *
   * @param response Message received from the dialog
   */
  handleOkCommand = async (response: DialogResponse): Promise<void> => {
    if (response.chosenObject) {
      const objectData = {
        name: response.chosenObjectName,
        dossierData: response.dossierData,
        objectId: response.chosenObject,
        projectId: response.chosenProject,
        mstrObjectType: mstrObjectEnum.getMstrTypeBySubtype(response.chosenSubtype),
        importType: response.importType,
        isPrompted: response.isPrompted || response.promptsAnswers?.answers?.length > 0,
        promptsAnswers: response.promptsAnswers,
        visualizationInfo: response.visualizationInfo,
        preparedInstanceId: response.preparedInstanceId,
        definition: { filters: response.filterDetails },
        displayAttrFormNames: response.displayAttrFormNames,
      };

      await this.handleImport(objectData, response.pageByConfigurations);
    }
  };

  /**
   * Method used for handling import of the object selected by the user.
   * For Page-by Reports, it will loop through all valid combinations of Page-by elements, creating new import request for each.
   *
   * @param objectData Contains information about the MSTR object
   * @param pageByConfigurations Contains information about Page-by configurations selected in the Page-by modal
   */
  handleImport = async (
    objectData: ObjectData,
    pageByConfigurations: PageByConfiguration[][]
  ): Promise<void | Action> => {
    const { mstrObjectType, importType } = objectData;

    let preparedInstanceDefinition;

    if (mstrObjectType === mstrObjectEnum.mstrObjectType.report) {
      preparedInstanceDefinition = await instanceDefinitionHelper.createReportInstance(objectData);
    }

    const { pageBy } = preparedInstanceDefinition?.definition.grid ?? {};

    if (!pageBy?.length || importType === ObjectImportType.PIVOT_TABLE) {
      return reduxStore.dispatch(importRequested({ ...objectData }, preparedInstanceDefinition));
    }

    const pageByLinkId = uuidv4();

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
        return this.handleDefaultPageImport(
          pageByLinkId,
          objectData,
          preparedInstanceDefinition,
          pageByDisplaySetting
        );
      case PageByDisplayType.ALL_PAGES:
        return this.handleMultiplePagesImport(
          pageByLinkId,
          validPageByData,
          objectData,
          preparedInstanceDefinition,
          pageByDisplaySetting
        );
      case PageByDisplayType.SELECT_PAGES:
        return this.handleMultiplePagesImport(
          pageByLinkId,
          parsedPageByConfigurations,
          objectData,
          preparedInstanceDefinition,
          pageByDisplaySetting
        );
      default:
        break;
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
      importRequested({ ...objectData, pageByData }, preparedInstanceDefinition)
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
        importRequested(
          {
            ...objectData,
            pageByData,
            insertNewWorksheet: true,
          },
          preparedInstanceDefinition,
          pageByIndex
        )
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
}

export const dialogControllerHelper = new DialogControllerHelper();
