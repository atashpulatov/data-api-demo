import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { errorService } from '../error/error-handler';
import { authenticationHelper } from '../authentication/authentication-helper';
import { officeProperties } from '../redux-reducer/office-reducer/office-properties';
import { officeApiHelper } from '../office/api/office-api-helper';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { LOAD_BROWSING_STATE_CONST, changeSorting } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { REFRESH_CACHE_COMMAND, refreshCache } from '../redux-reducer/cache-reducer/cache-actions';
import { RESET_STATE } from '../redux-reducer/popup-reducer/popup-actions';
import { CLEAR_POPUP_STATE, SET_MSTR_DATA } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { importRequested, editRequested, duplicateRequested } from '../redux-reducer/operation-reducer/operation-actions';


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
      Office.context.ui.displayDialogAsync(`${splittedUrl[0]}?popupType=${popupType}`,
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
          } else if (reportParams.duplicateMode) {
            await this.handleDuplicate(response, reportParams);
          } else {
            const reportPreviousState = this.getObjectPreviousState(reportParams);
            this.reduxStore.dispatch(editRequested(reportPreviousState, response));
          }
          break;
        case selectorProperties.commandOnUpdate:
          if (!reportParams) {
            await this.handleUpdateCommand(response);
          } else if (reportParams.duplicateMode) {
            await this.handleDuplicate(response, reportParams);
          } else {
            const reportPreviousState = this.getObjectPreviousState(reportParams);
            this.reduxStore.dispatch(editRequested(reportPreviousState, response));
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

  handleUpdateCommand = async (response) => {
    const objectData = {
      name: response.chosenObjectName,
      objectId: response.chosenObjectId,
      projectId: response.projectId,
      mstrObjectType: mstrObjectEnum.getMstrTypeBySubtype(response.chosenObjectSubtype),
      body: response.body,
      dossierData: response.dossierData,
      promptsAnswers: response.promptsAnswers,
      isPrompted: response.isPrompted,
      instanceId: response.instanceId,
      subtotalsInfo: response.subtotalsInfo,
      displayAttrFormNames: response.displayAttrFormNames,
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
        isPrompted: response.isPrompted,
        promptsAnswers: response.promptsAnswers,
        visualizationInfo: response.visualizationInfo,
        preparedInstanceId: response.preparedInstanceId,
      };
      this.reduxStore.dispatch(importRequested(objectData));
    }
  };

  handleDuplicate = async (response, reportParams) => {
    if (response.chosenObject || response.chosenObjectId) {
      const vizKeyChanged = response.visualizationInfo && response.visualizationInfo.visualizationKey
        && reportParams.visualizationInfo && reportParams.visualizationInfo.visualizationKey
        && response.visualizationInfo.visualizationKey !== reportParams.visualizationInfo.visualizationKey;
      // Use reportParams.name if provided to preserve viz name on duplicate edit without changing the selected viz
      const objectData = {
        name: reportParams.name || response.chosenObjectName,
        dossierData: response.dossierData,
        objectId: response.chosenObject || response.chosenObjectId,
        projectId: response.chosenProject || response.projectId,
        mstrObjectType: mstrObjectEnum.getMstrTypeBySubtype(response.chosenSubtype) || mstrObjectEnum.getMstrTypeBySubtype(response.chosenObjectSubtype),
        isPrompted: response.isPrompted,
        promptsAnswers: response.promptsAnswers,
        visualizationInfo: response.visualizationInfo,
        preparedInstanceId: response.preparedInstanceId,
        instanceId: response.instanceId,
        body: response.body,
        subtotalsInfo: response.subtotalsInfo,
        displayAttrFormNames: response.displayAttrFormNames,
        insertNewWorksheet: reportParams.insertNewWorksheet,
        vizKeyChanged,
      };
      this.reduxStore.dispatch(duplicateRequested(objectData));
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

  getObjectPreviousState = (reportParams) => {
    const { objects } = this.reduxStore.getState().objectReducer;
    const indexOfOriginalValues = objects.findIndex((report) => report.bindId === reportParams.bindId);
    const originalValues = objects[indexOfOriginalValues];
    const { displayAttrFormNames } = officeProperties;
    if (originalValues.displayAttrFormNames) {
      return { ...originalValues };
    }
    return { ...originalValues, displayAttrFormNames: displayAttrFormNames.automatic };
  }
}

export const popupController = new PopupController();
export const { loadPending } = popupController;
