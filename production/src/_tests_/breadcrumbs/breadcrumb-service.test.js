import {breadcrumbsService} from '../../breadcrumbs/breadcrumb-service';
import {reduxStore} from '../../store';
import {historyProperties} from '../../history/history-properties';

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
  it('should dispatch action on navigateToDir', () => {
    // given
    const testId = 'someTestId';
    const dispatchType = historyProperties.actions.goUpTo;
    const spyDispatch = jest.spyOn(reduxStore, 'dispatch');
    // when
    breadcrumbsService.navigateToDir(testId);
    // then
    expect(spyDispatch).toBeCalled();
    expect(spyDispatch).toBeCalledWith({type: dispatchType, dirId: testId});
  });
});
