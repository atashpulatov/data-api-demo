import { selectorProperties } from '../attribute-selector/selector-properties';
import { officeDisplayService } from '../office/office-display-service';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { sessionHelper } from '../storage/session-helper';
import { notificationService } from '../notification/notification-service';
import { reduxStore } from '../store';
import {
  CLEAR_WINDOW,
  refreshReportsArray,
  START_REPORT_LOADING,
  STOP_REPORT_LOADING,
} from './popup-actions';
import { errorService } from '../error/error-handler';
import { authenticationHelper } from '../authentication/authentication-helper';
import { officeProperties } from '../office/office-properties';
import { officeApiHelper } from '../office/office-api-helper';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { officeStoreService } from '../office/store/office-store-service';
import { REFRESH_CACHE_COMMAND, refreshCache } from '../cache/cache-actions';

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
      reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
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
      console.time('Popup load time');
      Office.context.ui.displayDialogAsync(`${splittedUrl[0]}?popupType=${popupType}&envUrl=${session.url}`,
        { height, width, displayInIframe: true },
        (asyncResult) => {
          const dialog = asyncResult.value;
          sessionHelper.setDialog(dialog);
          console.timeEnd('Popup load time');
          dialog.addEventHandler(Office.EventType.DialogMessageReceived,
            this.onMessageFromPopup.bind(null, dialog, reportParams));
          reduxStore.dispatch({ type: CLEAR_WINDOW });
          dialog.addEventHandler(
            // Event received on dialog close
            Office.EventType.DialogEventReceived,
            () => {
              reduxStore.dispatch({ type: officeProperties.actions.popupHidden });
              reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
            }
          );
          reduxStore.dispatch({ type: officeProperties.actions.popupShown });
        });
    } catch (error) {
      reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
      errorService.handleError(error);
    }
  };

  onMessageFromPopup = async (dialog, reportParams, arg) => {
    const { message } = arg;
    const response = JSON.parse(message);
    try {
      if (response.command !== REFRESH_CACHE_COMMAND) await this.closeDialog(dialog);
      await officeApiHelper.getExcelSessionStatus(); // checking excel session status
      switch (response.command) {
        case selectorProperties.commandOk:
          if (!reportParams) {
            await this.handleOkCommand(response, reportParams);
          } else {
            const reportPreviousState = this._getReportsPreviousState(reportParams);
            await this.saveReportWithParams(reportParams,
              response,
              reportPreviousState);
          }
          break;
        case selectorProperties.commandOnUpdate:
          if (!reportParams) {
            await this.handleUpdateCommand(response);
          } else {
            const reportPreviousState = this._getReportsPreviousState(reportParams);
            await this.saveReportWithParams(reportParams,
              response,
              reportPreviousState);
          }
          break;
        case selectorProperties.commandCancel:
          break;
        case selectorProperties.commandError:
          errorService.handleError(response.error);
          break;
        case REFRESH_CACHE_COMMAND:
          this.handleRefreshCacheCommand();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      errorService.handleError(error);
    } finally {
      reduxStore.dispatch({ type: officeProperties.actions.popupHidden });
      reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
    }
  };

  handleRefreshCacheCommand = () => {
    const { dispatch, getState } = reduxStore;
    refreshCache()(dispatch, getState);
  }

  handleUpdateCommand = async ({
    dossierData,
    reportId,
    projectId,
    reportSubtype,
    body,
    reportName,
    promptsAnswers,
    isPrompted,
    instanceId,
    importSubtotal,
  }) => {
    if (reportId && projectId && reportSubtype && body && reportName) {
      reduxStore.dispatch({
        type: START_REPORT_LOADING,
        data: { name: reportName },
      });
      const options = {
        isPrompted,
        promptsAnswers,
        dossierData,
        objectId: reportId,
        projectId,
        instanceId,
        mstrObjectType: mstrObjectEnum.getMstrTypeBySubtype(reportSubtype),
        body,
        importSubtotal,
      };
      const result = await officeDisplayService.printObject(options);
      if (result) {
        notificationService.displayNotification({ type: result.type, content: result.message });
      }
      reduxStore.dispatch({ type: STOP_REPORT_LOADING });
    }
  };

  handleOkCommand = async (
    {
      chosenObject,
      dossierData,
      chosenProject,
      chosenSubtype,
      isPrompted,
      promptsAnswers,
      reportName,
      visualizationInfo,
      preparedInstanceId,
    },
    bindingId,
  ) => {
    if (chosenObject) {
      reduxStore.dispatch({ type: officeProperties.actions.startLoading });
      reduxStore.dispatch({
        type: START_REPORT_LOADING,
        data: { name: reportName },
      });
      const options = {
        dossierData,
        objectId: chosenObject,
        projectId: chosenProject,
        mstrObjectType: mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype),
        bindingId,
        isRefresh: false,
        isPrompted,
        promptsAnswers,
        visualizationInfo,
        preparedInstanceId,
      };
      const result = await officeDisplayService.printObject(options);
      if (result) {
        notificationService.displayNotification({ type: result.type, content: result.message });
      }
      reduxStore.dispatch({ type: STOP_REPORT_LOADING });
    }
  };

  loadPending = (wrapped) => async (...args) => {
    this.runPopup(PopupTypeEnum.loadingPage, 30, 40);
    return await wrapped(...args);
  };

  closeDialog = (dialog) => {
    try {
      return dialog.close();
    } catch (e) {
      console.log('Attempted to close an already closed dialog');
    }
  };

  _getReportsPreviousState = (reportParams) => {
    const currentReportArray = reduxStore.getState().officeReducer.reportArray;
    const indexOfOriginalValues = currentReportArray.findIndex((report) => report.bindId === reportParams.bindId);
    const originalValues = currentReportArray[indexOfOriginalValues];
    return { ...originalValues };
  }

  saveReportWithParams = async (reportParams, response, reportPreviousState) => {
    await officeStoreService.preserveReportValue(reportParams.bindId,
      'body',
      response.body);
    // if (reportPreviousState.subtotalInfo.importSubtotal !== response.subtotalInfo.importSubtotal) {
    //   await officeStoreService.preserveReportValue(reportParams.bindId,
    //     'importSubtotal',
    //     response.subtotalInfo.importSubtotal);
    // }
    if (response.promptsAnswers) {
      // Include new promptsAnswers in case of Re-prompt workflow
      reportParams.promptsAnswers = response.promptsAnswers;
      await officeStoreService.preserveReportValue(reportParams.bindId,
        'promptsAnswers',
        response.promptsAnswers);
    }
    const isErrorOnRefresh = await refreshReportsArray([reportParams], false)(reduxStore.dispatch);
    if (isErrorOnRefresh) {
      await officeStoreService.preserveReportValue(reportParams.bindId,
        'body',
        reportPreviousState.body);
    }
  }
}

export const popupController = new PopupController();
export const { loadPending } = popupController;
