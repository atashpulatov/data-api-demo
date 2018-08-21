/* eslint-disable */
import authRestService from '../../../../src/frontend/app/authentication/auth-rest-service';
import mstrProjectRestService from '../../../../src/frontend/app/project/project-rest-service';
import superagent from 'superagent';
import projectDi from '../../../../src/frontend/app/project/project-di';
import authDi from '../../../../src/frontend/app/authentication/auth-di';
import { UnauthorizedError } from '../../../../src/frontend/app/error/unauthorized-error';
import { EnvironmentNotFoundError } from '../../../../src/frontend/app/error/environment-not-found-error';
import { environmentProjectList } from '../mockData';
/* eslint-enable */

const correctLogin = 'mstr';
const correctPassword = '';
const loginType = 1;
const envURL = 'https://env-94174.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

describe('ProjectsRestService', () => {
    beforeAll(() => {
        const mockAgent = superagent.agent();
        projectDi.request = mockAgent;
        authDi.request = mockAgent;
    });

    afterAll(() => {
        projectDi.request = superagent;
        authDi.request = superagent;
    });

    it('should return list of projects from environment', async () => {
        // given
        const authToken = await authRestService.authenticate(
            correctLogin,
            correctPassword,
            envURL,
            loginType);
        // when
        const result = await mstrProjectRestService.getProjectList(
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
        const result = mstrProjectRestService.getProjectList(
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
        const authToken = await authRestService.authenticate(
            correctLogin,
            correctPassword,
            envURL,
            loginType);
        projectDi.request = superagent;
        // when
        const result = mstrProjectRestService.getProjectList(
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

    it('should return throw an error due to incorrect URL', async () => {
        // given
        const authToken = await authRestService.authenticate(
            correctLogin,
            correctPassword,
            envURL,
            loginType);
        const wrongEnvURL = 'www.somewrongurlfortest.com.pl';
        // when
        const result = mstrProjectRestService.getProjectList(
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
