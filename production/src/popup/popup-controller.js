import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { errorService } from '../error/error-handler';
import { authenticationHelper } from '../authentication/authentication-helper';
import { officeProperties } from '../redux-reducer/office-reducer/office-properties';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { officeApiHelper } from '../office/api/office-api-helper';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { importRequested, editRequested, duplicateRequested } from '../redux-reducer/operation-reducer/operation-actions';
import { clearRepromptTask } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';

const URL = `${window.location.href}`;

/* global Office */

class PopupController {
  constructor(excelXtabsBorderColor) {
    this.EXCEL_XTABS_BORDER_COLOR = excelXtabsBorderColor;
  }

  init = (reduxStore, sessionActions, popupActions) => {
    this.reduxStore = reduxStore;
    this.sessionActions = sessionActions;
    this.popupActions = popupActions;
  };

  runPopupNavigation = async () => {
    this.reduxStore.dispatch(popupStateActions.onClearPopupState());
    this.reduxStore.dispatch(this.popupActions.resetState());
    await this.runPopup(PopupTypeEnum.libraryWindow, 80, 80);
  };

  runEditFiltersPopup = async (reportParams) => {
    await this.runPopup(PopupTypeEnum.editFilters, 80, 80, reportParams);
  };

  /**
   * This method is used to run the Report's re-prompt popup from the Excel add-in.
   * Note that both the Edit and Reprompt workflows will call this function.
   * The isEdit parameter determines whether the Reprompt screen should
   * be followed by the Edit Filters screen.
   * @param {*} reportParams
   * @param {*} isEdit
   */
  runRepromptPopup = async (reportParams, isEdit = true) => {
    this.reduxStore.dispatch(popupStateActions.setMstrData({ isReprompt: true, isEdit }));
    await this.runPopup(PopupTypeEnum.repromptingWindow, 80, 80, reportParams);
  };

  /**
   * This method is used to run the Dossier's re-prompt popup from the Excel add-in
   * @param {*} reportParams
   */
  runRepromptDossierPopup = async (reportParams) => {
    this.reduxStore.dispatch(popupStateActions.setMstrData({ isReprompt: true }));
    await this.runPopup(PopupTypeEnum.dossierWindow, 80, 80, reportParams);
  };

  runEditDossierPopup = async (reportParams) => {
    await this.runPopup(PopupTypeEnum.dossierWindow, 80, 80, reportParams);
  };

  runPopup = async (popupType, height, width, reportParams = null) => {
    this.reduxStore.dispatch(popupStateActions.setMstrData({ popupType }));
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
      console.time('Popup load time');
      Office.context.ui.displayDialogAsync(`${splittedUrl[0]}?popupType=${popupType}&source=addin-mstr-excel`,
        { height, width, displayInIframe: true },
        (asyncResult) => {
          const { value: dialog } = asyncResult;
          if (dialog) {
            this.sessionActions.setDialog(dialog);
            console.timeEnd('Popup load time');
            dialog.addEventHandler(Office.EventType.DialogMessageReceived,
              this.onMessageFromPopup.bind(null, dialog, reportParams));

            dialog.addEventHandler(
            // Event received on dialog close
              Office.EventType.DialogEventReceived,
              () => {
                this.reduxStore.dispatch(this.popupActions.resetState());
                this.reduxStore.dispatch(officeActions.hidePopup());

                // Clear the reprompt task queue if the user closes the popup,
                // as the user is no longer interested in continuing the multiple re-prompting task.
                this.reduxStore.dispatch(clearRepromptTask());
              }
            );
            this.reduxStore.dispatch(officeActions.showPopup());
          }
        });
    } catch (error) {
      errorService.handleError(error);
    }
  };

  onMessageFromPopup = async (dialog, reportParams, arg) => {
    const { message } = arg;
    const response = JSON.parse(message);
    try {
      await this.closeDialog(dialog);
      if (response.command !== selectorProperties.commandError) {
        await officeApiHelper.getExcelSessionStatus(); // checking excel session status
      }
      await authenticationHelper.validateAuthToken();
      switch (response.command) {
        case selectorProperties.commandOk:
          if (!reportParams) {
            await this.handleOkCommand(response, reportParams);
          } else if (reportParams.duplicateMode) {
            this.reduxStore.dispatch(duplicateRequested(reportParams.object, response));
          } else {
            const reportPreviousState = this.getObjectPreviousState(reportParams);
            this.reduxStore.dispatch(editRequested(reportPreviousState, response));
          }
          break;
        case selectorProperties.commandOnUpdate:
          if (!reportParams) {
            await this.handleUpdateCommand(response);
          } else if (reportParams.duplicateMode) {
            this.reduxStore.dispatch(duplicateRequested(reportParams.object, response));
          } else {
            const reportPreviousState = this.getObjectPreviousState(reportParams);
            this.reduxStore.dispatch(editRequested(reportPreviousState, response));
          }
          break;
        case selectorProperties.commandCancel:
          this.reduxStore.dispatch(clearRepromptTask());
          break;
        case selectorProperties.commandError:
          errorService.handleError(response.error);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      errorService.handleError(error);
    } finally {
      this.reduxStore.dispatch(this.popupActions.resetState());
      this.reduxStore.dispatch(popupStateActions.onClearPopupState());
      this.reduxStore.dispatch(officeActions.hidePopup());
    }
  };

  handleUpdateCommand = async (response) => {
    const objectData = {
      name: response.chosenObjectName,
      objectId: response.chosenObjectId,
      projectId: response.projectId,
      mstrObjectType: mstrObjectEnum.getMstrTypeBySubtype(response.chosenObjectSubtype),
      body: response.body,
      dossierData: response.dossierData,
      promptsAnswers: response.promptsAnswers,
      isPrompted: response.promptsAnswers?.length > 0 && response.promptsAnswers[0].answers?.length > 0,
      instanceId: response.instanceId,
      subtotalsInfo: response.subtotalsInfo,
      displayAttrFormNames: response.displayAttrFormNames,
      definition: { filters: response.filterDetails },
    };
    this.reduxStore.dispatch(importRequested(objectData));
  };

  handleOkCommand = async (response, bindId) => {
    if (response.chosenObject) {
      const objectData = {
        name: response.chosenObjectName,
        dossierData: response.dossierData,
        objectId: response.chosenObject,
        projectId: response.chosenProject,
        mstrObjectType: mstrObjectEnum.getMstrTypeBySubtype(response.chosenSubtype),
        bindId,
        isPrompted: response.isPrompted || response.promptsAnswers?.answers?.length > 0,
        promptsAnswers: response.promptsAnswers,
        visualizationInfo: response.visualizationInfo,
        preparedInstanceId: response.preparedInstanceId,
        definition: { filters: response.filterDetails, },
        displayAttrFormNames: response.displayAttrFormNames
      };
      this.reduxStore.dispatch(importRequested(objectData));
    }
  };

  loadPending = (wrapped) => async (...args) => {
    this.runPopup(PopupTypeEnum.loadingPage, 30, 40);
    return wrapped(...args);
  };

  closeDialog = (dialog) => {
    try {
      return dialog.close();
    } catch (e) {
      console.log('Attempted to close an already closed dialog');
    }
  };

  getReportsPreviousState = (reportParams) => {
    const currentReportArray = this.reduxStore.getState().officeReducer.reportArray;
    const indexOfOriginalValues = currentReportArray.findIndex((report) => report.bindId === reportParams.bindId);
    const originalValues = currentReportArray[indexOfOriginalValues];
    const { displayAttrFormNames } = officeProperties;
    if (originalValues.displayAttrFormNames) {
      return { ...originalValues };
    }
    return { ...originalValues, displayAttrFormNames: displayAttrFormNames.automatic };
  };

  getObjectPreviousState = (reportParams) => {
    const { objects } = this.reduxStore.getState().objectReducer;
    const indexOfOriginalValues = objects.findIndex((report) => report.bindId === reportParams.bindId);
    const originalValues = objects[indexOfOriginalValues];
    const { displayAttrFormNames } = officeProperties;
    if (originalValues.displayAttrFormNames) {
      return { ...originalValues };
    }
    return { ...originalValues, displayAttrFormNames: displayAttrFormNames.automatic };
  };
}

export const popupController = new PopupController();
export const { loadPending } = popupController;
