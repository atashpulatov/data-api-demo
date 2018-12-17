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
    handleError = (error) => {
        sessionHelper.disableLoading();
        if (error instanceof EnvironmentNotFoundError) {
            message.error('404 - Environment was not found');
        }
        if (error instanceof UnauthorizedError) {
            message.error('401 - Session expired. Please log in.');
            // if (err instanceof UnauthorizedError || err instanceof EnvironmentNotFoundError) {
            //     reduxStore.dispatch({
            //         type: sessionProperties.actions.logOut,
            //     });
            //     return [];
            // } else {
            //     throw err;
            // }
        }
        if (error instanceof BadRequestError) {
            message.error('400 - There has been a problem with your request');
        }
        if (error instanceof InternalServerError) {
            message.error('500 - We were not able to handle your request');
        }
    }
}

export const errorService = new ErrorService();
