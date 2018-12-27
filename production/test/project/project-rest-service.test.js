/* eslint-disable */
import { authenticationService } from '../../src/authentication/auth-rest-service';
import { projectRestService } from '../../src/project/project-rest-service';
import superagent from 'superagent';
import { UnauthorizedError } from '../../src/error/unauthorized-error';
import { EnvironmentNotFoundError } from '../../src/error/environment-not-found-error';
import { environmentProjectList } from '../mockData';
import { moduleProxy } from '../../src/module-proxy';
/* eslint-enable */

const correctLogin = 'mstr';
const correctPassword = '999U2nn1g7gY';
const loginType = 1;
const envURL = 'https://env-125323.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

describe('ProjectsRestService', () => {
    const mockAgent = superagent.agent();
    beforeAll(() => {
        moduleProxy.request = mockAgent;
    });

    afterAll(() => {
        moduleProxy.request = superagent;
    });

    it('should return list of projects from environment', async () => {
        // given
        const authToken = await authenticationService.authenticate(
            correctLogin,
            correctPassword,
            envURL,
            loginType);
        // when
        const result = await projectRestService.getProjectList(
            envURL,
            authToken,
        );
        // then
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThanOrEqual(2);
        expect(result).toEqual(environmentProjectList);
    });

    it('should return throw an error due to incorrect authToken', async () => {
        // given
        const authToken = 'wrongToken';
        // when
        const result = projectRestService.getProjectList(
            envURL,
            authToken,
        );
        // then
        try {
            await result;
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedError);
        }
        expect(result).rejects.toThrow();
    });

    it('should return throw an error due to missing cookies', async () => {
        // given
        const authToken = await authenticationService.authenticate(
            correctLogin,
            correctPassword,
            envURL,
            loginType);
        moduleProxy.request = superagent;
        // when
        const result = projectRestService.getProjectList(
            envURL,
            authToken,
        );
        // then
        try {
            await result;
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedError);
        } finally {
            moduleProxy.request = mockAgent;
        }
        expect(result).rejects.toThrow();
        moduleProxy.request = mockAgent;
    });

    it('should return throw an error due to incorrect URL', async () => {
        // given
        const authToken = await authenticationService.authenticate(
            correctLogin,
            correctPassword,
            envURL,
            loginType);
        const wrongEnvURL = 'www.somewrongurlfortest.com.pl';
        // when
        const result = projectRestService.getProjectList(
            wrongEnvURL,
            authToken,
        );
        // then
        try {
            await result;
        } catch (error) {
            expect(error).toBeInstanceOf(EnvironmentNotFoundError);
        }
        expect(result).rejects.toThrow();
    });
});
