/* eslint-disable */
import authRestService from '../../../../src/frontend/app/authentication/auth-rest-service';
import mstrObjectRestService from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
import superagent from 'superagent';
import authDi from '../../../../src/frontend/app/authentication/auth-di';
import objectDi from '../../../../src/frontend/app/mstr-object/mstr-object-di';

import { mstrTutorial } from '../mockData';
/* eslint-enable */

const folderType = 7;
const loginType = 1;

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
        const projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754';
        let authToken = await authRestService.authenticate(
            'mstr',
            '',
            'https://env-94174.customer.cloud.microstrategy.com/MicroStrategyLibrary/api',
            loginType);
        // when
        const result = await mstrObjectRestService.getProjectContent(
            folderType,
            'https://env-94174.customer.cloud.microstrategy.com/MicroStrategyLibrary/api',
            authToken,
            projectId,
        );
        // then
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThanOrEqual(2);
        expect(result).toEqual(mstrTutorial);
    });
    it('should fail and return expection', () => {
        // given
        
        // when

        // then

    });
});
