/* eslint-disable */
import { breadcrumbsService } from '../../../../src/frontend/app/breadcrumbs/breadcrumb-service';
import { reduxStore } from '../../../../src/frontend/app/store';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
/* eslint-enable */

describe('Breadcrumbs Service', () => {
    const givenProject = {
        projectId: 'someProjectId',
        projectName: 'someProjectName',
    };
    const givenDirArray = [
        {
            dirId: 'someDirId',
            dirName: 'someDirName',
        },
        {
            dirId: 'otherDirId',
            dirName: 'otherDirName',
        },
        {
            dirId: 'anotherDirId',
            dirName: 'anotherDirName',
        },
    ];

    it('should return empty array when there is no history', () => {
        // given
        // when
        const breadcrumbs = breadcrumbsService.getHistoryObjects();
        // then
        expect(breadcrumbs).toEqual([]);
    });

    it('should return only project object', () => {
        // given
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: givenProject.projectId,
            projectName: givenProject.projectName,
        });
        // when
        const breadcrumbs = breadcrumbsService.getHistoryObjects();
        // then
        expect(breadcrumbs).toEqual([givenProject]);
    });

    it('should return history array properly formatted', () => {
        // given
        const expectedArray = [
            givenProject,
            ...givenDirArray,
        ];
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: givenProject.projectId,
            projectName: givenProject.projectName,
        });
        givenDirArray.forEach((dir) => {
            reduxStore.dispatch({
                type: historyProperties.actions.goInside,
                dirId: dir.dirId,
                dirName: dir.dirName,
            });
        });
        // when
        const breadcrumbs = breadcrumbsService.getHistoryObjects();
        // then
        expect(breadcrumbs).toEqual(expectedArray);
        expect(breadcrumbs[0]).toEqual(givenProject);
    });
});
