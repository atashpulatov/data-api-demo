/* eslint-disable */
import authRestService from '../../../../src/frontend/app/authentication/auth-rest-service';
import mstrObjectRestService from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
import superagent from 'superagent';

import { mstrTutorial, mstrTutorialFolder, mockReports } from '../mockData';
import { UnauthorizedError } from '../../../../src/frontend/app/error/unauthorized-error';
import { InternalServerError } from '../../../../src/frontend/app/error/internal-server-error';
import { BadRequestError } from '../../../../src/frontend/app/error/bad-request-error';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { reduxStore } from '../../../../src/frontend/app/store';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
import { moduleProxy } from '../../../../src/frontend/app/module-proxy';
/* eslint-enable */

const correctLogin = 'mstr';
const correctPassword = '';
const folderType = 7;
const loginType = 1;
const envURL = 'https://env-94174.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';
const projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754';
const projectName = 'Microstrategy Tutorial';
const folderId = 'D64C532E4E7FBA74D29A7CA3576F39CF';
const objectId = '3FC4A93A11E85FF62EB70080EFE55315';

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
        authToken = await authRestService.authenticate(
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
            expect(result).rejects.toThrow();
        });

        it('should throw error due to incorrect folderType', async () => {
            // given
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
            expect(result).rejects.toThrow();
        });

        it('should throw error due to incorrect projectId', async () => {
            // given
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
        it('should return list of objects within project', async () => {
            // given
            // when
            const result = await mstrObjectRestService.getObjectContent(
                objectId
            );
            // then
            expect(result).toBeDefined();
            expect(result.name).toEqual(mockReports[2].name);
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
                objectId
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
                incorrectObjectId
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
            reduxStore.dispatch({
                type: historyProperties.actions.goInsideProject,
                projectId: wrongProjectId,
                projectName: projectName,
            });
            const originalInstanceIdMethod = mstrObjectRestService._getInstanceId;
            mstrObjectRestService._getInstanceId = jest
                .fn()
                .mockResolvedValue('wrongInstanceId');
            // when
            const result = mstrObjectRestService.getObjectContent(
                objectId
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
