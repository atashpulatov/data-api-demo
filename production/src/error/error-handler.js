import { EnvironmentNotFoundError } from './environment-not-found-error.js';
import { UnauthorizedError } from './unauthorized-error.js';
import { BadRequestError } from './bad-request-error.js';
import { InternalServerError } from './internal-server-error.js';
import { sessionHelper } from '../storage/session-helper.js';
import { message } from 'antd';
import { notificationService } from '../notification/notification-service.js';
import { RunOutsideOfficeError } from './run-outside-office-error.js';

class ErrorService {
    errorFactory = (error) => {
        
        if (!error.response || error.response.status === 404) {
            throw new EnvironmentNotFoundError();
        }
        if (error.response.status === 400) {
            throw new BadRequestError();
        }
        if (error.response.status === 401) {
            throw new UnauthorizedError();
        }
        if (error.response.status === 500) {
            throw new InternalServerError();
        }
        console.error(`Error: ${error.response.status}`
            + ` (${error.response.statusMessage})`);
    };
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
            default:
                this.handleError(error);
        }
    }
}

export const errorService = new ErrorService();
