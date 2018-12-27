/* eslint-disable  */
import { errorService } from '../../src/error/error-handler';
import { EnvironmentNotFoundError } from '../../src/error/environment-not-found-error';
import { UnauthorizedError } from '../../src/error/unauthorized-error';
import { BadRequestError } from '../../src/error/bad-request-error';
import { InternalServerError } from '../../src/error/internal-server-error';
import { message } from 'antd';
import { sessionHelper } from '../../src/storage/session-helper';
/* eslint-enable */

jest.mock('antd');
jest.mock('../../src/storage/session-helper');

describe('ErrorService', () => {
    describe('errorFactory', () => {
        it('should throw a BadRequestError due to response 400 code', () => {
            // given
            const response = { status: 400 };
            const error = { response };
            // when
            try {
                errorService.errorFactory(error);
                // then
            } catch (errorThrown) {
                expect(errorThrown).toBeInstanceOf(BadRequestError);
            }
        });
        it('should throw a UnauthorizedError due to response 401 code', () => {
            // given
            const response = { status: 401 };
            const error = { response };
            // when
            try {
                errorService.errorFactory(error);
                // then
            } catch (errorThrown) {
                expect(errorThrown).toBeInstanceOf(UnauthorizedError);
            }
        });
        it('should throw a UnauthorizedError due to response 404 code', () => {
            // given
            const response = { status: 404 };
            const error = { response };
            // when
            try {
                errorService.errorFactory(error);
                // then
            } catch (errorThrown) {
                expect(errorThrown).toBeInstanceOf(EnvironmentNotFoundError);
            }
        });
        it('should throw a UnauthorizedError due to not existing response', () => {
            // given
            const error = {};
            // when
            try {
                errorService.errorFactory(error);
                // then
            } catch (errorThrown) {
                expect(errorThrown).toBeInstanceOf(EnvironmentNotFoundError);
            }
        });
        it('should throw a InternalServerError due to response 500 code', () => {
            // given
            const response = { status: 500 };
            const error = { response };
            // when
            try {
                errorService.errorFactory(error);
                // then
            } catch (errorThrown) {
                expect(errorThrown).toBeInstanceOf(InternalServerError);
            }
        });
    });
    describe('handleError', () => {
        it('should display notification on EnvironmentNotFoundError', () => {
            // given
            const error = new EnvironmentNotFoundError();
            const mockedMessage = message;
            // when
            errorService.handleError(error);
            // then
            expect(mockedMessage.error).toBeCalled();
            expect(mockedMessage.error).toBeCalledWith('404 - Environment was not found');
        });
        it('should display notification on UnauthorizedError', () => {
            // given
            const error = new UnauthorizedError();
            const mockedMessage = message;
            // when
            errorService.handleError(error);
            // then
            expect(mockedMessage.error).toBeCalled();
            expect(mockedMessage.error).toBeCalledWith('401 - Session expired. Please log in.');
        });
        it('should display notification on BadRequestError', () => {
            // given
            const error = new BadRequestError();
            const mockedMessage = message;
            // when
            errorService.handleError(error);
            // then
            expect(mockedMessage.error).toBeCalled();
            expect(mockedMessage.error).toBeCalledWith('400 - There has been a problem with your request');
        });
        it('should display notification on InternalServerError', () => {
            // given
            const error = new InternalServerError();
            const mockedMessage = message;
            // when
            errorService.handleError(error);
            // then
            expect(mockedMessage.error).toBeCalled();
            expect(mockedMessage.error).toBeCalledWith('500 - We were not able to handle your request');
        });
        it('should logout on UnauthorizedError', () => {
            // given
            const error = new UnauthorizedError();
            const mockedMessage = message;
            const logoutMethod = sessionHelper.logout;
            // when
            errorService.handleError(error);
            // then
            expect(mockedMessage.error).toBeCalled();
            expect(logoutMethod).toBeCalled();
        });
    });
});
