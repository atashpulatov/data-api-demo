import { selectorProperties } from '../attribute-selector/selector-properties';
import { officeDisplayService } from '../office/office-display-service';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { notificationService } from '../notification/notification-service';
import { errorService } from '../error/error-handler';
import { authenticationHelper } from '../authentication/authentication-helper';
import { officeProperties } from '../office/store/office-properties';
import { officeApiHelper } from '../office/api/office-api-helper';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { officeStoreService } from '../office/store/office-store-service';
import { LOAD_BROWSING_STATE_CONST, changeSorting } from '../navigation/navigation-tree-actions';
import { REFRESH_CACHE_COMMAND, refreshCache } from '../cache/cache-actions';
import {
  START_REPORT_LOADING,
  STOP_REPORT_LOADING,
  RESET_STATE,
} from './popup-actions';
import { CLEAR_POPUP_STATE, SET_MSTR_DATA } from './popup-state-actions';

const URL = `${window.location.href}`;

/* global Office */

class PopupController {
  constructor(excelXtabsBorderColor) {
    this.EXCEL_XTABS_BORDER_COLOR = excelXtabsBorderColor;
  }

  init = (reduxStore, sessionHelper, popupAction) => {
    this.reduxStore = reduxStore;
    this.sessionHelper = sessionHelper;
    this.popupAction = popupAction;
  }

  runPopupNavigation = async () => {
    // DE159475; clear sorting before popup display until it's fixed in object-table
    this.reduxStore.dispatch(changeSorting({}));
    this.reduxStore.dispatch({ type: CLEAR_POPUP_STATE });
    await this.runPopup(PopupTypeEnum.navigationTree, 80, 80);
  };

  runEditFiltersPopup = async (reportParams) => {
    await this.runPopup(PopupTypeEnum.editFilters, 80, 80, reportParams);
  };

  runRepromptPopup = async (reportParams) => {
    this.reduxStore.dispatch({ type: SET_MSTR_DATA, payload: { isReprompt: true } });
    await this.runPopup(PopupTypeEnum.repromptingWindow, 80, 80, reportParams);
  };

  runEditDossierPopup = async (reportParams) => {
    await this.runPopup(PopupTypeEnum.dossierWindow, 80, 80, reportParams);
  };

  runPopup = async (popupType, height, width, reportParams = null) => {
    const session = this.sessionHelper.getSession();
    this.reduxStore.dispatch({ type: SET_MSTR_DATA, payload: { popupType } });
    try {
      await authenticationHelper.validateAuthToken();
    } catch (error) {
      console.error({ error });

      this.reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
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
          this.sessionHelper.setDialog(dialog);
          console.timeEnd('Popup load time');
          dialog.addEventHandler(Office.EventType.DialogMessageReceived,
            this.onMessageFromPopup.bind(null, dialog, reportParams));

          dialog.addEventHandler(
            // Event received on dialog close
            Office.EventType.DialogEventReceived,
            () => {
              this.reduxStore.dispatch({ type: RESET_STATE });
              this.reduxStore.dispatch({ type: officeProperties.actions.popupHidden });
              this.reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
            }
          );
          this.reduxStore.dispatch({ type: officeProperties.actions.popupShown });
        });
    } catch (error) {
      this.reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
      errorService.handleError(error);
    }
  };

  onMessageFromPopup = async (dialog, reportParams, arg) => {
    const { message } = arg;
    const response = JSON.parse(message);
    if (response.command === selectorProperties.commandBrowseUpdate) {
      this.reduxStore.dispatch({ type: LOAD_BROWSING_STATE_CONST, browsingState: response.body });
      return;
    }
    try {
      if (response.command !== REFRESH_CACHE_COMMAND) { await this.closeDialog(dialog); }
      if (response.command !== selectorProperties.commandError) {
        await officeApiHelper.getExcelSessionStatus(); // checking excel session status
      }
      await authenticationHelper.validateAuthToken();
      switch (response.command) {
      case selectorProperties.commandOk:
        if (!reportParams) {
          await this.handleOkCommand(response, reportParams);
        } else {
          const reportPreviousState = this.getReportsPreviousState(reportParams);
          await this.saveReportWithParams(reportParams, response, reportPreviousState);
        }
        break;
      case selectorProperties.commandOnUpdate:
        if (!reportParams) {
          await this.handleUpdateCommand(response);
        } else {
          const reportPreviousState = this.getReportsPreviousState(reportParams);
          await this.saveReportWithParams(reportParams, response, reportPreviousState);
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
      this.reduxStore.dispatch({ type: RESET_STATE });
      if (response.command !== REFRESH_CACHE_COMMAND) {
        this.reduxStore.dispatch({ type: officeProperties.actions.popupHidden });
        this.reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
      }
    }
  };

  handleRefreshCacheCommand = () => {
    const { dispatch, getState } = this.reduxStore;
    refreshCache()(dispatch, getState);
  }

  handleUpdateCommand = async ({
    dossierData,
    chosenObjectId,
    projectId,
    chosenObjectSubtype,
    body,
    chosenObjectName,
    promptsAnswers,
    isPrompted,
    instanceId,
    subtotalsInfo,
    displayAttrFormNames
  }) => {
    if (chosenObjectId && projectId && chosenObjectSubtype && body && chosenObjectName) {
      this.reduxStore.dispatch({
        type: START_REPORT_LOADING,
        data: { name: chosenObjectName },
      });
      const options = {
        isPrompted,
        promptsAnswers,
        dossierData,
        objectId: chosenObjectId,
        projectId,
        instanceId,
        mstrObjectType: mstrObjectEnum.getMstrTypeBySubtype(chosenObjectSubtype),
        body,
        subtotalsInfo,
        displayAttrFormNames
      };
      const result = await officeDisplayService.printObject(options);
      if (result) {
        notificationService.displayNotification({ type: result.type, content: result.message });
      }
      this.reduxStore.dispatch({ type: STOP_REPORT_LOADING });
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
      chosenObjectName,
      visualizationInfo,
      preparedInstanceId,
    },
    bindingId,
  ) => {
    if (chosenObject) {
      this.reduxStore.dispatch({ type: officeProperties.actions.startLoading });
      this.reduxStore.dispatch({
        type: START_REPORT_LOADING,
        data: { name: chosenObjectName },
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
      this.reduxStore.dispatch({ type: STOP_REPORT_LOADING });
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
  }

  saveReportWithParams = async (reportParams, response, reportPreviousState) => {
    const { preserveReportValue } = officeStoreService;

    await preserveReportValue(reportParams.bindId, 'body', response.body);

    if (!response.visualizationInfo
      && reportPreviousState.subtotalsInfo.importSubtotal !== response.subtotalsInfo.importSubtotal) {
      const subtotalsInformation = { ...reportPreviousState.subtotalsInfo };
      subtotalsInformation.importSubtotal = response.subtotalsInfo.importSubtotal;
      await preserveReportValue(reportParams.bindId, 'subtotalsInfo', subtotalsInformation);
    }

    if (reportPreviousState.displayAttrFormNames !== response.displayAttrFormNames) {
      await preserveReportValue(reportParams.bindId, 'displayAttrFormNames', response.displayAttrFormNames);
    }

    if (response.promptsAnswers) {
      // Include new promptsAnswers in case of Re-prompt workflow
      reportParams.promptsAnswers = response.promptsAnswers;
      await preserveReportValue(reportParams.bindId, 'promptsAnswers', response.promptsAnswers);
    }

    if (response.isEdit) {
      if (reportPreviousState.visualizationInfo.visualizationKey !== response.visualizationInfo.visualizationKey) {
        response.visualizationInfo.nameShouldUpdate = true;
        response.visualizationInfo.formatShouldUpdate = true;
        await preserveReportValue(reportParams.bindId, 'visualizationInfo', response.visualizationInfo);
      }
      await preserveReportValue(reportParams.bindId, 'preparedInstanceId', response.preparedInstanceId);
      await preserveReportValue(reportParams.bindId, 'isEdit', false);
    }

    const { reduxStore, popupAction } = this;
    const isErrorOnRefresh = await popupAction.refreshReportsArray([reportParams], false)(reduxStore.dispatch);

    if (isErrorOnRefresh) {
      if (reportPreviousState.objectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
        await preserveReportValue(reportParams.bindId, 'manipulationsXML', reportPreviousState.manipulationsXML);
        await preserveReportValue(reportParams.bindId, 'visualizationInfo', reportPreviousState.visualizationInfo);
      } else {
        await preserveReportValue(reportParams.bindId, 'body', reportPreviousState.body);
      }
    }
  }
}

export const popupController = new PopupController();
export const { loadPending } = popupController;
