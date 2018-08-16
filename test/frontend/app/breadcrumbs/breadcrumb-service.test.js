import BreadcrumService from '../../../../src/frontend/app/breadcrumbs/breadcrumb-service';
import { reduxStore } from '../../../../src/frontend/app/store';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';

describe.skip('Breadcrumbs Service', () => {
    it('should return history array properly formatted', () => {
        // given
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: 'asd',
        });
        // when
        
        // then

    });
});
