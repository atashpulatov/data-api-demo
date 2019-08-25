import {selectorProperties} from '../attribute-selector/selector-properties';
import {officeDisplayService} from '../office/office-display-service';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {sessionHelper} from '../storage/session-helper';
import {objectTypes} from 'mstr-react-library';
import {notificationService} from '../notification/notification-service';
import {reduxStore} from '../store';
import {CLEAR_WINDOW, refreshReportsArray} from './popup-actions';
import {errorService} from '../error/error-handler';
import {authenticationHelper} from '../authentication/authentication-helper';
import {officeProperties} from '../office/office-properties';
import {officeApiHelper} from '../office/office-api-helper';
import {START_REPORT_LOADING, STOP_REPORT_LOADING} from './popup-actions';
import {officeStoreService} from '../office/store/office-store-service';
const URL = `${window.location.href}`;

/* global Office */

class PopupController {
  runPopupNavigation = async () => {
    await this.runPopup(PopupTypeEnum.navigationTree, 80, 80);
  };

  runEditFiltersPopup = async (reportParams) => {
    await this.runPopup(PopupTypeEnum.editFilters, 80, 80, reportParams);
  };

  runRepromptPopup = async (reportParams) => {
    await this.runPopup(PopupTypeEnum.repromptingWindow, 80, 80, reportParams);
  };

  runPopup = async (popupType, height, width, reportParams = null) => {
    const session = sessionHelper.getSession();
    try {
      await authenticationHelper.validateAuthToken();
    } catch (error) {
      errorService.handleError(error);
      return;
    }
    const url = URL;
    // if (IS_LOCALHOST) {
    // url = `${window.location.origin}/popup.html`;
    // } else {
    // url = url.replace('index.html', 'popup.html');
    // }
    const splittedUrl = url.split('?'); // we need to get rid of any query params
    try {
      await officeApiHelper.getExcelSessionStatus();
      Office.context.ui.displayDialogAsync(
          splittedUrl[0]
        + '?popupType=' + popupType
        + '&envUrl=' + session.url,
          {height, width, displayInIframe: true},
          (asyncResult) => {
            const dialog = asyncResult.value;
            sessionHelper.setDialog(dialog);
            dialog.addEventHandler(
                Office.EventType.DialogMessageReceived,
                this.onMessageFromPopup.bind(null, dialog, reportParams));
            reduxStore.dispatch({type: CLEAR_WINDOW});
            dialog.addEventHandler(
            // Event received on dialog close
                Office.EventType.DialogEventReceived, (event) => {
                  reduxStore.dispatch({type: officeProperties.actions.popupHidden});
                });

            reduxStore.dispatch({type: officeProperties.actions.popupShown});
          });
    } catch (error) {
      errorService.handleError(error);
    }
  };

  onMessageFromPopup = async (dialog, reportParams, arg) => {
    const message = arg.message;
    const response = JSON.parse(message);
    try {
      await this.closeDialog(dialog);
      await officeApiHelper.getExcelSessionStatus(); // checking excel session status
      switch (response.command) {
        case selectorProperties.commandOk:
          if (!reportParams) {
            await this.handleOkCommand(response, reportParams);
          } else {
            const reportPreviousState = this._getReportsPreviousState(reportParams);
            await this.saveReportWithParams(reportParams, response, reportPreviousState);
          }
          break;
        case selectorProperties.commandOnUpdate:
          if (!reportParams) {
            await this.handleUpdateCommand(response);
          } else {
            const reportPreviousState = this._getReportsPreviousState(reportParams);
            await this.saveReportWithParams(reportParams, response, reportPreviousState);
          }
          break;
        case selectorProperties.commandCancel:
          break;
        case selectorProperties.commandError:
          errorService.handleError(response.error, false);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      errorService.handleError(error);
    } finally {
      reduxStore.dispatch({type: officeProperties.actions.popupHidden});
      reduxStore.dispatch({type: officeProperties.actions.stopLoading});
    }
  }

  handleUpdateCommand = async ({dossierData, reportId, projectId, reportSubtype, body, reportName, promptsAnswers, isPrompted, instanceId}) => {
    if (reportId && projectId && reportSubtype && body && reportName) {
      reduxStore.dispatch({type: START_REPORT_LOADING, data: {name: reportName}});
      const options = {
        isPrompted,
        promptsAnswers,
        dossierData,
        objectId: reportId,
        projectId,
        instanceId,
        isReport: objectTypes.getTypeDescription(3, reportSubtype) === 'Report',
        body,
      };
      const result = await officeDisplayService.printObject(options);
      if (result) {
        notificationService.displayNotification(result.type, result.message);
      }
      reduxStore.dispatch({type: STOP_REPORT_LOADING});
    }
  }

  handleOkCommand = async ({chosenObject, dossierData, chosenProject, chosenSubtype, isPrompted, promptsAnswers, reportName}, bindingId) => {
    if (chosenObject) {
      reduxStore.dispatch({type: officeProperties.actions.startLoading});
      reduxStore.dispatch({type: START_REPORT_LOADING, data: {name: reportName}});
      const options = {
        dossierData,
        objectId: chosenObject,
        projectId: chosenProject,
        isReport: objectTypes.getTypeDescription(3, chosenSubtype) === 'Report',
        bindingId,
        isRefresh: false,
        isPrompted,
        promptsAnswers,
      };
      const result = await officeDisplayService.printObject(options);
      if (result) {
        notificationService.displayNotification(result.type, result.message);
      }
      reduxStore.dispatch({type: STOP_REPORT_LOADING});
    }
  }

  loadPending = (wrapped) => {
    return async (...args) => {
      this.runPopup(PopupTypeEnum.loadingPage, 30, 40);
      return await wrapped(...args);
    };
  }

  closeDialog = (dialog) => {
    try {
      return dialog.close();
    } catch (e) {
      console.log('Attempted to close an already closed dialog');
    }
  }

  _getReportsPreviousState(reportParams) {
    const currentReportArray = reduxStore.getState().officeReducer.reportArray;
    const indexOfOriginalValues = currentReportArray.findIndex((report) => report.bindId === reportParams.bindId);
    const originalValues = currentReportArray[indexOfOriginalValues];
    return {...originalValues};
  }

  async saveReportWithParams(reportParams, response, reportPreviousState) {
    await officeStoreService.preserveReportValue(reportParams.bindId, 'body', response.body);
    if (response.promptsAnswers) {
      // Include new promptsAnswers in case of Re-prompt workflow
      reportParams.promptsAnswers = response.promptsAnswers;
      await officeStoreService.preserveReportValue(reportParams.bindId, 'promptsAnswers', response.promptsAnswers);
    }
    const isErrorOnRefresh = await refreshReportsArray([reportParams], false)(reduxStore.dispatch);
    if (isErrorOnRefresh) {
      await officeStoreService.preserveReportValue(reportParams.bindId, 'body', reportPreviousState.body);
    }
  }
}

export const popupController = new PopupController();
export const loadPending = popupController.loadPending;
