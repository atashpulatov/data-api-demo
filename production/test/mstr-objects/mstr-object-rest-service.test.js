/* eslint-disable */
import { authenticationService } from '../../src/authentication/auth-rest-service';
import { mstrObjectRestService } from '../../src/mstr-object/mstr-object-rest-service';
import superagent from 'superagent';

import { mstrTutorial, mstrTutorialFolder, mockReports } from '../mockData';
import { UnauthorizedError } from '../../src/error/unauthorized-error';
import { InternalServerError } from '../../src/error/internal-server-error';
import { BadRequestError } from '../../src/error/bad-request-error';
import { sessionProperties } from '../../src/storage/session-properties';
import { reduxStore } from '../../src/store';
import { historyProperties } from '../../src/history/history-properties';
import { moduleProxy } from '../../src/module-proxy';
/* eslint-enable */

const correctLogin = 'mstr';
const correctPassword = '999U2nn1g7gY';
const folderType = 7;
const loginType = 1;
const envURL = 'https://env-125323.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';
const projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754';
const projectName = 'Microstrategy Tutorial';
const folderId = 'D64C532E4E7FBA74D29A7CA3576F39CF';
const objectId = 'C536EA7A11E903741E640080EF55BFE2';

describe('MstrObjectRestService', () => {
    let authToken;
    beforeAll(() => {
        const mockAgent = superagent.agent();
        moduleProxy.request = mockAgent;
    });

    afterAll(() => {
        moduleProxy.request = superagent;
    });

    beforeEach(async () => {
        authToken = await authenticationService.authenticate(
            correctLogin,
            correctPassword,
            envURL,
            loginType);
    });

    describe('getProjectContent', () => {
        it('should return list of objects within project', async () => {
            // given
            // when
            const result = await mstrObjectRestService.getProjectContent(
                envURL,
                authToken,
                projectId,
                folderType,
            );
            // then
            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThanOrEqual(2);
        });

        it('should throw exception due to incorrect authToken', async () => {
            // given
            const authToken = 'wrongToken';
            // when
            const result = mstrObjectRestService.getProjectContent(
                envURL,
                authToken,
                projectId,
                folderType,
            );
            // then
            try {
                await result;
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
            }
            expect(result).rejects.toThrow();
        });

        it('should throw error due to incorrect folderType', async () => {
            // given
            const wrongFolderType = 7434234;
            // when
            const result = mstrObjectRestService.getProjectContent(
                envURL,
                authToken,
                projectId,
                wrongFolderType,
            );
            // then
            try {
                await result;
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerError);
            }
            expect(result).rejects.toThrow();
        });

        it('should throw error due to incorrect projectId', async () => {
            // given
            const wrongProjectId = 'incorrectProjectId';
            // when
            const result = mstrObjectRestService.getProjectContent(
                envURL,
                authToken,
                wrongProjectId,
                folderType,
            );
            // then
            try {
                await result;
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
            }
            expect(result).rejects.toThrow();
        });
    });
    describe('getFolderContent', () => {
        it('should return list of objects within project', async () => {
            // given
            // when
            const result = await mstrObjectRestService.getFolderContent(
                envURL,
                authToken,
                projectId,
                folderId,
            );
            // then
            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThanOrEqual(2);
            expect(result).toEqual(mstrTutorialFolder);
        });

        it('should throw exception due to incorrect authToken', async () => {
            // given
            const wrongAuthToken = 'wrongToken';
            // when
            const result = mstrObjectRestService.getFolderContent(
                envURL,
                wrongAuthToken,
                projectId,
                folderId,
            );
            // then
            try {
                await result;
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
            }
            expect(result).rejects.toThrow();
        });


        it('should throw error due to incorrect projectId', async () => {
            // given
            const wrongProjectId = 7434234;
            // when
            const result = mstrObjectRestService.getFolderContent(
                envURL,
                authToken,
                wrongProjectId,
                folderId,
            );
            // then
            try {
                await result;
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
            }
            expect(result).rejects.toThrow();
        });

        it('should throw error due to incorrect folderId', async () => {
            // given
            const wrongFolderId = 'incorectFolderId';
            // when
            const result = mstrObjectRestService.getFolderContent(
                envURL,
                authToken,
                projectId,
                wrongFolderId,
            );
            // then
            try {
                await result;
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
            }
            expect(result).rejects.toThrow();
        });
    });
    describe('getObjectContent', () => {
        beforeEach(() => {
            reduxStore.dispatch({
                type: sessionProperties.actions.logIn,
                username: correctLogin,
                envUrl: envURL,
                isRememberMeOn: false,
            });
            reduxStore.dispatch({
                type: sessionProperties.actions.loggedIn,
                authToken: authToken,
            });
            reduxStore.dispatch({
                type: historyProperties.actions.goInsideProject,
                projectId: projectId,
                projectName: projectName,
            });
        });
        it('should return content of report', async () => {
            // given
            const expectedReportName = 'TEST REPORT 1';
            // when
            const result = await mstrObjectRestService.getObjectContent(
                objectId,
                projectId
            );
            // then
            expect(result).toBeDefined();
            expect(result.name).toEqual(expectedReportName);
        });

        it('should throw exception due to incorrect authToken', async () => {
            // given
            const wrongAuthToken = 'wrongToken';
            reduxStore.dispatch({
                type: sessionProperties.actions.loggedIn,
                authToken: wrongAuthToken,
            });
            // when
            const result = mstrObjectRestService.getObjectContent(
                objectId,
                projectId
            );
            // then
            try {
                await result;
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedError);
            }
            expect(result).rejects.toThrow();
        });

        it('should throw error due to incorrect objectId', async () => {
            // given
            const incorrectObjectId = 'abc123';
            // when
            const result = mstrObjectRestService.getObjectContent(
                incorrectObjectId,
                projectId
            );
            // then
            try {
                await result;
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
            }
            expect(result).rejects.toThrow();
        });

        it('should throw error due to incorrect projectId', async () => {
            // given
            const wrongProjectId = 'incorrectProjectId';
            const originalInstanceIdMethod = mstrObjectRestService._getInstanceId;
            mstrObjectRestService._getInstanceId = jest
                .fn()
                .mockResolvedValue('wrongInstanceId');
            // when
            const result = mstrObjectRestService.getObjectContent(
                objectId,
                wrongProjectId
            );
            // then
            try {
                await result;
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestError);
            }
            expect(mstrObjectRestService._getInstanceId).toBeCalled();
            expect(result).rejects.toThrow();
            mstrObjectRestService._getInstanceId = originalInstanceIdMethod;
        });
    });
});
