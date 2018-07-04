import { EnvironmentNotFoundError } from './environment-not-found-error.js';
import { UnauthorizedError } from './unauthorized-error.js';
import { BadRequestError } from './bad-request-error.js';
import { InternalServerError } from './internal-server-error.js';

export let errorHandler = function(error) {
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
};
