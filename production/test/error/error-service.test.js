/* eslint-disable  */
import { errorService } from '../../src/error/error-handler';
import { EnvironmentNotFoundError } from '../../src/error/environment-not-found-error';
import { UnauthorizedError } from '../../src/error/unauthorized-error';
import { BadRequestError } from '../../src/error/bad-request-error';
import { InternalServerError } from '../../src/error/internal-server-error';
import { sessionHelper } from '../../src/storage/session-helper';
import { notificationService } from '../../src/notification/notification-service';
import { RunOutsideOfficeError } from '../../src/error/run-outside-office-error';
/* eslint-enable */

jest.mock('../../src/storage/session-helper');

describe('ErrorService', () => {
    describe('errorRestFactory', () => {
        it('should throw error if it is not being handled', () => {
            // given
            const error = new Error();
            // when
            const throwingCall = () => errorService.errorRestFactory(error);
            // then
            expect(throwingCall).toThrowError(Error);
        });
        it('should throw a BadRequestError due to response 400 code', () => {
            // given
            const error = {
                response: {
                    status: 400,
                },
            };
            // when
            try {
                errorService.errorRestFactory(error);
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
                errorService.errorRestFactory(error);
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
                errorService.errorRestFactory(error);
                // then
            } catch (errorThrown) {
                expect(errorThrown).toBeInstanceOf(EnvironmentNotFoundError);
            }
        });
        it('should throw a UnauthorizedError due to error with 404', () => {
            // given
            const error = { status: 404 };
            // when
            try {
                errorService.errorRestFactory(error);
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
                errorService.errorRestFactory(error);
                // then
            } catch (errorThrown) {
                expect(errorThrown).toBeInstanceOf(InternalServerError);
            }
        });
    });
    describe('handleRestError', () => {
        it('should display notification on EnvironmentNotFoundError', () => {
            // given
            const error = new EnvironmentNotFoundError();
            const spyMethod = jest.spyOn(notificationService, 'displayMessage');
            // when
            errorService.handleError(error);
            // then
            expect(spyMethod).toBeCalled();
            expect(spyMethod).toBeCalledWith('error', '404 - Environment not found');
        });
        it('should display notification on UnauthorizedError', () => {
            // given
            const error = new UnauthorizedError();
            const spyMethod = jest.spyOn(notificationService, 'displayMessage');
            // when
            errorService.handleError(error);
            // then
            expect(spyMethod).toBeCalled();
            expect(spyMethod).toBeCalledWith('error', '401 - Unauthorized. Please log in.');
        });
        it('should display notification on BadRequestError', () => {
            // given
            const error = new BadRequestError();
            const spyMethod = jest.spyOn(notificationService, 'displayMessage');
            // when
            errorService.handleError(error);
            // then
            expect(spyMethod).toBeCalled();
            expect(spyMethod).toBeCalledWith('error', '400 - There has been a problem with your request');
        });
        it('should display notification on InternalServerError', () => {
            // given
            const error = new InternalServerError();
            const spyMethod = jest.spyOn(notificationService, 'displayMessage');
            // when
            errorService.handleError(error);
            // then
            expect(spyMethod).toBeCalled();
            expect(spyMethod).toBeCalledWith('error', '500 - We were not able to handle your request');
        });
        it('should logout on UnauthorizedError', () => {
            // given
            const error = new UnauthorizedError();
            const spyMethod = jest.spyOn(notificationService, 'displayMessage');
            const logoutMethod = sessionHelper.logout;
            // when
            errorService.handleError(error);
            // then
            expect(spyMethod).toBeCalled();
            expect(logoutMethod).toBeCalled();
        });
        it('should logout on EnvironmentNotFound', () => {
            // given
            const error = new EnvironmentNotFoundError();
            const spyMethod = jest.spyOn(notificationService, 'displayMessage');
            const logoutMethod = sessionHelper.logout;
            // when
            errorService.handleError(error);
            // then
            expect(spyMethod).toBeCalled();
            expect(logoutMethod).toBeCalled();
        });
    });
    describe('errorOfficeFactory', () => {
        it('should throw RunOutsideOfficeError', () => {
            // given
            const error = {
                message: 'Excel is not defined',
            };
            // when
            const throwingCall = () => errorService.errorOfficeFactory(error);
            // then
            expect(throwingCall).toThrowError(RunOutsideOfficeError);
        });
        it('should throw same error if it is not expected error', () => {
            // given
            const error = {};
            // when
            const throwingCall = () => errorService.errorOfficeFactory(error);
            // then
            expect(throwingCall).toThrowError();
        });
    });
    describe('errorOfficeHandler', () => {
        it('should handle RunOutsideOfficeError', () => {
            // given
            const error = new RunOutsideOfficeError();
            const spyMethod = jest.spyOn(notificationService, 'displayMessage');
            // when
            errorService.handleOfficeError(error);
            // then
            expect(spyMethod).toBeCalled();
            expect(spyMethod).toBeCalledWith('error', 'Please run plugin inside Office');
        });
        it('should forward error that it does not handle to next method', () => {
            // given
            const error = { constructor: () => { } };
            const originalMethod = errorService.handleError;
            errorService.handleError = jest.fn();
            // when
            errorService.handleOfficeError(error);
            // then
            expect(errorService.handleError).toBeCalled();
            errorService.handleError = originalMethod;
        });
    });
    describe('handlePreAuthError', () => {
        it('should handle Unauthorized for login', () => {
            // given
            const error = new UnauthorizedError();
            const spyMethod = jest.spyOn(notificationService, 'displayMessage');
            // when
            errorService.handlePreAuthError(error);
            // then
            expect(spyMethod).toBeCalled();
            expect(spyMethod).toBeCalledWith('error', 'Wrong username or password.');
        });
        it('should forward error that it does not handle to next method', () => {
            // given
            const error = { constructor: () => { } };
            const originalMethod = errorService.handleError;
            errorService.handleError = jest.fn();
            // when
            errorService.handlePreAuthError(error);
            // then
            expect(errorService.handleError).toBeCalled();
            errorService.handleError = originalMethod;
        });
    });
});
