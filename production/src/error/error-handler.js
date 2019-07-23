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
import {errorMessages, NOT_SUPPORTED_PROMPTS_REFRESH, TABLE_OVERLAP} from './constants';
import {ConnectionBrokenError} from './connection-error.js';
import {OutsideOfRangeError} from './outside-of-range-error.js';

const TIMEOUT = 2000;

class ErrorService {
  errorRestFactory = (error) => {
    if (error.status === 200) {
      return new PromptedReportError(error);
    }
    const isOfficeError = error instanceof RunOutsideOfficeError
      || error instanceof OverlappingTablesError
      || error instanceof GenericOfficeError
      || error instanceof OutsideOfRangeError;
    if (error.status === 404 || (!error.response && !isOfficeError)) {
      if (error.response && error.response.body) {
        return new InternalServerError(error.response.body);
      }
      if (error.message && error.message.includes('Possible causes: the network is offline,')) {
        return new ConnectionBrokenError(error);
      }
      return new EnvironmentNotFoundError(error);
    }
    if (!!error.response) {
      switch (error.status || error.response.status) {
        case 404:
          return new EnvironmentNotFoundError(error);
        case 400:
          return new BadRequestError(error);
        case 401:
          return new UnauthorizedError(error);
        case 500:
          return new InternalServerError(error);
        default:
          return error;
      }
    }
    return error;
  };
  errorOfficeFactory = (error) => {
    if (error.name === 'RichApi.Error') {
      switch (error.message) {
        case 'Excel is not defined':
          return new RunOutsideOfficeError(error.message);
        case `A table can't overlap another table. `:
          return new OverlappingTablesError(TABLE_OVERLAP);
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
    const message = this.getErrorMessage(error);
    switch (true) {
      case error instanceof RunOutsideOfficeError:
        notificationService.displayNotification('warning', message);
        break;
      case error instanceof OverlappingTablesError:
        notificationService.displayNotification('warning', message);
        break;
      case error instanceof GenericOfficeError:
        notificationService.displayNotification('warning', message);
        break;
      case error instanceof OutsideOfRangeError:
        notificationService.displayNotification('warning', message);
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
    if (error instanceof EnvironmentNotFoundError) {
      return '404 - Environment not found';
    };
    if (error instanceof ConnectionBrokenError) {
      return 'Environment is unreachable. Please check your internet connection.';
    };
    if (error instanceof UnauthorizedError) {
      return 'Your session has expired. Please log in.';
    };
    if (error instanceof BadRequestError) {
      return '400 - There has been a problem with your request';
    };
    if (error instanceof InternalServerError) {
      return errorMessages[error.response.body ? error.response.body.iServerCode : '-1'];
    };
    if (error instanceof PromptedReportError) {
      return NOT_SUPPORTED_PROMPTS_REFRESH;
    };
    if (error instanceof OutsideOfRangeError) {
      return 'The table you try to import exceeds the worksheet limits.';
    }
    if (error instanceof OverlappingTablesError) {
      return TABLE_OVERLAP;
    }
    if (error instanceof RunOutsideOfficeError) {
      return 'Please run plugin inside Office';
    }
    if (error instanceof GenericOfficeError) {
      return `Excel returned error: ${error.message}`;
    }
    return error.message || 'Unknown error';
  }
}

export const errorService = new ErrorService();
