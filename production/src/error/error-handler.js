import { EnvironmentNotFoundError } from './environment-not-found-error.js';
import { UnauthorizedError } from './unauthorized-error.js';
import { BadRequestError } from './bad-request-error.js';
import { InternalServerError } from './internal-server-error.js';
import { sessionHelper } from '../storage/session-helper.js';
import { notificationService } from '../notification/notification-service.js';
import { RunOutsideOfficeError } from './run-outside-office-error.js';
import { OverlappingTablesError } from './overlapping-tables-error';

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
        }
        throw error;
    };
    errorOfficeFactory = (error) => {
        switch (error.message) {
            case 'Excel is not defined':
                return new RunOutsideOfficeError(error.message);
            case `A table can't overlap another table. `:
                return new OverlappingTablesError(error.message);
            default:
                if (error.name === 'RichApi.Error') notificationService.displayMessage('error', error.message);
                throw error;
        }
    }
    handleError = (error) => {
        switch (error.constructor) {
            case EnvironmentNotFoundError:
                notificationService.displayMessage('error', '404 - Environment not found');
                sessionHelper.logOut();
                break;
            case UnauthorizedError:
                notificationService.displayMessage('error', '401 - Unauthorized. Please log in.');
                sessionHelper.logOut();
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
    handleOfficeError = (error) => {
        switch (error.constructor) {
            case RunOutsideOfficeError:
                notificationService.displayMessage('error', 'Please run plugin inside Office');
                break;
            case OverlappingTablesError:
                notificationService.displayMessage('error', error.message);
                break;
            default:
                this.handleError(error);
        }
    }
}

export const errorService = new ErrorService();
