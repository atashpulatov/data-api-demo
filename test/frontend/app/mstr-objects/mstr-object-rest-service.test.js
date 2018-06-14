/* eslint-disable */
import authRestService from '../../../../src/frontend/app/authentication/auth-rest-service';
import mstrObjectRestService from '../../../../src/frontend/app/mstr-object/mstr-object-rest-service';
import {mstrTutorial} from '../mockData';
/* eslint-enable */

describe('MstrObjectRestService', () => {

    beforeEach(() => {
        sessionStorage.removeItem('x-mstr-authtoken');
        sessionStorage.removeItem('x-mstr-projectid');
    });

    it('should return list of objects within project', async () => {
        // given
        const projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754';
        let authToken = await authRestService.authenticate(
            'mstr',
            '',
            'https://env-94174.customer.cloud.microstrategy.com/MicroStrategyLibrary/api',
            '1');
        sessionStorage.setItem('x-mstr-authtoken', authToken);
        sessionStorage.setItem('x-mstr-projectid', projectId);
        // when
        const result = mstrObjectRestService.getProjectContent();
        // then
        expect(result).toBeDefined();
        expect(result).toEqual(mstrTutorial);
    });
    it('should fail and return expection', () => {
        // given
        
        // when
        
        // then
    
    });
});
