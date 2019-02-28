import { EnvironmentNotFoundError } from './environment-not-found-error.js';
import { UnauthorizedError } from './unauthorized-error.js';
import { BadRequestError } from './bad-request-error.js';
import { InternalServerError } from './internal-server-error.js';
import { sessionHelper } from '../storage/session-helper.js';
import { notificationService } from '../notification/notification-service.js';
import { RunOutsideOfficeError } from './run-outside-office-error.js';
import { OverlappingTablesError } from './overlapping-tables-error';
import { GenericOfficeError } from './generic-office-error.js';

class ErrorService {
  errorRestFactory = (error) => {
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
        return new InternalServerError();
      default:
        return error;
    }
  };

  // errorOfficeFactory = (error) => { // no transpiling errors
  //   console.error(error);           // just forward message from error
  //   switch (error.message) {        // add information that it's from microsoft
  //     case 'Excel is not defined':
  //       return new RunOutsideOfficeError(error.message);
  //     case `A table can't overlap another table. `:
  //       return new OverlappingTablesError(error.message);
  //     default:
  //       console.error(error);
  //       if (error.name === 'RichApi.Error') notificationService.displayMessage('error', error.message);
  //       else return error;
  //   }
  // }
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
    } else return error;
  }
  handleError = (error, isLogout) => {
    console.error(error);
    switch (error.constructor) {
      case EnvironmentNotFoundError:
        notificationService.displayMessage('error', '404 - Environment not found');
        if (!isLogout) {
          this.fullLogOut();
        }
        break;
      case UnauthorizedError:
        notificationService.displayMessage('error', '401 - Unauthorized. Please log in.');
        if (!isLogout) {
          this.fullLogOut();
        }
        break;
      case BadRequestError:
        notificationService.displayMessage('error', '400 - There has been a problem with your request');
        break;
      case InternalServerError:
        notificationService.displayMessage('error', '500 - We were not able to handle your request');
        break;
      default:
        notificationService.displayMessage('error', 'Unknown error');
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

  fullLogOut() {
    sessionHelper.logOutRest();
    sessionHelper.logOut();
    sessionHelper.logOutRedirect();
  }
}

export const errorService = new ErrorService();
