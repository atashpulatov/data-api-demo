import { sessionHelper } from '../storage/session-helper';
import { notificationService } from '../notification/notification-service.js';
import { errorTypes, errorMessageFactory } from './constants';

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
      switch (error.message) {
        case 'Excel is not defined':
          return errorTypes.RUN_OUTSIDE_OFFICE_ERR;
        case 'A table can\'t overlap another table. ':
          return errorTypes.OVERLAPPING_TABLES_ERR;
        case 'This object binding is no longer valid due to previous updates.':
          return errorTypes.TABLE_REMOVED_FROM_EXCEL_ERR;
        default:
          return errorTypes.GENERIC_OFFICE_ERR;
      }
    }
    return null;
  }

  getRestErrorType = (error) => {
    const isOfficeError = [
      errorTypes.RUN_OUTSIDE_OFFICE_ERR,
      errorTypes.OVERLAPPING_TABLES_ERR,
      errorTypes.GENERIC_OFFICE_ERR,
      errorTypes.OUTSIDE_OF_RANGE_ERR].includes(error.type);

    if (!error.status && !error.response && !isOfficeError) {
      if (error.message && error.message.includes('Possible causes: the network is offline,')) {
        return errorTypes.CONNECTION_BROKEN_ERR;
      }
      return null;
    }
    const status = error.status || (error.response ? error.response.status : 0);
    switch (status) {
      case 404:
        return errorTypes.ENV_NOT_FOUND_ERR;
      case 400:
        return errorTypes.BAD_REQUEST_ERR;
      case 401:
        return errorTypes.UNAUTHORIZED_ERR;
      case 500:
        return errorTypes.INTERNAL_SERVER_ERR;
      default:
        return null;
    }
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
