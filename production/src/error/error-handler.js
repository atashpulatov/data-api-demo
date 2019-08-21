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
import {errorMessages, NOT_SUPPORTED_PROMPTS_REFRESH, TABLE_OVERLAP, TABLE_REMOVED} from './constants';
import {ConnectionBrokenError} from './connection-error.js';
import {OutsideOfRangeError} from './outside-of-range-error.js';
import {TableRemovedFromExcelError} from './table-removed-from-excel-error.js';

const TIMEOUT = 2000;

class ErrorService {
  errorRestFactory = (error) => {
    const isOfficeError = error instanceof RunOutsideOfficeError
      || error instanceof OverlappingTablesError
      || error instanceof GenericOfficeError
      || error instanceof OutsideOfRangeError;

    if (!error.status && !error.response && !isOfficeError) {
      if (error.message && error.message.includes('Possible causes: the network is offline,')) {
        return new ConnectionBrokenError(error);
      }
      return error;
    }

    const status = error.status || (error.response ? error.response.status : 0);
    switch (status) {
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
  };

  errorOfficeFactory = (error) => {
    if (error.name === 'RichApi.Error') {
      switch (error.message) {
        case 'Excel is not defined':
          return new RunOutsideOfficeError(error.message);
        case `A table can't overlap another table. `:
          return new OverlappingTablesError(TABLE_OVERLAP);
        case 'This object binding is no longer valid due to previous updates.':
          return new TableRemovedFromExcelError(TABLE_REMOVED);
        default:
          return new GenericOfficeError(error.message);
      }
    }
    return error;
  }

  handleError = (errorToHandle, isLogout = false) => {
    const officeError = this.errorOfficeFactory(errorToHandle);
    const error = this.errorRestFactory(officeError);
    const message = this.getErrorMessage(error);
    const errorDetails = error.response && error.response.text;
    if (error instanceof UnauthorizedError) {
      notificationService.displayNotification('info', message);
    } else {
      notificationService.displayNotification('warning', message, errorDetails);
    }
    if (error instanceof ConnectionBrokenError
      || error instanceof UnauthorizedError) {
      if (!isLogout) {
        setTimeout(() => {
          this.fullLogOut();
        }, TIMEOUT);
      }
    }
  }

  fullLogOut = () => {
    sessionHelper.logOutRest();
    sessionHelper.logOut();
    sessionHelper.logOutRedirect();
  }

  getErrorMessage = (error) => {
    if (error instanceof EnvironmentNotFoundError) {
      return 'The endpoint cannot be reached';
    };
    if (error instanceof ConnectionBrokenError) {
      return 'Environment is unreachable. Please check your internet connection.';
    };
    if (error instanceof UnauthorizedError) {
      if (error.response.body.code === 'ERR003') return 'Wrong username or password.';
      return 'Your session has expired. Please log in.';
    };
    if (error instanceof BadRequestError) {
      return 'There has been a problem with your request';
    };
    if (error instanceof InternalServerError) {
      return errorMessages[!error.response ? '-1' : error.response.body ? error.response.body.iServerCode : '-1'];
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
    if (error instanceof TableRemovedFromExcelError) {
      return TABLE_REMOVED;
    }
    if (error instanceof GenericOfficeError) {
      return `Excel returned error: ${error.message}`;
    }
    return error.message || 'Unknown error';
  }
}

export const errorService = new ErrorService();
