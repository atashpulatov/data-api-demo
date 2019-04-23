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
    switch (true) {
      case error instanceof EnvironmentNotFoundError:
        notificationService.displayNotification('warning', '404 - Environment not found');
        if (!isLogout) {
          setTimeout(() => {
            this.fullLogOut();
          }, TIMEOUT);
        }
        break;
      case error instanceof ConnectionBrokenError:
        notificationService.displayNotification('warning', 'Environment is unreachable.'
          + '\nPlease check your internet connection.');
        if (!isLogout) {
          setTimeout(() => {
            this.fullLogOut();
          }, TIMEOUT);
        }
        break;
      case error instanceof UnauthorizedError:
        notificationService.displayNotification('info', 'Your session has expired.\nPlease log in.');
        if (!isLogout) {
          setTimeout(() => {
            this.fullLogOut();
          }, TIMEOUT);
        }
        break;
      case error instanceof BadRequestError:
        notificationService.displayNotification('warning', '400 - There has been a problem with your request');
        break;
      case error instanceof InternalServerError:
        notificationService.displayNotification('warning', errorMessages[error.iServerCode]);
        break;
      case error instanceof PromptedReportError:
        notificationService.displayNotification('warning', NOT_SUPPORTED_SERVER_ERR);
        break;
      case error instanceof OutsideOfRangeError:
        notificationService.displayNotification('warning', 'The table you try to import exceeds the worksheet limits.');
        break;
      case error instanceof OverlappingTablesError:
        notificationService.displayNotification('warning', 'The table you try to import exceeds the worksheet limits.');
        break;
      default:
        notificationService.displayNotification('warning', error.message || 'Unknown error');
        break;
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
}

export const errorService = new ErrorService();
