import {authenticationService} from '../../src/authentication/auth-rest-service';
import {mstrObjectRestService} from '../../src/mstr-object/mstr-object-rest-service';
import superagent from 'superagent';

import {mstrTutorialFolder} from '../mockData';
import {UnauthorizedError} from '../../src/error/unauthorized-error';
import {InternalServerError} from '../../src/error/internal-server-error';
import {BadRequestError} from '../../src/error/bad-request-error';
import {sessionProperties} from '../../src/storage/session-properties';
import {reduxStore} from '../../src/store';
import {historyProperties} from '../../src/history/history-properties';
import {moduleProxy} from '../../src/module-proxy';
import {officeConverterService} from '../../src/office/office-converter-service';

const correctLogin = 'mstr';
const correctPassword = 'UIhQaQG57nBf';
const folderType = 7;
const loginType = 1;
const envURL = 'https://env-156567.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';
const projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754';
const projectName = 'Microstrategy Tutorial';
const instanceId = '';
const isReport = false;
const folderId = 'D64C532E4E7FBA74D29A7CA3576F39CF';
const objectId = 'C536EA7A11E903741E640080EF55BFE2';
const dossierData = {dossierId: 'dossierId', instanceId: 'iId', chapterKey: 'ckey', visualizationKey: 'vkey'};
const mockInstanceDefinition = {rows: 50, instanceId: 'ABC', mstrTable: {headers: []}};

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
    it.skip('should return list of objects within project', async () => {
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
  describe('createInstance', () => {
    beforeEach(() => {
      reduxStore.dispatch({
        type: sessionProperties.actions.logIn,
        values: {
          username: correctLogin,
          envUrl: envURL,
          isRememberMeOn: false,
        },
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
    it.skip('should return definition of report', async () => {
      // given
      const expectedReportName = 'TEST REPORT 1';
      const expectedReportRows = 51;
      const expectedReportCols = 4;
      const dossierData = null;
      const isReport = true;
      // when
      const result = await mstrObjectRestService.createInstance(
          objectId,
          projectId,
          isReport,
          dossierData
      );
      // then
      expect(result.instanceId).toBeDefined();
      expect(result.rows).toEqual(expectedReportRows);
      expect(result.columns).toEqual(expectedReportCols);
      expect(result.mstrTable.name).toEqual(expectedReportName);
    });
    it.skip('should return existing definition of dossier', async () => {
      // TODO: Create dossier for testing and update dossierData object
      // given
      const expectedReportName = 'TEST REPORT 1';
      const expectedReportRows = 51;
      const expectedReportCols = 4;
      // when
      const result = await mstrObjectRestService.createInstance(
          objectId,
          projectId,
          isReport,
          dossierData
      );
      // then
      expect(result.instanceId).toEqual(instanceId);
      expect(result.rows).toEqual(expectedReportRows);
      expect(result.columns).toEqual(expectedReportCols);
      expect(result.mstrTable.name).toEqual(expectedReportName);
    });

    it('should throw exception due to incorrect authToken', async () => {
      // given
      const wrongAuthToken = 'wrongToken';
      reduxStore.dispatch({
        type: sessionProperties.actions.loggedIn,
        authToken: wrongAuthToken,
      });
      // when
      const result = mstrObjectRestService.createInstance(
          objectId,
          projectId,
          isReport,
          dossierData
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
      const result = mstrObjectRestService.createInstance(
          incorrectObjectId,
          projectId,
          isReport,
          dossierData
      );
      // then
      try {
        await result;
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
      }
      expect(result).rejects.toThrow();
    });

    it('should throw error due to incorrect instanceId', async () => {
      // given
      const incorrectDossierData = 'abc123';
      // when
      const result = mstrObjectRestService.createInstance(
          objectId,
          projectId,
          isReport,
          incorrectDossierData,
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
      // when
      const result = mstrObjectRestService.createInstance(
          objectId,
          wrongProjectId,
          isReport,
          dossierData,
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
  describe('getObjectContentGenerator', () => {
    beforeEach(async () => {
      reduxStore.dispatch({
        type: sessionProperties.actions.logIn,
        values: {
          username: correctLogin,
          envUrl: envURL,
          isRememberMeOn: false,
        },
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

      jest.spyOn(mstrObjectRestService, '_fetchObjectContent').mockImplementation(() => {
        return {body: {result: {data: {paging: 50}}}};
      });
    });
    it('should return an async generator', async () => {
      // given
      const instanceDefinition = mockInstanceDefinition;
      // when
      const generator = mstrObjectRestService.getObjectContentGenerator(instanceDefinition, objectId, projectId, true, {});

      // then
      expect(generator).toBeDefined();
      expect(generator.constructor.name).toBe('AsyncGenerator');
    });

    it('should throw error due to incorrect objectId', async () => {
      // given
      const incorrectObjectId = 'abc123';
      const instanceDefinition = mockInstanceDefinition;
      // when
      const generator = mstrObjectRestService.getObjectContentGenerator(instanceDefinition, incorrectObjectId, projectId, true, {});
      const result = generator.next().value;
      // then
      try {
        await result;
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
      }
    });

    it.skip('should return an iterable promise object', async () => {
      // given
      const instanceDefinition = mockInstanceDefinition;
      const limit = 10;
      let current = -limit;
      jest.spyOn(mstrObjectRestService, '_fetchObjectContent').mockImplementation(() => {
        current += limit;
        return {body: {result: {data: {paging: {current}}}}};
      });
      jest.spyOn(officeConverterService, 'getRows').mockImplementation(() => {
        return current;
      });
      // when
      const generator = mstrObjectRestService.getObjectContentGenerator(instanceDefinition, objectId, projectId, true, {}, limit);
      const mockFn = jest.fn();
      // then

      // TODO: check why it fails only on jenkins
      // TypeError: Object is not async iterable
      for await (const row of generator) {
        mockFn(row);
      }
      expect(mockFn.mock.calls.length).toBeGreaterThan(1);
    });
  });
});
