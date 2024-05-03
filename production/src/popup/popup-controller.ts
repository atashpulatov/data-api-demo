import { v4 as uuidv4 } from 'uuid';

import { authenticationHelper } from '../authentication/authentication-helper';
import instanceDefinitionHelper from '../mstr-object/instance/instance-definition-helper';
import { officeApiHelper } from '../office/api/office-api-helper';
import { pageByHelper } from '../page-by/page-by-helper';
import { OverviewActionCommands } from './overview/overview-helper';

import { PageByDataElement, PageByDisplayType } from '../page-by/page-by-types';
import { InstanceDefinition } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';
import { PageByDisplayOption } from '../right-side-panel/settings-side-panel/settings-side-panel-types';
import { ObjectData } from '../types/object-types';
import { DialogResponse, ReportParams } from './popup-controller-types';

import { selectorProperties } from '../attribute-selector/selector-properties';
import { errorService } from '../error/error-handler';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import {
  duplicateRequested,
  editRequested,
  importRequested,
} from '../redux-reducer/operation-reducer/operation-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import {
  clearRepromptTask,
  executeNextRepromptTask,
} from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';
import { DisplayAttrFormNames } from '../mstr-object/constants';

const URL = `${window.location.href}`;

class PopupController {
  // TODO: Fix any types
  reduxStore: any;

  sessionActions: any;

  popupActions: any;

  overviewHelper: any;

  reportParams: ReportParams;

  dialog: Office.Dialog;

  init = (reduxStore: any, sessionActions: any, popupActions: any, overviewHelper: any): void => {
    this.reduxStore = reduxStore;
    this.sessionActions = sessionActions;
    this.popupActions = popupActions;
    this.overviewHelper = overviewHelper;
    // The following vars used to store references to current object reportParams and dialog
    this.reportParams = null;
    this.dialog = {} as unknown as Office.Dialog;
  };

  clearPopupStateIfNeeded = (): void => {
    // TODO: convert this to a redux action
    const { isDataOverviewOpen } = this.reduxStore.getState().popupStateReducer;

    if (!isDataOverviewOpen) {
      this.reduxStore.dispatch(popupStateActions.onClearPopupState());
    } else {
      this.reduxStore.dispatch(officeActions.setIsDialogLoaded(false));
      // Clear reprompt/edit flags
      this.reduxStore.dispatch(
        popupStateActions.setMstrData({
          isReprompt: undefined,
          isEdit: undefined,
        })
      );
    }
    // DE287911: Below line should always run, to ensure `editedObject` is not persisted.
    // We should evaluate adding better Redux Store clean-up after operations (Edit, Reprompt, etc.)
    // to ensure we aren't keeping old references around (e.g. editedObject, isReprompt, isEdit, etc.)
    this.reduxStore.dispatch(this.popupActions.resetState());
  };

  runPopupNavigation = async (): Promise<void> => {
    this.clearPopupStateIfNeeded();
    await this.runPopup(DialogType.libraryWindow, 80, 80);
  };

  runEditFiltersPopup = async (reportParams: ReportParams): Promise<void> => {
    await this.runPopup(DialogType.editFilters, 80, 80, reportParams);
  };

  /**
   * This method is used to run the Report's re-prompt popup from the Excel add-in.
   * Note that both the Edit and Reprompt workflows will call this function.
   * The isEdit parameter determines whether the Reprompt screen should
   * be followed by the Edit Filters screen.
   * @param {*} reportParams
   * @param {*} isEdit
   */
  runRepromptPopup = async (reportParams: any, isEdit = true): Promise<void> => {
    const { popupType } = this.reduxStore.getState().popupStateReducer;
    const isOverviewReprompt = popupType && popupType === DialogType.repromptReportDataOverview;
    this.reduxStore.dispatch(popupStateActions.setMstrData({ isReprompt: true, isEdit }));
    await this.runPopup(
      isOverviewReprompt ? popupType : DialogType.repromptingWindow,
      80,
      80,
      reportParams
    );
  };

  /**
   * This method is used to run the Dossier's re-prompt popup from the Excel add-in
   * @param {*} reportParams
   */
  runRepromptDossierPopup = async (reportParams: any): Promise<void> => {
    const { popupType } = this.reduxStore.getState().popupStateReducer;
    const isOverviewReprompt = popupType && popupType === DialogType.repromptDossierDataOverview;
    this.reduxStore.dispatch(popupStateActions.setMstrData({ isReprompt: true }));
    await this.runPopup(
      isOverviewReprompt ? popupType : DialogType.dossierWindow,
      80,
      80,
      reportParams
    );
  };

  runEditDossierPopup = async (reportParams: ReportParams): Promise<void> => {
    await this.runPopup(DialogType.dossierWindow, 80, 80, reportParams);
  };

  runImportedDataOverviewPopup = async (): Promise<void> => {
    this.clearPopupStateIfNeeded();
    await this.runPopup(DialogType.importedDataOverview, 80, 80, null);
  };

  runPopup = async (
    popupType: string,
    height: number,
    width: number,
    reportParams: ReportParams = null
  ): Promise<void> => {
    const isDialogForMultipleRepromptOpen = this.getIsDialogAlreadyOpenForMultipleReprompt();
    const { isDataOverviewOpen } = this.reduxStore.getState().popupStateReducer;
    const isRepromptOrOvieviewPopupOpen = isDialogForMultipleRepromptOpen || isDataOverviewOpen;

    this.reduxStore.dispatch(popupStateActions.setMstrData({ popupType }));
    this.reportParams = reportParams;

    try {
      await authenticationHelper.validateAuthToken();
    } catch (error) {
      console.error({ error });
      errorService.handleError(error);
      return;
    }

    const url = URL;
    const splittedUrl = url.split('?'); // we need to get rid of any query params

    try {
      await officeApiHelper.getExcelSessionStatus();
      if (isRepromptOrOvieviewPopupOpen) {
        // US530793: If dialog already open, send message to dialog to reload with new object data.
        // This only occurs during Multiple Reprompt workflow.
        this.sendMessageToDialog(
          JSON.stringify({
            splittedUrl,
            popupType,
            isRepromptOrOvieviewPopupOpen,
          })
        );
      } else {
        // Otherwise, open new dialog and assign event handlers
        console.time('Popup load time');
        Office.context.ui.displayDialogAsync(
          `${splittedUrl[0]}?popupType=${popupType}&source=addin-mstr-excel`,
          { height, width, displayInIframe: true },
          asyncResult => {
            const { value: dialog } = asyncResult;
            if (dialog) {
              this.dialog = dialog;
              console.timeEnd('Popup load time');

              dialog.addEventHandler(
                // Event received on message from parent (sidebar)
                Office.EventType.DialogMessageReceived,
                // Trigger onMessageFromPopup callback with most current reportParams object
                arg => this.onMessageFromPopup(dialog, this.reportParams, arg)
              );

              dialog.addEventHandler(
                // Event received on dialog close
                Office.EventType.DialogEventReceived,
                () => {
                  this.reduxStore.dispatch(this.popupActions.resetState());
                  this.reduxStore.dispatch(popupStateActions.onClearPopupState());
                  this.reduxStore.dispatch(officeActions.hideDialog());

                  // Clear the reprompt task queue if the user closes the popup,
                  // as the user is no longer interested in continuing the multiple re-prompting task.
                  this.reduxStore.dispatch(clearRepromptTask());
                }
              );

              this.reduxStore.dispatch(officeActions.showDialog());
            }
          }
        );
      }
    } catch (error) {
      errorService.handleError(error);
    }
  };

  sendMessageToDialog = (message: string): void => {
    this.dialog?.messageChild && this.dialog?.messageChild(message);
  };

  /**
   * It indicates when the dialog type is for multiple reprompting data for reports and/or dossiers triggered in
   * the Overview dialog and the command has to do with data overlapping in the new data range to be occupied in worksheet.
   *
   * Note: Only handling data range commands for multiple re-prompting workflow in the Overview dialog, rather than delegating all
   * possible commands associated with re-prompting. This approach minimizes the risk of introducing bugs in the future by
   * limiting scope to data range overlapping commands only.
   *
   * @param dialogType - indicates type of the dialog to be opened, value from DialogType
   * @param command - action command from the dialog
   * @returns boolean - true if the command is either RANGE_TAKEN_OK or RANGE_TAKEN_CLOSE and re-prompt in Overview dialog.
   */
  isDataRangeCommandForMultipleRepromptDialogInOverview(
    dialogType: DialogType,
    command: string
  ): boolean {
    const { RANGE_TAKEN_CLOSE, RANGE_TAKEN_OK } = OverviewActionCommands;
    const validDialogTypes = [
      DialogType.repromptReportDataOverview,
      DialogType.repromptDossierDataOverview,
    ];
    // Return true to indicate that command was either RANGE_TAKEN_OK or RANGE_TAKEN_CLOSE
    // and current dialog is either repromptReportDataOverview or repromptDossierDataOverview.
    return (
      validDialogTypes.includes(dialogType) &&
      (command === RANGE_TAKEN_OK || command === RANGE_TAKEN_CLOSE)
    );
  }

  onMessageFromPopup = async (
    dialog: Office.Dialog,
    reportParams: ReportParams,
    arg: any
  ): Promise<void> => {
    const isMultipleRepromptQueueEmpty = this.getIsMultipleRepromptQueueEmpty();
    const { message } = arg;
    const response: DialogResponse = JSON.parse(message);

    const { command } = response;
    const {
      commandOk,
      commandOnUpdate,
      commandCancel,
      commandError,
      commandDialogLoaded,
      commandCloseDialog,
      commandExecuteNextRepromptTask,
    } = selectorProperties;

    const dialogType = this.reduxStore.getState().popupStateReducer.popupType;
    const { isDataOverviewOpen } = this.reduxStore.getState().popupStateReducer;

    if (command === commandDialogLoaded) {
      this.reduxStore.dispatch(officeActions.setIsDialogLoaded(true));
    }

    if (command === commandCloseDialog) {
      this.closeDialog(dialog);
      this.resetDialogStates();
    }

    if (command === commandExecuteNextRepromptTask) {
      this.reduxStore.dispatch(executeNextRepromptTask());
    }

    const isMultipleRepromptQueueEmptyAndOverviewClosed =
      isMultipleRepromptQueueEmpty && !isDataOverviewOpen;

    try {
      if (isMultipleRepromptQueueEmptyAndOverviewClosed) {
        // We will only close dialog if not in Multiple Reprompt workflow
        // or if the Multiple Reprompt queue has been cleared up.
        this.closeDialog(dialog);
      }
      if (command !== commandError) {
        await officeApiHelper.getExcelSessionStatus(); // checking excel session status
      }
      await authenticationHelper.validateAuthToken();

      // Attempt to delegate the response to Overview helper to handle the action command for
      // the Overview dialog, if the command is either RANGE_TAKEN_OK or RANGE_TAKEN_CLOSE and
      // the dialog type is either re-prompt for reports or dossiers triggered from Overview dialog.
      // Also, delegate the response to Overview helper if the dialog type is for imported data overview
      // (a.k.a. Overview dialog and supported actions). If any of these conditions are met, then the execution
      // of this method will be stopped here.
      if (
        dialogType === DialogType.importedDataOverview ||
        this.isDataRangeCommandForMultipleRepromptDialogInOverview(dialogType, command)
      ) {
        await this.overviewHelper.handleOverviewActionCommand(response);
        return;
      }

      if (dialogType === DialogType.dossierWindow || dialogType === DialogType.repromptingWindow) {
        await this.overviewHelper.handleOverviewActionCommand(response);
      }

      switch (command) {
        case commandOk:
          await this.onCommandOk(response, reportParams);
          break;
        case commandOnUpdate:
          await this.onCommandUpdate(response, reportParams);
          break;
        case commandCancel:
          await this.manageDialogType(
            isMultipleRepromptQueueEmpty,
            isDataOverviewOpen,
            dialog,
            dialogType
          );
          break;
        case commandError:
          await this.manageDialogType(
            isMultipleRepromptQueueEmpty,
            isDataOverviewOpen,
            dialog,
            dialogType
          );

          // Reset state if an error has occurred and show error message.
          if (isDataOverviewOpen) {
            this.reduxStore.dispatch(this.popupActions.resetState());
          }
          errorService.handleError(response.error);
          break;
        default:
          break;
      }

      // Only show overview table if there are no more prompted items left to Multiple Reprompt
      // This check will keep the prompts dialog open in between reports/dossiers, if there are more to prompt
      // as long as there are no errors.
      if (isDataOverviewOpen && isMultipleRepromptQueueEmpty && command !== commandError) {
        await this.runImportedDataOverviewPopup();
      }
    } catch (error) {
      console.error(error);
      // @ts-expect-error TODO: convert error handler to TypeScript
      errorService.handleError(error, { dialogType });
    } finally {
      // always reset this.reportParams to prevent reusing old references in future popups
      this.reportParams = null;
      if (isMultipleRepromptQueueEmptyAndOverviewClosed) {
        // We will only reset popup related states when not in Multiple Reprompt workflow
        // or if the Multiple Reprompt queue has been cleared up.
        this.resetDialogStates();
      }
    }
  };

  /**
   * Method used for handling the 'ok' command sent from the dialog.
   *
   * @param response Message received from the dialog
   * @param reportParams Contains information about the currently selected object
   */
  onCommandOk = async (response: DialogResponse, reportParams: ReportParams): Promise<void> => {
    if (!reportParams || response.pageByConfigurations?.length) {
      return this.handleOkCommand(response);
    }

    if (reportParams.duplicateMode) {
      return this.reduxStore.dispatch(duplicateRequested(reportParams.object, response));
    }

    const reportPreviousState = this.getObjectPreviousState(reportParams);
    return this.reduxStore.dispatch(editRequested(reportPreviousState, response));
  };

  /**
   * Method used for handling the 'update' command sent from the dialog.
   *
   * @param response Message received from the dialog
   * @param reportParams Contains information about the currently selected object
   */
  onCommandUpdate = async (response: DialogResponse, reportParams: ReportParams): Promise<void> => {
    const { pageByData } = response;

    if (
      !reportParams ||
      response.pageByConfigurations?.length ||
      (pageByData && pageByData.pageByDisplayType !== PageByDisplayType.DEFAULT_PAGE)
    ) {
      // TODO: Add error handling for re-importing Page-by on Edit
      return this.handleUpdateCommand(response);
    }

    if (reportParams.duplicateMode) {
      return this.reduxStore.dispatch(duplicateRequested(reportParams.object, response));
    }

    const reportPreviousState = this.getObjectPreviousState(reportParams);
    return this.reduxStore.dispatch(editRequested(reportPreviousState, response));
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
      pageByConfigurations: response.pageByConfigurations,
    };

    await this.handleImport(objectData);
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
        pageByConfigurations: response.pageByConfigurations,
      };

      await this.handleImport(objectData);
    }
  };

  /**
   * Method used for handling import of the object selected by the user.
   * For Page-by Reports, it will loop through all valid combinations of Page-by elements, creating new import request for each.
   *
   * @param objectData Contains information about the MSTR object
   */
  handleImport = async (objectData: ObjectData): Promise<void> => {
    const { mstrObjectType, pageByData, pageByConfigurations } = objectData;

    let preparedInstanceDefinition;

    if (mstrObjectType === mstrObjectEnum.mstrObjectType.report) {
      preparedInstanceDefinition = await instanceDefinitionHelper.createReportInstance(objectData);
    }

    const { pageBy } = preparedInstanceDefinition?.definition.grid ?? {};

    if (!pageBy?.length) {
      return this.reduxStore.dispatch(
        importRequested({ ...objectData }, preparedInstanceDefinition)
      );
    }

    const pageByLinkId = uuidv4();

    const { settingsReducer } = this.reduxStore.getState();
    const { pageByDisplaySetting } = settingsReducer;

    const selectedPageByDisplayType = pageByData?.pageByDisplayType || pageByDisplaySetting;

    const parsedPageByConfigurations =
      pageByConfigurations && pageByHelper.parseSelectedPageByConfigurations(pageByConfigurations);

    const validPageByData = await pageByHelper.getValidPageByData(
      objectData,
      preparedInstanceDefinition
    );

    switch (selectedPageByDisplayType) {
      case PageByDisplayOption.DEFAULT_PAGE:
        return this.handleDefaultPageImport(
          pageByLinkId,
          objectData,
          preparedInstanceDefinition,
          selectedPageByDisplayType
        );
      case PageByDisplayOption.ALL_PAGES:
        return this.handleMultiplePagesImport(
          pageByLinkId,
          validPageByData,
          objectData,
          preparedInstanceDefinition,
          selectedPageByDisplayType
        );
      case PageByDisplayOption.SELECT_PAGES:
        return this.handleMultiplePagesImport(
          pageByLinkId,
          parsedPageByConfigurations,
          objectData,
          preparedInstanceDefinition,
          selectedPageByDisplayType
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
  ): void => {
    const pageByData = {
      pageByLinkId,
      pageByDisplayType,
      elements: [] as PageByDataElement[],
    };

    return this.reduxStore.dispatch(
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
    const { objectWorkingId } = objectData;

    if (objectWorkingId) {
      pageByHelper.handleRemovingMultiplePages(objectWorkingId);
    }

    pageByCombinations.forEach((validCombination, pageByIndex) => {
      const pageByData = {
        pageByLinkId,
        pageByDisplayType,
        elements: validCombination,
      };

      this.reduxStore.dispatch(
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

  loadPending =
    (wrapped: any) =>
      async (...args: any) => {
        this.runPopup(DialogType.loadingPage, 30, 40);
        return wrapped(...args);
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
    this.reduxStore.dispatch(this.popupActions.resetState());
    this.reduxStore.dispatch(popupStateActions.onClearPopupState());
    this.reduxStore.dispatch(officeActions.hideDialog());
    this.dialog = {} as unknown as Office.Dialog;
  };

  getObjectPreviousState = (reportParams: ReportParams): ObjectData => {
    const { objects } = this.reduxStore.getState().objectReducer;
    const indexOfOriginalValues = objects.findIndex(
      (report: ObjectData) => report.bindId === reportParams.bindId
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
    const { index = 0, total = 0 } = this.reduxStore.getState().repromptsQueueReducer;
    return total === 0 || (total >= 1 && index === total);
  };

  getIsDialogAlreadyOpenForMultipleReprompt = (): boolean => {
    const { index = 0, total = 0 } = this.reduxStore.getState().repromptsQueueReducer;
    return total > 1 && index > 1;
  };

  manageDialogType = async (
    isMultipleRepromptQueueEmpty: boolean,
    isDataOverviewOpen: boolean,
    dialog: Office.Dialog,
    dialogType: string
  ): Promise<void> => {
    // First, clear reprompt task queue if the user cancels the popup.
    this.reduxStore.dispatch(clearRepromptTask());

    if (!isMultipleRepromptQueueEmpty && !isDataOverviewOpen) {
      // Close dialog when user cancels or an error occurs, but only if there are objects left to Multiple Reprompt,
      // since we were previously keeping the dialog open in between objects.
      // Otherwise, the dialog will close and reset popup state anyway, so no need to do it here.
      this.closeDialog(dialog);
      this.resetDialogStates();
    } else if (
      isDataOverviewOpen &&
      (dialogType === DialogType.repromptDossierDataOverview ||
        dialogType === DialogType.repromptReportDataOverview ||
        dialogType === DialogType.libraryWindow)
    ) {
      // Show overview table if cancel was triggered during Multiple Reprompt workflow.
      this.runImportedDataOverviewPopup();
    }
  };
}

export const popupController = new PopupController();
export const { loadPending } = popupController;
