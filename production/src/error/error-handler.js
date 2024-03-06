import officeReducerHelper from "../office/store/office-reducer-helper";

import { customT } from "../customTranslation";
import { PopupTypeEnum } from "../home/popup-type-enum";
import { getNotificationButtons } from "../notification-v2/notification-buttons";
import {
  DUPLICATE_OPERATION,
  EDIT_OPERATION,
  IMPORT_OPERATION,
  REFRESH_OPERATION,
} from "../operation/operation-type-names";
import { clearRepromptTask } from "../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions";
import {
  errorMessageFactory,
  errorMessages,
  errorTypes,
  httpStatusToErrorType,
  incomingErrorStrings,
  stringMessageToErrorType,
} from "./constants";

const COLUMN_EXCEL_API_LIMIT = 5000;
const TIMEOUT = 3000;

class ErrorService {
  init = (
    sessionActions,
    sessionHelper,
    notificationService,
    popupController,
    reduxStore,
  ) => {
    this.sessionActions = sessionActions;
    this.sessionHelper = sessionHelper;
    this.notificationService = notificationService;
    this.popupController = popupController;
    this.reduxStore = reduxStore;
  };

  handleObjectBasedError = async (
    objectWorkingId,
    error,
    callback,
    operationData,
  ) => {
    const errorType = this.getErrorType(error, operationData);
    if (error.Code === 5012) {
      this.handleError(error);
    }

    const errorMessage = errorMessageFactory(errorType)({ error });
    const details = this.getErrorDetails(error, errorMessage, errorType);

    if (errorType === errorTypes.OVERLAPPING_TABLES_ERR) {
      const popupData = {
        objectWorkingId,
        title: errorMessage,
        message: details,
        callback,
      };

      officeReducerHelper.displayPopup(popupData);
    } else {
      const { isDataOverviewOpen } =
        this.reduxStore?.getState()?.popupStateReducer || {};

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

  // TODO combine with handleObjectBasedError
  handleError = async (
    error,
    options = {
      chosenObjectName: "Report",
      onConfirm: null,
      isLogout: false,
      dialogType: null,
    },
  ) => {
    const { onConfirm, isLogout, dialogType, ...parameters } = options;
    const errorType = this.getErrorType(error);
    const errorMessage = errorMessageFactory(errorType)({
      error,
      ...parameters,
    });

    const shouldClosePopup =
      dialogType === PopupTypeEnum.importedDataOverview &&
      [errorTypes.UNAUTHORIZED_ERR, errorTypes.CONNECTION_BROKEN_ERR].includes(
        errorType,
      );

    await this.closePopupIfOpen(shouldClosePopup);

    this.displayErrorNotification(error, errorType, errorMessage, onConfirm);
    this.checkForLogout(errorType, isLogout);
  };

  getErrorType = (error, operationData) => {
    const updateError = this.getExcelError(error, operationData);
    return (
      updateError.type ||
      this.getOfficeErrorType(updateError) ||
      this.getRestErrorType(updateError)
    );
  };

  getErrorDetails = (error, errorMessage) => {
    const errorDetails =
      (error.response && error.response.text) || error.message || "";
    let details;
    const {
      EXCEEDS_EXCEL_API_LIMITS,
      SHEET_HIDDEN,
      TABLE_OVERLAP,
      INVALID_VIZ_KEY_MESSAGE,
      NOT_IN_METADATA,
      EMPTY_REPORT,
    } = errorMessages;
    switch (errorMessage) {
      case EXCEEDS_EXCEL_API_LIMITS:
      case SHEET_HIDDEN:
      case TABLE_OVERLAP:
      case INVALID_VIZ_KEY_MESSAGE:
      case NOT_IN_METADATA:
      case EMPTY_REPORT:
        details = "";
        break;
      default:
        details = errorMessage !== errorDetails ? errorDetails : "";
        break;
    }
    return details;
  };

  displayErrorNotification = (error, type, message = "") => {
    const errorDetails =
      (error.response && error.response.text) || error.message || "";
    const details = message !== errorDetails ? errorDetails : "";
    if (type === errorTypes.UNAUTHORIZED_ERR) {
      this.notificationService.sessionExpired();
      return;
    }
    const payload = this.createNotificationPayload(message, details);
    payload.children = this.getChildrenButtons();
    this.notificationService.globalWarningAppeared(payload);
  };

  getChildrenButtons = () =>
    getNotificationButtons([
      {
        type: "basic",
        label: customT("OK"),
        onClick: () => this.notificationService.globalNotificationDissapear(),
      },
    ]);

  checkForLogout = (errorType, isLogout = false) => {
    if (!isLogout && [errorTypes.UNAUTHORIZED_ERR].includes(errorType)) {
      setTimeout(() => {
        this.fullLogOut();
      }, TIMEOUT);
    }
  };

  getOfficeErrorType = (error) => {
    console.warn({ error });
    console.warn(error.message);

    if (error.name === "RichApi.Error") {
      return stringMessageToErrorType(error.message);
    }
    return null;
  };

  /**
   * Function getting errors that occurs in types of operations.
   * Transform the error that happens when import too many columns and fail in context.sync.
   *
   * @param {Object} operationData Contains informatons about current operation
   * @param {Error} error Error thrown during the operation execution
   */
  getExcelError(error, operationData) {
    const { name, code, debugInfo } = error;
    const isExcelApiError =
      name === "RichApi.Error" &&
      code === "GeneralException" &&
      debugInfo.message === "An internal error has occurred.";
    const exceedLimit =
      operationData &&
      operationData.instanceDefinition &&
      operationData.instanceDefinition.columns > COLUMN_EXCEL_API_LIMIT;
    let updateError;
    switch (operationData && operationData.operationType) {
      case IMPORT_OPERATION:
      case DUPLICATE_OPERATION:
      case REFRESH_OPERATION:
      case EDIT_OPERATION:
        if (isExcelApiError && exceedLimit) {
          updateError = { ...error, type: "exceedExcelApiLimit", message: "" };
        } else {
          updateError = error;
        }
        break;
      default:
        updateError = error;
        break;
    }
    return updateError;
  }

  getRestErrorType = (error) => {
    if (!error.status && !error.response) {
      if (
        error.message &&
        error.message.includes(incomingErrorStrings.CONNECTION_BROKEN)
      ) {
        return errorTypes.CONNECTION_BROKEN_ERR;
      }
      return null;
    }
    const status =
      error.status || (error.response ? error.response.status : null);
    return httpStatusToErrorType(status);
  };

  getErrorMessage = (error, options = { chosenObjectName: "Report" }) => {
    const errorType = this.getErrorType(error);
    return errorMessageFactory(errorType)({ error, ...options });
  };

  fullLogOut = async () => {
    this.notificationService.dismissNotifications();
    await this.sessionHelper.logOutRest();
    this.sessionActions.logOut();
    this.sessionHelper.logOutRedirect();
  };

  createNotificationPayload(message, details) {
    const buttons = [
      {
        title: "Ok",
        type: "basic",
        label: "Ok",
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
  }

  /**
   * Function checking if the dialog is open and closing it if it is.
   * Also clearing Reprompt task queue if dialog was open for Reprompt workflow.
   * * @param {Boolean} shouldClose flag indicated whether to close the dialog or not
   */
  closePopupIfOpen = async (shouldClose) => {
    const storeState = this.reduxStore.getState();

    const { isDialogOpen } = storeState.officeReducer;

    if (isDialogOpen && shouldClose) {
      const isDialogOpenForReprompt =
        storeState.repromptsQueueReducer?.total > 0;

      await this.popupController.closeDialog(this.popupController.dialog);
      this.popupController.resetDialogStates();
      // clear Reprompt task queue if in Reprompt All workflow
      isDialogOpenForReprompt && this.reduxStore.dispatch(clearRepromptTask());
    }
  };
}

export const errorService = new ErrorService();
