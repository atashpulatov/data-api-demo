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
            throw new EnvironmentNotFoundError();
        }
        switch (error.response.status) {
            case 404:
                throw new EnvironmentNotFoundError();
            case 400:
                throw new BadRequestError();
            case 401:
                throw new UnauthorizedError();
            case 500:
                throw new InternalServerError();
        }
        throw error;
    };
    errorOfficeFactory = (error) => {
        switch (error.message) {
            case 'Excel is not defined':
                throw new RunOutsideOfficeError(error.message);
            case `A table can't overlap another table. `:
                throw new OverlappingTablesError(error.message);
            default:
                if (error.name === 'RichApi.Error') notificationService.displayMessage('error', error.message);
                throw error;
        }
    }
    handleError = (error) => {
        switch (error.constructor) {
            case EnvironmentNotFoundError:
                notificationService.displayMessage('error', '404 - Environment not found');
                sessionHelper.logout();
                break;
            case UnauthorizedError:
                notificationService.displayMessage('error', '401 - Unauthorized. Please log in.');
                sessionHelper.logout();
                break;
            case BadRequestError:
                notificationService.displayMessage('error', '400 - There has been a problem with your request');
                break;
            case InternalServerError:
                notificationService.displayMessage('error', '500 - We were not able to handle your request');
                break;
            default:
                throw error;
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
