/* eslint-disable  */
import { errorHandler } from '../../src/error/error-handler';
import { EnvironmentNotFoundError } from '../../src/error/environment-not-found-error';
import { UnauthorizedError } from '../../src/error/unauthorized-error';
import { BadRequestError } from '../../src/error/bad-request-error';
import { InternalServerError } from '../../src/error/internal-server-error';
/* eslint-enable */

describe('ErrorService', () => {
    it('should throw a BadRequestError due to response 400 code', () => {
        // given
        let response = { status: 400 };
        let error = { response };
        // when
        try {
            errorHandler(error);
            // then
        } catch (errorThrown) {
            expect(errorThrown).toBeInstanceOf(BadRequestError);
        }
    });
    it('should throw a UnauthorizedError due to response 401 code', () => {
        // given
        let response = { status: 401 };
        let error = { response };
        // when
        try {
            errorHandler(error);
            // then
        } catch (errorThrown) {
            expect(errorThrown).toBeInstanceOf(UnauthorizedError);
        }
    });
    it('should throw a UnauthorizedError due to response 404 code', () => {
        // given
        let response = { status: 404 };
        let error = { response };
        // when
        try {
            errorHandler(error);
            // then
        } catch (errorThrown) {
            expect(errorThrown).toBeInstanceOf(EnvironmentNotFoundError);
        }
    });
    it('should throw a UnauthorizedError due to not existing response', () => {
        // given
        let error = {};
        // when
        try {
            errorHandler(error);
            // then
        } catch (errorThrown) {
            expect(errorThrown).toBeInstanceOf(EnvironmentNotFoundError);
        }
    });
    it('should throw a InternalServerError due to response 500 code', () => {
        // given
        let response = { status: 500 };
        let error = { response };
        // when
        try {
            errorHandler(error);
            // then
        } catch (errorThrown) {
            expect(errorThrown).toBeInstanceOf(InternalServerError);
        }
    });
});
