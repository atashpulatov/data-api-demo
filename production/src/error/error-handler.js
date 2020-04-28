import {
  errorTypes,
  httpStatusToErrorType,
  stringMessageToErrorType,
  errorMessageFactory,
  incomingErrorStrings,
} from './constants';
import { getNotificationButtons } from '../notification-v2/notification-buttons';

const TIMEOUT = 3000;

class ErrorService {
  init = (sessionActions, sessionHelper, notificationService) => {
    this.sessionActions = sessionActions;
    this.sessionHelper = sessionHelper;
    this.notificationService = notificationService;
  }

  handleObjectBasedError = (objectWorkingId, error, callback) => {
    const errorType = this.getErrorType(error);
    if (error.Code === 5012) {
      this.handleError(error);
    }
    const errorMessage = errorMessageFactory(errorType)({ error });
    const errorDetails = (error.response && error.response.text) || error.message || '';
    const details = errorMessage !== errorDetails ? errorDetails : '';
    this.notificationService.showObjectWarning(objectWorkingId, { title: errorMessage, message: details, callback });
  }

  handleError = (error, options = { chosenObjectName: 'Report', onConfirm: null, isLogout: false }) => {
    const { onConfirm, isLogout, ...parameters } = options;
    const errorType = this.getErrorType(error);
    const errorMessage = errorMessageFactory(errorType)({ error, ...parameters });
    console.log({ errorType, errorMessage });
    this.displayErrorNotification(error, errorType, errorMessage, onConfirm);
    this.checkForLogout(isLogout, errorType);
  }

  getErrorType = (error) => error.type
    || this.getOfficeErrorType(error)
    || this.getRestErrorType(error)

  displayErrorNotification = (error, type, message = '', onConfirm = null) => {
    const errorDetails = (error.response && error.response.text) || error.message || '';
    const details = message !== errorDetails ? errorDetails : '';
    if (type === errorTypes.UNAUTHORIZED_ERR) {
      this.notificationService.sessionExpired();
      return;
    }
    const payload = this.createNotificationPayload(message, details);
    payload.children = getNotificationButtons([{
      title: 'OK',
      type: 'basic',
      label: 'OK',
      onClick: () => this.notificationService.globalNotificationDissapear(),
    }]);
    console.log({ payload });
    this.notificationService.globalWarningAppeared(payload);
  }

  checkForLogout = (isLogout = false, errorType) => {
    if (!isLogout
      && [errorTypes.CONNECTION_BROKEN_ERR, errorTypes.UNAUTHORIZED_ERR].includes(errorType)) {
      setTimeout(() => {
        this.fullLogOut();
      }, TIMEOUT);
    }
  }

  getOfficeErrorType = (error) => {
    console.warn({ error });
    console.warn(error.message);

    if (error.name === 'RichApi.Error') {
      return stringMessageToErrorType(error.message);
    }
    return null;
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
  }

  getErrorMessage = (error, options = { chosenObjectName: 'Report' }) => {
    const errorType = this.getErrorType(error);
    return errorMessageFactory(errorType)({ error, ...options });
  }

  fullLogOut = () => {
    this.sessionHelper.logOutRest();
    this.sessionActions.logOut();
    this.sessionHelper.logOutRedirect();
  }

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
