import { sessionHelper } from '../storage/session-helper';
import { notificationService } from '../notification/notification-service.js';
import {
  errorTypes, httpStatusToErrorType, stringMessageToErrorType, errorMessageFactory,
} from './constants';

const TIMEOUT = 2000;

class ErrorService {
  handleError = (error, isLogout = false) => {
    const errorType = this.getErrorType(error);
    const errorMessage = errorMessageFactory[errorType](error);
    this.displayErrorNotification(error, errorType, errorMessage);
    this.checkForLogout(isLogout, errorType);
  }

  getErrorType = (error) => error.type
    || this.getOfficeErrorType(error)
    || this.getRestErrorType(error)

  displayErrorNotification = (error, type, message) => {
    const errorDetails = (error.response && error.response.text) || '';
    if (type === errorTypes.UNAUTHORIZED_ERR) {
      return notificationService.displayNotification('info', message);
    }
    return notificationService.displayNotification('warning', message, errorDetails);
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
      return stringMessageToErrorType[error.message];
    }
    return null;
  }

  getRestErrorType = (error) => {
    if (!error.status && !error.response) {
      if (error.message && error.message.includes('Possible causes: the network is offline,')) {
        return errorTypes.CONNECTION_BROKEN_ERR;
      }
      return null;
    }
    const status = error.status || (error.response ? error.response.status : null);
    return httpStatusToErrorType[status];
  }

  getErrorMessage = (error) => {
    const errorType = this.getErrorType(error);
    return errorMessageFactory[errorType](error);
  }

  fullLogOut = () => {
    sessionHelper.logOutRest();
    sessionHelper.logOut();
    sessionHelper.logOutRedirect();
  }
}

export const errorService = new ErrorService();
