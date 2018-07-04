/* eslint-disable */
import authRestService from '../../../../src/frontend/app/authentication/auth-rest-service';
import superagent from 'superagent';
import authDi from '../../../../src/frontend/app/authentication/auth-di';
import { UnauthorizedError } from '../../../../src/frontend/app/error/unauthorized-error';
import { EnvironmentNotFoundError } from '../../../../src/frontend/app/error/environment-not-found-error';
/* eslint-enable */

const loginType = 1;
const folderType = 7;
const envURL = 'https://env-94174.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

describe('MstrObjectRestService', () => {
    beforeAll(() => {
        const mockAgent = superagent.agent();
        authDi.request = mockAgent;
    });

    afterAll(() => {
        authDi.request = superagent;
    });
    it('should return list of objects within project', async () => {
        // given
        const authToken = await authRestService.authenticate(
            'mstr',
            '',
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
});
