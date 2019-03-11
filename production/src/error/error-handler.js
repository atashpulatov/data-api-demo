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

const TIMEOUT = 2000;

class ErrorService {
  errorRestFactory = (error) => {
    if (error.status === 200) {
      return new PromptedReportError();
    }
    if (error.status === 404 || !error.response) {
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
        return new InternalServerError(error.response ? error.response.body : {});
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
    console.error(error);
    switch (error.constructor) {
      case EnvironmentNotFoundError:
        notificationService.displayMessage('info', '404 - Environment not found');
        if (!isLogout) {
          setTimeout(() => {
            this.fullLogOut();
          }, TIMEOUT);
        }
        break;
      case UnauthorizedError:
        notificationService.displayMessage('info', 'Your session has expired. Please log in.');
        if (!isLogout) {
          setTimeout(() => {
            this.fullLogOut();
          }, TIMEOUT);
        }
        break;
      case BadRequestError:
        notificationService.displayMessage('error', '400 - There has been a problem with your request');
        break;
      case InternalServerError:
        notificationService.displayMessage('warning', errorMessages[error.iServerCode]);
        break;
      case PromptedReportError:
        notificationService.displayMessage('warning', NOT_SUPPORTED_SERVER_ERR);
        break;
      default:
        notificationService.displayMessage('error', error.message || 'Unknown error');
        break;
    }
  }
  handlePreAuthError = (error) => {
    switch (error.constructor) {
      case UnauthorizedError:
        notificationService.displayMessage('error', 'Wrong username or password.');
        break;
      default:
        this.handleError(error);
    }
  }
  handleLogoutError = (error) => {
    this.handleError(error, true);
  }
  handleOfficeError = (error) => {
    switch (error.constructor) {
      case RunOutsideOfficeError:
        notificationService.displayMessage('error', 'Please run plugin inside Office');
        break;
      case OverlappingTablesError:
        notificationService.displayMessage('error', `Excel returned error: ${error.message}`);
        break;
      case GenericOfficeError:
        notificationService.displayMessage('error', `Excel returned error: ${error.message}`);
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
