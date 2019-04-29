import {EnvironmentNotFoundError} from './environment-not-found-error.js';
import {UnauthorizedError} from './unauthorized-error.js';
import {BadRequestError} from './bad-request-error.js';
import {InternalServerError} from './internal-server-error.js';
import {PromptedReportError} from './prompted-report-error';
import {sessionHelper} from '../storage/session-helper.js';
import {notificationService} from '../notification/notification-service.js';
import {RunOutsideOfficeError} from './run-outside-office-error.js';
import {OverlappingTablesError} from './overlapping-tables-error';
import {GenericOfficeError} from './generic-office-error.js';
import {errorMessages, NOT_SUPPORTED_SERVER_ERR} from './constants';
import {ConnectionBrokenError} from './connection-error.js';
import {OutsideOfRangeError} from './outside-of-range-error.js';

const TIMEOUT = 2000;

class ErrorService {
  errorRestFactory = (error) => {
    if (error.status === 200) {
      return new PromptedReportError();
    }
    if (error.status === 404 || !error.response) {
      if (error.response && error.response.body) {
        return new InternalServerError(error.response.body);
      }
      if (error.message && error.message.includes('Possible causes: the network is offline,')) {
        return new ConnectionBrokenError();
      }
      return new EnvironmentNotFoundError();
    }
    switch (error.response.status) {
      case 404:
        return new EnvironmentNotFoundError();
      case 400:
        return new BadRequestError();
      case 401:
        return new UnauthorizedError();
      case 500:
        return new InternalServerError(error.response.body ? error.response.body : {});
      default:
        return error;
    }
  };
  errorOfficeFactory = (error) => {
    if (error.name === 'RichApi.Error') {
      switch (error.message) {
        case 'Excel is not defined':
          return new RunOutsideOfficeError(error.message);
        case `A table can't overlap another table. `:
          return new OverlappingTablesError(error.message);
        default:
          return new GenericOfficeError(error.message);
      }
    }
    return error;
  }
  handleError = (error, isLogout) => {
    const message = this.getErrorMessage(error);
    if (error instanceof UnauthorizedError) {
      notificationService.displayNotification('info', message);
    } else {
      notificationService.displayNotification('warning', message);
    }
    if (
      error instanceof EnvironmentNotFoundError
      || error instanceof ConnectionBrokenError
      || error instanceof UnauthorizedError) {
      if (!isLogout) {
        setTimeout(() => {
          this.fullLogOut();
        }, TIMEOUT);
      }
    }
  }


  handlePreAuthError = (error) => {
    switch (true) {
      case error instanceof UnauthorizedError:
        notificationService.displayNotification('error', 'Wrong username or password.');
        break;
      default:
        this.handleError(error);
    }
  }
  handleLogoutError = (error) => {
    this.handleError(error, true);
  }
  handleOfficeError = (error) => {
    switch (true) {
      case error instanceof RunOutsideOfficeError:
        notificationService.displayNotification('warning', 'Please run plugin inside Office');
        break;
      case error instanceof OverlappingTablesError:
        notificationService.displayNotification('warning', `Excel returned error: ${error.message}`);
        break;
      case error instanceof GenericOfficeError:
        notificationService.displayNotification('warning', `Excel returned error: ${error.message}`);
        break;
      case error instanceof OutsideOfRangeError:
        notificationService.displayNotification('warning', 'The table you try to import exceeds the worksheet limits.');
        break;
      default:
        this.handleError(error);
    }
  }

  fullLogOut = () => {
    sessionHelper.logOutRest();
    sessionHelper.logOut();
    sessionHelper.logOutRedirect();
  }

  getErrorMessage = (error) => {
    switch (true) {
      case error instanceof EnvironmentNotFoundError:
        return '404 - Environment not found';
      case error instanceof ConnectionBrokenError:
        return 'Environment is unreachable.'
          + '\nPlease check your internet connection.';
      case error instanceof UnauthorizedError:
        return 'Your session has expired.\nPlease log in.';
      case error instanceof BadRequestError:
        return '400 - There has been a problem with your request';
      case error instanceof InternalServerError:
        return errorMessages[error.iServerCode];
      case error instanceof PromptedReportError:
        return NOT_SUPPORTED_SERVER_ERR;
      case error instanceof OutsideOfRangeError:
        return 'The table you try to import exceeds the worksheet limits.';
      case error instanceof OverlappingTablesError:
        return 'The table you try to import exceeds the worksheet limits.';
      default:
        return error.message || 'Unknown error';
    }
  }
}

export const errorService = new ErrorService();
