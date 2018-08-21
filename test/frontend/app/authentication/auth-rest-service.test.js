/* eslint-disable */
import authRestService from '../../../../src/frontend/app/authentication/auth-rest-service';
import superagent from 'superagent';
import authDi from '../../../../src/frontend/app/authentication/auth-di';
import { UnauthorizedError } from '../../../../src/frontend/app/error/unauthorized-error';
import { EnvironmentNotFoundError } from '../../../../src/frontend/app/error/environment-not-found-error';
/* eslint-enable */

const correctLogin = 'mstr';
const correctPassword = '';
const authType = 1;
const envURL = 'https://env-94174.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

describe('MstrObjectRestService', () => {
    beforeAll(() => {
        const mockAgent = superagent.agent();
        authDi.request = mockAgent;
    });

    afterAll(() => {
        authDi.request = superagent;
    });

    it('should return authToken when called', async () => {
        // given
        // when
        const authToken = await authRestService.authenticate(
            correctLogin,
            correctPassword,
            envURL,
            authType);
        // then
        expect(authToken).toBeDefined();
        expect(authToken).toBeTruthy();
    });
    it('should throw error due to incorrect username', async () => {
        // given
        const incorrectLogin = 'mst';
        // when
        const authToken = authRestService.authenticate(
            incorrectLogin,
            correctPassword,
            envURL,
            authType);
        // then
        try {
            await authToken;
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedError);
        };
        expect(authToken).rejects.toThrow();
    });
    it('should throw error due to incorrect password', async () => {
        // given
        const incorrectPassword = 'wrongPass';
        // when
        const authToken = authRestService.authenticate(
            correctLogin,
            incorrectPassword,
            envURL,
            authType);
        // then
        try {
            await authToken;
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedError);
        };
        expect(authToken).rejects.toThrow();
    });
    it('should throw error due to incorrect login mode', async () => {
        // given
        const incorrectAuthType = 122;
        // when
        const authToken = authRestService.authenticate(
            correctLogin,
            correctPassword,
            envURL,
            incorrectAuthType);
        // then
        try {
            await authToken;
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedError);
        };
        expect(authToken).rejects.toThrow();
    });
    it('should throw error due to incorrect url but within existing domain', async () => {
        // given
        const incorrectUrl = 'https://env-94174.customer.cloud.microstrategy.com/incorecturl';
        // when
        const authToken = authRestService.authenticate(
            correctLogin,
            correctPassword,
            incorrectUrl,
            authType);
        // then
        try {
            await authToken;
        } catch (error) {
            expect(error).toBeInstanceOf(EnvironmentNotFoundError);
        };
        expect(authToken).rejects.toThrow();
    });
    it('should throw error due to incorrect url and provided domain does not exist', async () => {
        // given
        const nonExistingDomainUrl = 'https://www.domainwhichshouldnotexist.com.pl'; 
        // when
        const authToken = authRestService.authenticate(
            correctLogin,
            correctPassword,
            nonExistingDomainUrl,
            authType);
        // then
        try {
            await authToken;
        } catch (error) {
            expect(error).toBeInstanceOf(EnvironmentNotFoundError);
        };
        expect(authToken).rejects.toThrow();
    });
});
