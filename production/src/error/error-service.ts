import { PopupTypes } from '@mstr/connector-components';

import { authenticationService } from '../authentication/authentication-service';
import { dialogControllerHelper } from '../dialog/dialog-controller-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { pageByHelper } from '../page-by/page-by-helper';

import { reduxStore } from '../store';

import { PageByDisplayType } from '../page-by/page-by-types';
import {
  OperationData,
  OperationState,
} from '../redux-reducer/operation-reducer/operation-reducer-types';
import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';

import i18n from '../i18n';
import { getNotificationButtons } from '../notification/notification-buttons';
import { OperationTypes } from '../operation/operation-type-names';
import {
  clearGlobalNotification,
  createSessionExpiredNotification,
  deleteObjectNotification,
  dismissAllObjectsNotifications,
  displayGlobalNotification,
  displayObjectWarning,
} from '../redux-reducer/notification-reducer/notification-action-creators';
import { cancelOperation } from '../redux-reducer/operation-reducer/operation-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { clearRepromptTask } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';
import {
  errorMessageFactory,
  ErrorMessages,
  ErrorType,
  getIsPageByAttributeNumberChangedError,
  httpStatusToErrorType,
  IncomingErrorStrings,
  stringMessageToErrorType,
} from './constants';

const COLUMN_EXCEL_API_LIMIT = 5000;
const TIMEOUT = 3000;

interface Options {
  isLogout?: boolean;
  dialogType?: DialogType | null;
  dialog?: Office.Dialog | null;
  objectWorkingId?: number | null;
  callback?: (() => Promise<void>) | null;
  operationData?: OperationData | null;
}

class ErrorService {
  /**
   * Main function to handle errors
   *
   * @param error Error object that was thrown
   * @param options Object with additional options
   */
  handleError = async (error: any, options: Options = {}): Promise<void> => {
    const { isLogout, dialogType, dialog, objectWorkingId, callback, operationData } = options;
    const errorType = this.getErrorType(error, operationData);
    const errorMessage = errorMessageFactory(errorType)({ error });
    const details = this.getErrorDetails(error, errorMessage);

    const shouldCloseDialog =
      dialogType === DialogType.importedDataOverview &&
      [ErrorType.UNAUTHORIZED_ERR, ErrorType.CONNECTION_BROKEN_ERR].includes(errorType);

    if (objectWorkingId) {
      this.handleErrorBasedOnType(
        errorType,
        objectWorkingId,
        errorMessage,
        details,
        callback,
        dialog
      );
    } else {
      this.displayErrorNotification(error, errorType, errorMessage);
    }

    this.closeDialogIfOpen(dialog, shouldCloseDialog);
    this.checkForLogout(errorType, isLogout);
  };

  handleErrorBasedOnType(
    errorType: ErrorType,
    objectWorkingId: number,
    errorMessage: any,
    details: string,
    callback: () => Promise<void>,
    dialog: Office.Dialog
  ): void {
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
    } else if (errorType === ErrorType.PAGE_BY_DUPLICATE_ERR) {
      this.handlePageByDuplicateError(objectWorkingId, callback);
    } else if (errorType === ErrorType.PAGE_BY_IMPORT_ERR) {
      this.handlePageByImportError(objectWorkingId, errorMessage, callback);
    } else {
      const { isDataOverviewOpen } = reduxStore?.getState()?.popupStateReducer || {};

      // Only in Overview dialog, close reprompt dialog to show any error derived
      // from interaction with Prompts' dialog.
      if (isDataOverviewOpen) {
        this.closePromptsDialogInOverview();
      }

      // Mainly for Reprompt All workflow but covers others, close dialog if somehow remained open
      this.closeDialogIfOpen(dialog, !isDataOverviewOpen);
      // Show warning notification
      reduxStore.dispatch(
        // @ts-expect-error
        displayObjectWarning(objectWorkingId, {
          title: errorMessage,
          message: details,
          callback,
        })
      );
    }
  }

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

    const { operations } = reduxStore.getState().operationReducer as OperationState;
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
   * Handles page by import error
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   * @param errorMessage Error message details
   * @param callback Function to be called after click on warning notification
   */
  handlePageByImportError = (
    objectWorkingId: number,
    errorMessage: string,
    callback: () => Promise<void>
  ): void => {
    const popupData = {
      type: PopupTypes.FAILED_TO_IMPORT,
      errorDetails: errorMessage,
      objectWorkingId,
      callback,
    };

    this.clearOperationsForPageBySiblings(objectWorkingId);

    officeReducerHelper.displayPopup(popupData);
  };

  /**
   * Handles page by duplicate error
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   * @param callback Function to be called after click on warning notification
   */
  handlePageByDuplicateError = (objectWorkingId: number, callback: () => Promise<void>): void => {
    const { sourceObject } = pageByHelper.getAllPageByObjects(objectWorkingId);
    const popupData = {
      type: PopupTypes.FAILED_TO_DUPLICATE,
      selectedObjects: [sourceObject],
      objectWorkingId,
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
    const { operations } = reduxStore.getState().operationReducer;

    for (const sibling of pageBySiblings) {
      const isThereOperationForSibling = operations.some(
        (operation: OperationData) => operation.objectWorkingId === sibling.objectWorkingId
      );
      if (isThereOperationForSibling) {
        reduxStore.dispatch(cancelOperation(sibling.objectWorkingId));
        reduxStore.dispatch(deleteObjectNotification(sibling.objectWorkingId));
      }
    }
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
    const pageByError = this.getPageByError(operationData, updateError);

    return (
      pageByError ||
      updateError.type ||
      this.getOfficeErrorType(updateError) ||
      this.getRestErrorType(updateError)
    );
  };

  /**
   * Return ErrorType based on the error and operation type
   * @param error Error object that was thrown
   * @param operationData Data about the operation that was performed
   * @returns ErrorType
   */
  getPageByError = (operationData: OperationData, error: any): ErrorType => {
    const object = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(
      operationData?.objectWorkingId
    );

    // Objects imported as default page should be treated like regular objects
    // and Page-by error handling should not apply to them
    if (object?.pageByData?.pageByDisplayType === PageByDisplayType.DEFAULT_PAGE) {
      return;
    }

    switch (operationData?.operationType) {
      case OperationTypes.REFRESH_OPERATION:
        if (getIsPageByAttributeNumberChangedError(error)) {
          return ErrorType.PAGE_BY_REFRESH_ERR;
        }
        break;
      case OperationTypes.DUPLICATE_OPERATION:
        if (getIsPageByAttributeNumberChangedError(error)) {
          return ErrorType.PAGE_BY_DUPLICATE_ERR;
        }
        break;
      case OperationTypes.IMPORT_OPERATION:
        if (object?.pageByData) {
          return ErrorType.PAGE_BY_IMPORT_ERR;
        }
        break;
      default:
        break;
    }
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
      reduxStore.dispatch(createSessionExpiredNotification());
      return;
    }
    const payload = this.createNotificationPayload(errorMessage, details);
    payload.children = this.getChildrenButtons();
    reduxStore.dispatch(displayGlobalNotification(payload));
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
        onClick: () => reduxStore.dispatch(clearGlobalNotification()),
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
  getErrorMessage = (error: any): ErrorMessages => {
    const errorType = this.getErrorType(error);
    return errorMessageFactory(errorType)({ error });
  };

  /**
   * Function logging out user from the application
   */
  async fullLogOut(): Promise<void> {
    reduxStore.dispatch(dismissAllObjectsNotifications());
    await authenticationService.logOutRest(this);
    sessionActions.logOut();
    authenticationService.logOutRedirect();
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
          reduxStore.dispatch(clearGlobalNotification());
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
  closeDialogIfOpen = (dialog: Office.Dialog, shouldClose: boolean): void => {
    const storeState = reduxStore.getState();
    const { isDialogOpen } = storeState.officeReducer;

    if (isDialogOpen && shouldClose) {
      const isDialogOpenForReprompt = storeState.repromptsQueueReducer?.total > 0;

      dialog && dialogControllerHelper.closeDialog(dialog);
      dialogControllerHelper.resetDialogStates();
      // clear Reprompt task queue if in Reprompt All workflow
      isDialogOpenForReprompt && reduxStore.dispatch(clearRepromptTask());
    }
  };

  /**
   * Close/hide Reprompt dialog only in Overview window if an error has occured
   * and needs to be displayed in Overview. Normally, it's triggered when reprompting dossier/report
   * and user interacts with Prompts' dialog or cube is not published or dossier/report is not
   * available in the environment as it was deleted at the time of reprompting.
   */
  closePromptsDialogInOverview = (): void => {
    const { repromptsQueueReducer, popupStateReducer } = reduxStore.getState();

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
        (popupType === DialogType.repromptDossierDataOverview ||
          popupType === DialogType.repromptReportDataOverview)
      ) {
        // @ts-expect-error
        reduxStore.dispatch(popupStateActions.setPopupType(DialogType.importedDataOverview));
        dialogControllerHelper.clearPopupStateIfNeeded();
      }
    }
  };
}

export const errorService = new ErrorService();
