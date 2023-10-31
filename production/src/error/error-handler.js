import officeReducerHelper from '../office/store/office-reducer-helper';
import { getNotificationButtons } from '../notification-v2/notification-buttons';
import { customT } from '../customTranslation';
import {
  errorTypes,
  httpStatusToErrorType,
  stringMessageToErrorType,
  errorMessageFactory,
  incomingErrorStrings,
  errorMessages
} from './constants';
import {
  IMPORT_OPERATION,
  DUPLICATE_OPERATION,
  REFRESH_OPERATION,
  EDIT_OPERATION
} from '../operation/operation-type-names';
import { clearRepromptTask } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';

const COLUMN_EXCEL_API_LIMIT = 5000;
const TIMEOUT = 3000;

class ErrorService {
  init = (reduxStore, sessionActions, sessionHelper, notificationService) => {
    this.reduxStore = reduxStore;
    this.sessionActions = sessionActions;
    this.sessionHelper = sessionHelper;
    this.notificationService = notificationService;
  };

  handleObjectBasedError = (objectWorkingId, error, callback, operationData) => {
    const errorType = this.getErrorType(error, operationData);
    if (error.Code === 5012) {
      this.handleError(error);
    }

    const errorMessage = errorMessageFactory(errorType)({ error });
    const details = this.getErrorDetails(error, errorMessage, errorType);

    this.checkForClearRepromptTask();

    if (errorType === errorTypes.OVERLAPPING_TABLES_ERR) {
      officeReducerHelper.dispayPopupOnSidePanel({
        objectWorkingId, title: errorMessage, message: details, callback
      });
    } else {
      this.notificationService.showObjectWarning(objectWorkingId, { title: errorMessage, message: details, callback });
    }
  };

  handleError = (error, options = { chosenObjectName: 'Report', onConfirm: null, isLogout: false }) => {
    const { onConfirm, isLogout, ...parameters } = options;
    const errorType = this.getErrorType(error);
    const errorMessage = errorMessageFactory(errorType)({ error, ...parameters });
    this.displayErrorNotification(error, errorType, errorMessage, onConfirm);
    this.checkForLogout(isLogout, errorType);
  };

  getErrorType = (error, operationData) => {
    const updateError = this.getExcelError(error, operationData);
    return updateError.type
    || this.getOfficeErrorType(updateError)
    || this.getRestErrorType(updateError);
  };

  getErrorDetails = (error, errorMessage) => {
    const errorDetails = (error.response && error.response.text) || error.message || '';
    let details;
    const {
      EXCEEDS_EXCEL_API_LIMITS, SHEET_HIDDEN, TABLE_OVERLAP, INVALID_VIZ_KEY_MESSAGE, NOT_IN_METADATA, EMPTY_REPORT
    } = errorMessages;
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

  displayErrorNotification = (error, type, message = '', onConfirm = null) => {
    const errorDetails = (error.response && error.response.text) || error.message || '';
    const details = message !== errorDetails ? errorDetails : '';
    if (type === errorTypes.UNAUTHORIZED_ERR) {
      this.notificationService.sessionExpired();
      return;
    }
    const payload = this.createNotificationPayload(message, details);
    payload.children = this.getChildrenButtons();
    this.notificationService.globalWarningAppeared(payload);
  };

  getChildrenButtons = () => getNotificationButtons([{
    type: 'basic',
    label: customT('OK'),
    onClick: () => this.notificationService.globalNotificationDissapear(),
  }]);

  checkForLogout = (isLogout = false, errorType) => {
    if (!isLogout && [errorTypes.UNAUTHORIZED_ERR].includes(errorType)) {
      setTimeout(() => {
        this.fullLogOut();
      }, TIMEOUT);
    }
  };

  /**
   * Function used to check if Reprompt All task queue needs to be reset,
   * due to error that occured mid-procedure.
   */
  checkForClearRepromptTask = () => {
    const { repromptsQueueReducer } = this.reduxStore.getState();
    if (repromptsQueueReducer?.repromptsQueue?.length > 0) {
      this.reduxStore.dispatch(clearRepromptTask());
    }
  };

  getOfficeErrorType = (error) => {
    console.warn({ error });
    console.warn(error.message);

    if (error.name === 'RichApi.Error') {
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
  // eslint-disable-next-line class-methods-use-this
  getExcelError(error, operationData) {
    const { name, code, debugInfo } = error;
    const isExcelApiError = name === 'RichApi.Error' && code === 'GeneralException'
      && debugInfo.message === 'An internal error has occurred.';
    const exceedLimit = operationData && operationData.instanceDefinition
      && operationData.instanceDefinition.columns > COLUMN_EXCEL_API_LIMIT;
    let updateError;
    switch (operationData && operationData.operationType) {
      case IMPORT_OPERATION:
      case DUPLICATE_OPERATION:
      case REFRESH_OPERATION:
      case EDIT_OPERATION:
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
  }

  getRestErrorType = (error) => {
    if (!error.status && !error.response) {
      if (error.message && error.message.includes(incomingErrorStrings.CONNECTION_BROKEN)) {
        return errorTypes.CONNECTION_BROKEN_ERR;
      }
      return null;
    }
    const status = error.status || (error.response ? error.response.status : null);
    return httpStatusToErrorType(status);
  };

  getErrorMessage = (error, options = { chosenObjectName: 'Report' }) => {
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
        title: 'Ok',
        type: 'basic',
        label: 'Ok',
        onClick: () => { this.notificationService.globalNotificationDissapear(); },
      },
    ];
    const payload = {
      title: message,
      details,
      buttons,
    };
    return payload;
  }
}

export const errorService = new ErrorService();
