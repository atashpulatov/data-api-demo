/* eslint-disable */
import authRestService from '../../../../src/frontend/app/authentication/auth-rest-service';
import mstrObjectRestService from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
import superagent from 'superagent';
import authDi from '../../../../src/frontend/app/authentication/auth-di';
import objectDi from '../../../../src/frontend/app/mstr-object/mstr-object-di';

import { mstrTutorial } from '../mockData';
import { UnauthorizedError } from '../../../../src/frontend/app/error/unauthorized-error';
import { InternalServerError } from '../../../../src/frontend/app/error/internal-server-error';
import { BadRequestError } from '../../../../src/frontend/app/error/bad-request-error';
/* eslint-enable */

const correctLogin = 'mstr';
const correctPassword = '';
const folderType = 7;
const loginType = 1;
const envURL = 'https://env-94174.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';
const projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754';

describe('MstrObjectRestService', () => {
    beforeAll(() => {
        const mockAgent = superagent.agent();
        authDi.request = mockAgent;
        objectDi.request = mockAgent;
    });

    afterAll(() => {
        authDi.request = superagent;
        objectDi.request = superagent;
    });

    it('should return list of objects within project', async () => {
        // given
        const authToken = await authRestService.authenticate(
            correctLogin,
            correctPassword,
            envURL,
            loginType);
        // when
        const result = await mstrObjectRestService.getProjectContent(
            folderType,
            envURL,
            authToken,
            projectId,
        );
        // then
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThanOrEqual(2);
        expect(result).toEqual(mstrTutorial);
    });
    it('should throw exception due to incorrect authToken', async () => {
        // given
        const authToken = 'wrongToken';
        // when
        const result = mstrObjectRestService.getProjectContent(
            folderType,
            envURL,
            authToken,
            projectId,
        );
        // then
        try {
            await result;
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedError);
        }
    });
    it('should throw error due to incorrect folderType', async () => {
        // given
        const authToken = await authRestService.authenticate(
            correctLogin,
            correctPassword,
            envURL,
            loginType);
        const wrongFolderType = 7434234;
        // when
        const result = mstrObjectRestService.getProjectContent(
            wrongFolderType,
            envURL,
            authToken,
            projectId,
        );
        // then
        try {
            await result;
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerError);
        }
    });
    it('should throw error due to incorrect projectId', async () => {
        // given
        const authToken = await authRestService.authenticate(
            correctLogin,
            correctPassword,
            envURL,
            loginType);
        const wrongProjectId = 'incorrectProjectId';
        // when
        const result = mstrObjectRestService.getProjectContent(
            folderType,
            envURL,
            authToken,
            wrongProjectId,
        );
        // then
        try {
            await result;
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
        }
    });
});
