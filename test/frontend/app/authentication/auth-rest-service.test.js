/* eslint-disable */
import authRestService from '../../../../src/frontend/app/authentication/auth-rest-service';
import superagent from 'superagent';
import authDi from '../../../../src/frontend/app/authentication/auth-di';
import { UnauthorizedError } from '../../../../src/frontend/app/authentication/unauthorized-error';
import { EnvironmentNotFoundError } from '../../../../src/frontend/app/authentication/environment-not-found-error';
/* eslint-enable */

const loginType = 1;
const envURL = 'https://env-94174.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

describe('MstrObjectRestService', () => {
    beforeAll(() => {
        const mockAgent = superagent.agent();
        mockAgent['myField'] = 'if we get correct version it should be available';
        authDi.request = mockAgent;
    });

    afterAll(() => {
        authDi.request = superagent;
    });

    it('should return authToken when called', async () => {
        // given
        // when
        let authToken = await authRestService.authenticate(
            'mstr',
            '',
            envURL,
            loginType);
        // then
        expect(authToken).toBeDefined();
        expect(authToken).toBeTruthy();
    });
    it('should throw error due to incorrect username', async () => {
        // given
        // when
        let authToken = authRestService.authenticate(
            'mst',
            '',
            envURL,
            loginType);
        // then
        try {
            await authToken;
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedError);
        };
    });
    it('should throw error due to incorrect password', async () => {
        // given
        // when
        let authToken = authRestService.authenticate(
            'mstr',
            'wrongPassword',
            envURL,
            loginType);
        // then
        try {
            await authToken;
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedError);
        };
    });
    it('should throw error due to incorrect login mode', async () => {
        // given
        // when
        let authToken = authRestService.authenticate(
            'mstr',
            '',
            envURL,
            128);
        // then
        try {
            await authToken;
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedError);
        };
    });
    it('should throw error due to incorrect url but within existing domain', async () => {
        // given
        // when
        let authToken = authRestService.authenticate(
            'mstr',
            '',
            'https://env-94174.customer.cloud.microstrategy.com/incorecturl',
            loginType);
        // then
        try {
            await authToken;
        } catch (error) {
            expect(error).toBeInstanceOf(EnvironmentNotFoundError);
        };
    });
    it('should throw error due to incorrect url and domain doesnt exist', async () => {
        // given
        // when
        let authToken = authRestService.authenticate(
            'mstr',
            '',
            'https://www.domainwhichshouldnotexist.com.pl',
            loginType);
        // then
        try {
            await authToken;
        } catch (error) {
            expect(error).toBeInstanceOf(EnvironmentNotFoundError);
        };
    });
});
