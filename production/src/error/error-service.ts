import { PopupTypes } from '@mstr/connector-components';

import { authenticationService } from '../authentication/authentication-service';
import { dialogControllerHelper } from '../dialog/dialog-controller-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { pageByHelper } from '../page-by/page-by-helper';
import { errorServiceHelper } from './error-service-helper';

import { reduxStore } from '../store';

import {
  OperationData,
  OperationState,
} from '../redux-reducer/operation-reducer/operation-reducer-types';
import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';

import i18n from '../i18n';
import { getNotificationButtons } from '../notification/notification-buttons';
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
import { errorMessageFactory, ErrorType } from './constants';

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
    const errorType = errorServiceHelper.getErrorType(error, operationData);
    const errorMessage = errorMessageFactory(errorType)({ error });
    const details = errorServiceHelper.getErrorDetails(error, errorMessage);

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
