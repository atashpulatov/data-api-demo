import { PopupTypes } from '@mstr/connector-components';

import { authenticationHelper } from '../authentication/authentication-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { pageByHelper } from '../page-by/page-by-helper';

import {
  OperationData,
  OperationState,
} from '../redux-reducer/operation-reducer/operation-reducer-types';
import { PopupTypeEnum } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';

import i18n from '../i18n';
import { getNotificationButtons } from '../notification/notification-buttons';
import { OperationTypes } from '../operation/operation-type-names';
import { deleteObjectNotification } from '../redux-reducer/notification-reducer/notification-action-creators';
import { cancelOperation } from '../redux-reducer/operation-reducer/operation-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { clearRepromptTask } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';
import {
  errorMessageFactory,
  ErrorMessages,
  ErrorType,
  getIsPageByRefreshError,
  httpStatusToErrorType,
  IncomingErrorStrings,
  stringMessageToErrorType,
} from './constants';

const CONNECTION_CHECK_TIMEOUT = 3000;
const COLUMN_EXCEL_API_LIMIT = 5000;
const TIMEOUT = 3000;

class ErrorService {
  sessionActions: any;

  sessionHelper: any;

  notificationService: any;

  popupController: any;

  reduxStore: any;

  homeHelper: any;

  init(
    sessionActions: any,
    sessionHelper: any,
    notificationService: any,
    popupController: any,
    reduxStore: any,
    homeHelper: any
  ): void {
    this.sessionActions = sessionActions;
    this.sessionHelper = sessionHelper;
    this.notificationService = notificationService;
    this.popupController = popupController;
    this.reduxStore = reduxStore;
    this.homeHelper = homeHelper;
  }

  /**
   * Handles error thrown during invoking side panel actions like refresh, edit etc.
   * For Webkit based clients (Safari, Excel for Mac)
   * it checks for network connection with custom implementation
   * This logic allows us to provide user with connection lost notification
   *
   * @param error Plain error object thrown by method calls.
   */
  handleSidePanelActionError = (error: any): void => {
    const castedError = String(error);
    const { CONNECTION_BROKEN } = IncomingErrorStrings;
    if (castedError.includes(CONNECTION_BROKEN)) {
      if (this.homeHelper.isMacAndSafariBased()) {
        const connectionCheckerLoop = (): void => {
          const checkInterval = setInterval(() => {
            authenticationHelper.doesConnectionExist(checkInterval);
          }, CONNECTION_CHECK_TIMEOUT);
        };

        connectionCheckerLoop();
      }
      return;
    }
    this.handleError(error);
  };

  /**
   * Handles error that is related to specific object on side panel
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   * @param error Error object that was thrown
   * @param callback Function to be called after clikc on warning notification
   * @param operationData Data about the operation that was performed
   */
  handleObjectBasedError = async (
    objectWorkingId: number,
    error: any,
    callback: () => Promise<void>,
    operationData: OperationData
  ): Promise<void> => {
    const errorType = this.getErrorType(error, operationData);
    if (error.Code === 5012) {
      this.handleError(error);
    }
    const errorMessage = errorMessageFactory(errorType)({ error });
    const details = this.getErrorDetails(error, errorMessage);

    if (errorType === ErrorType.OVERLAPPING_TABLES_ERR) {
      const popupData = {
        type: PopupTypes.RANGE_TAKEN,
        objectWorkingId,
        title: errorMessage,
        message: details,
        callback,
      };

      officeReducerHelper.displayPopup(popupData);
    } else if (errorType === ErrorType.PAGE_BY_REFRESH_ERR) {
      this.handlePageByRefreshError(objectWorkingId, errorMessage, details, callback);
    } else {
      const { isDataOverviewOpen } = this.reduxStore?.getState()?.popupStateReducer || {};

      // Only in Overview dialog, close reprompt dialog to show any error derived
      // from interaction with Prompts' dialog.
      if (isDataOverviewOpen) {
        this.closePromptsDialogInOverview();
      }

      // Mainly for Reprompt All workflow but covers others, close dialog if somehow remained open
      await this.closePopupIfOpen(!isDataOverviewOpen);
      // Show warning notification
      this.notificationService.showObjectWarning(objectWorkingId, {
        title: errorMessage,
        message: details,
        callback,
      });
    }
  };

  /**
   * Handles page by refresh error
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   * @param errorMessage Error message string
   * @param details Error message details
   * @param callback Function to be called after click on warning notification
   */
  handlePageByRefreshError = (
    objectWorkingId: number,
    errorMessage: string,
    details: string,
    callback: () => Promise<void>
  ): void => {
    let selectedObjects = null;

    const { pageBySiblings, sourceObject } = pageByHelper.getAllPageByObjects(objectWorkingId);
    const allPageByObjects = [sourceObject, ...pageBySiblings];

    const { operations } = this.reduxStore.getState().operationReducer as OperationState;
    for (const sibling of pageBySiblings) {
      const isThereOperationForSibling = operations.some(
        operation => operation.objectWorkingId === sibling.objectWorkingId
      );
      if (isThereOperationForSibling) {
        selectedObjects = allPageByObjects;
      }
    }

    const popupData = {
      type: PopupTypes.FAILED_TO_REFRESH_PAGES,
      objectWorkingId,
      title: errorMessage,
      message: details,
      selectedObjects,
      callback,
    };

    this.clearOperationsForPageBySiblings(objectWorkingId);

    officeReducerHelper.displayPopup(popupData);
  };

  /**
   * Clears operations for all Page-by siblings of the source object
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  clearOperationsForPageBySiblings = (objectWorkingId: number): void => {
    const { pageBySiblings } = pageByHelper.getAllPageByObjects(objectWorkingId);

    const { operations } = this.reduxStore.getState().operationReducer;

    for (const sibling of pageBySiblings) {
      const isThereOperationForSibling = operations.some(
        (operation: OperationData) => operation.objectWorkingId === sibling.objectWorkingId
      );
      if (isThereOperationForSibling) {
        this.reduxStore.dispatch(cancelOperation(sibling.objectWorkingId));
        this.reduxStore.dispatch(deleteObjectNotification(sibling.objectWorkingId));
      }
    }
  };

  /**
   * Maion function to handle errors
   *
   * @param error Error object that was thrown
   * @param options Object with additional options
   */
  // TODO combine with handleObjectBasedError
  handleError = async (
    error: any,
    options = {
      chosenObjectName: 'Report',
      isLogout: false,
      dialogType: null as any,
    }
  ): Promise<void> => {
    const { isLogout, dialogType, ...parameters } = options;
    const errorType = this.getErrorType(error);
    const errorMessage = errorMessageFactory(errorType)({
      error,
      ...parameters,
    });

    const shouldClosePopup =
      dialogType === PopupTypeEnum.importedDataOverview &&
      [ErrorType.UNAUTHORIZED_ERR, ErrorType.CONNECTION_BROKEN_ERR].includes(errorType);

    await this.closePopupIfOpen(shouldClosePopup);

    this.displayErrorNotification(error, errorType, errorMessage);
    this.checkForLogout(errorType, isLogout);
  };

  /**
   * Return ErrorType based on the error
   *
   * @param error Error object that was thrown
   * @param operationData Data about the operation that was performed
   * @returns ErrorType
   */
  getErrorType = (error: any, operationData?: OperationData): ErrorType => {
    const updateError = this.getExcelError(error, operationData);
    return (
      updateError.type || this.getOfficeErrorType(updateError) || this.getRestErrorType(updateError)
    );
  };

  /**
   * Extracts error details from the error object
   *
   * @param error Error object that was thrown
   * @params errorMessage Error message
   * @returns error details to display
   */
  getErrorDetails = (error: any, errorMessage: string): string => {
    const errorDetails = (error.response && error.response.text) || error.message || '';
    let details;
    const {
      EXCEEDS_EXCEL_API_LIMITS,
      SHEET_HIDDEN,
      TABLE_OVERLAP,
      INVALID_VIZ_KEY_MESSAGE,
      NOT_IN_METADATA,
      EMPTY_REPORT,
    } = ErrorMessages;
    switch (errorMessage) {
      case EXCEEDS_EXCEL_API_LIMITS:
      case SHEET_HIDDEN:
      case TABLE_OVERLAP:
      case INVALID_VIZ_KEY_MESSAGE:
      case NOT_IN_METADATA:
      case EMPTY_REPORT:
        details = '';
        break;
      default:
        details = errorMessage !== errorDetails ? errorDetails : '';
        break;
    }
    return details;
  };

  /**
   * dsiaply global notifiacation with error message
   *
   * @param error Error object that was thrown
   * @param type Type of the error
   * @param errorMessage Error message
   */
  displayErrorNotification = (error: any, type: ErrorType, errorMessage = ''): void => {
    const errorDetails = (error.response && error.response.text) || error.message || '';
    const details = errorMessage !== errorDetails ? errorDetails : '';
    if (type === ErrorType.UNAUTHORIZED_ERR) {
      this.notificationService.sessionExpired();
      return;
    }
    const payload = this.createNotificationPayload(errorMessage, details);
    payload.children = this.getChildrenButtons();
    this.notificationService.globalWarningAppeared(payload);
  };

  /**
   * Creates object containing buttons for the notification
   * @returns Object with notification button data
   */
  getChildrenButtons = (): any =>
    getNotificationButtons([
      {
        type: 'basic',
        label: i18n.t('OK'),
        onClick: () => this.notificationService.globalNotificationDissapear(),
      },
    ]);

  /**
   * Trigger logout based on error type
   *
   * @param errorType type of error
   * @param isLogout Flag indicating whether to log out user
   */
  checkForLogout = (errorType: ErrorType, isLogout = false): void => {
    if (!isLogout && [ErrorType.UNAUTHORIZED_ERR].includes(errorType)) {
      setTimeout(() => {
        this.fullLogOut();
      }, TIMEOUT);
    }
  };

  /**
   * Function getting errors that occurs in Office operations.
   *
   * @param error Error object that was thrown
   */
  getOfficeErrorType = (error: any): string => {
    console.warn({ error });

    if (error.name === 'RichApi.Error') {
      return stringMessageToErrorType(error.message);
    }
    return null;
  };

  /**
   * Function getting errors that occurs in types of operations.
   * Transform the error that happens when import too many columns and fail in context.sync.
   *
   * @param error Error thrown during the operation execution
   * @param operationData Contains informatons about current operation
   */
  getExcelError = (error: any, operationData: OperationData): any => {
    const { name, code, debugInfo } = error;
    const isExcelApiError =
      name === 'RichApi.Error' &&
      code === 'GeneralException' &&
      debugInfo.message === 'An internal error has occurred.';
    const exceedLimit =
      operationData &&
      operationData.instanceDefinition &&
      operationData.instanceDefinition.columns > COLUMN_EXCEL_API_LIMIT;
    let updateError;
    switch (operationData && operationData.operationType) {
      case OperationTypes.IMPORT_OPERATION:
      case OperationTypes.DUPLICATE_OPERATION:
      case OperationTypes.REFRESH_OPERATION:
      case OperationTypes.EDIT_OPERATION:
        if (isExcelApiError && exceedLimit) {
          updateError = { ...error, type: 'exceedExcelApiLimit', message: '' };
        } else {
          updateError = error;
        }
        break;
      default:
        updateError = error;
        break;
    }
    return updateError;
  };

  /**
   * Function getting errors that occurs in REST requests.
   *
   * @param error Error object that was thrown
   * @returns ErrorType
   */
  getRestErrorType = (error: any): ErrorType => {
    if (!error.status && !error.response) {
      if (error.message && error.message.includes(IncomingErrorStrings.CONNECTION_BROKEN)) {
        return ErrorType.CONNECTION_BROKEN_ERR;
      }
      return null;
    }
    const operation = this.reduxStore.getState().operationReducer.operations[0];
    const isPageByRefreshError =
      operation?.operationType === OperationTypes.REFRESH_OPERATION &&
      getIsPageByRefreshError(error);

    if (isPageByRefreshError) {
      return ErrorType.PAGE_BY_REFRESH_ERR;
    }

    const status = error.status || (error.response ? error.response.status : null);
    return httpStatusToErrorType(status);
  };

  /**
   * Function getting error message based on the error type
   *
   * @param error Error object that was thrown
   * @param options Object with additional options
   * @returns Error message
   */
  getErrorMessage = (error: any, options = { chosenObjectName: 'Report' }): ErrorMessages => {
    const errorType = this.getErrorType(error);
    return errorMessageFactory(errorType)({ error, ...options });
  };

  /**
   * Function logging out user from the application
   */
  async fullLogOut(): Promise<void> {
    this.notificationService.dismissNotifications();
    await this.sessionHelper.logOutRest();
    this.sessionActions.logOut();
    this.sessionHelper.logOutRedirect();
  }

  /**
   * Function creating payload for the notification
   *
   * @param message Title of the notification
   * @param details Details of the notification
   * @returns Object with notification payload
   */
  createNotificationPayload = (message: string, details: string): any => {
    const buttons = [
      {
        title: 'Ok',
        type: 'basic',
        label: 'Ok',
        onClick: () => {
          this.notificationService.globalNotificationDissapear();
        },
      },
    ];
    const payload = {
      title: message,
      details,
      buttons,
    };
    return payload;
  };

  /**
   * Function checking if the dialog is open and closing it if it is.
   * Also clearing Reprompt task queue if dialog was open for Reprompt workflow.
   * * @param shouldClose flag indicated whether to close the dialog or not
   */
  closePopupIfOpen = async (shouldClose: boolean): Promise<void> => {
    const storeState = this.reduxStore.getState();

    const { isDialogOpen } = storeState.officeReducer;

    if (isDialogOpen && shouldClose) {
      const isDialogOpenForReprompt = storeState.repromptsQueueReducer?.total > 0;

      await this.popupController.closeDialog(this.popupController.dialog);
      this.popupController.resetDialogStates();
      // clear Reprompt task queue if in Reprompt All workflow
      isDialogOpenForReprompt && this.reduxStore.dispatch(clearRepromptTask());
    }
  };

  /**
   * Close/hide Reprompt dialog only in Overview window if an error has occured
   * and needs to be displayed in Overview. Normally, it's triggered when reprompting dossier/report
   * and user interacts with Prompts' dialog or cube is not published or dossier/report is not
   * available in the environment as it was deleted at the time of reprompting.
   */
  closePromptsDialogInOverview = (): void => {
    const { repromptsQueueReducer, popupStateReducer } = this.reduxStore.getState();

    // Verify if there are any reprompts in queue to determine whether it's multiple re-prompt
    // triggered from overview (popupType is set to repromptDossierDataOverview or
    // repromptReportDataOverviewDataOverview).
    if (repromptsQueueReducer?.total && popupStateReducer?.popupType) {
      const { total } = repromptsQueueReducer;
      const { popupType } = popupStateReducer;

      // Show Overview table if there are any reprompts in queue if error occured
      // while reprompting dossier/report in Overview window only.
      if (
        total > 0 &&
        (popupType === PopupTypeEnum.repromptDossierDataOverview ||
          popupType === PopupTypeEnum.repromptReportDataOverview)
      ) {
        this.reduxStore.dispatch(
          popupStateActions.setPopupType(PopupTypeEnum.importedDataOverview)
        );
        this.popupController.runImportedDataOverviewPopup();
      }
    }
  };
}

export const errorService = new ErrorService();
