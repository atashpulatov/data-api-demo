/* eslint-disable */
import {authenticationService} from '../../src/authentication/auth-rest-service';
import superagent from 'superagent';
import {moduleProxy} from '../../src/module-proxy';
import {promptsRestService} from '../../src/prompts/prompts-rest-service';
import {reduxStore} from '../../src/store';
import {sessionProperties} from '../../src/storage/session-properties';
import {historyProperties} from '../../src/history/history-properties';
import {promptDef} from './mock-prompt-definitions';
import {mstrObjectRestService} from '../../src/mstr-object/mstr-object-rest-service';
/* eslint-enable */

const login = 'mstr';
const password = '999U2nn1g7gY';
const loginType = 1;
const envURL = 'https://env-125323.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';
const projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754';
const projectName = 'MicroStrategy Tutorial';

describe('PromptsRestService', () => {
  let authToken;
  const mockAgent = superagent.agent();
  beforeAll(() => {
    moduleProxy.request = mockAgent;
  });

  afterAll(() => {
    moduleProxy.request = superagent;
  });

  beforeEach(async () => {
    authToken = await authenticationService.authenticate(
        login,
        password,
        envURL,
        loginType);

    reduxStore.dispatch({
      type: sessionProperties.actions.logIn,
      values: {
        username: login,
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

  describe('getReportPrompts', () => {
    it('should return the list of prompts in a given report definition', async () => {
      // given
      const reportId = '7D5A304811E9292DB6700080EF85EFFD';
      // when
      const result = await promptsRestService.getReportPrompts(
          reportId
      );
      // then
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result).toEqual(promptDef);
    });

    it('should return an empty array when no prompts are available in a report definition', async () => {
      // given
      const reportId = '315E4D8C11E9295022A10080EFD510B5';
      // when
      const result = await promptsRestService.getReportPrompts(
          reportId
      );
      // then
      expect(result).toBeDefined();
      expect(result.length).toEqual(0);
    });
  });
  describe('getReportInstacePrompts', () => {
    it.skip('should return the list of prompts in a given report instance', async () => {
      // given
      const reportId = '7D5A304811E9292DB6700080EF85EFFD';
      const fullPath = `${envURL}/reports/${reportId}/instances`;
      const instanceId = await mstrObjectRestService._getInstanceId(fullPath, authToken, projectId);
      // when
      const result = await promptsRestService.getReportInstancePrompts(
          reportId, instanceId
      );
      // then
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result).toEqual(promptDef);
    });

    it('should return an empty array when no prompts are available in a report instance', async () => {
      // given
      const reportId = '315E4D8C11E9295022A10080EFD510B5';
      const fullPath = `${envURL}/reports/${reportId}/instances`;
      const instanceId = await mstrObjectRestService._getInstanceId(fullPath, authToken, projectId);
      // when
      const result = await promptsRestService.getReportInstancePrompts(
          reportId, instanceId);
      // then
      expect(result).toBeDefined();
      expect(result.length).toEqual(0);
    });
  });
});
