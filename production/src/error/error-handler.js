import {
  errorTypes,
  httpStatusToErrorType,
  stringMessageToErrorType,
  errorMessageFactory,
  incomingErrorStrings,
} from './constants';

const TIMEOUT = 2000;

class ErrorService {
  init = (sessionHelper, notificationService) => {
    this.sessionHelper = sessionHelper;
    this.notificationService = notificationService;
  }

  handleObjectBasedError = (objectWorkingId, error, callback) => {
    const errorType = this.getErrorType(error);
    console.log(error);
    console.log(errorType);
    this.notificationService.showObjectWarning(objectWorkingId, { message: error.message, callback });
    // this.notificationService
  }

  handleError = (error, options = { chosenObjectName: 'Report', onConfirm: null, isLogout: false }) => {
    const { onConfirm, isLogout, ...parameters } = options;
    const errorType = this.getErrorType(error);
    console.log(errorType);
    const errorMessage = errorMessageFactory(errorType)({ error, ...parameters });
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
      // return this.notificationService.displayNotification({ type: 'info', content: message });
      this.notificationService.sessionExpired();
    }
    const payload = this.createNotificationPayload(message, details);
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
    this.sessionHelper.logOut();
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
