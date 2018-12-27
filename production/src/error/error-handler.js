import { EnvironmentNotFoundError } from './environment-not-found-error.js';
import { UnauthorizedError } from './unauthorized-error.js';
import { BadRequestError } from './bad-request-error.js';
import { InternalServerError } from './internal-server-error.js';
import { sessionHelper } from '../storage/session-helper.js';
import { message } from 'antd';

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
    handleError = (error) => { // TODO: display notifications
        // sessionHelper.disableLoading();
        switch (error.constructor) {
            case EnvironmentNotFoundError:
                message.error('404 - Environment was not found');
                break;
            case UnauthorizedError:
                message.error('401 - Session expired. Please log in.');
                sessionHelper.logout();
                break;
            case BadRequestError:
                message.error('400 - There has been a problem with your request');
                break;
            case InternalServerError:
                message.error('500 - We were not able to handle your request');
                break;
            default:
                throw error;
        }
    }
}

export const errorService = new ErrorService();
