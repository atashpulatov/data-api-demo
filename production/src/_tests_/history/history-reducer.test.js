import { createStore } from 'redux';
import { historyReducer } from '../../history/history-reducer';
import { HistoryError } from '../../history/history-error';
import { historyProperties } from '../../history/history-properties';
import { sessionProperties } from '../../storage/session-properties';

describe('historyReducer', () => {
  const historyStore = createStore(historyReducer);

  beforeEach(() => {
    // default state should be empty
    expect(historyStore.getState()).toEqual({});
  });

  afterEach(() => {
    historyStore.dispatch({ type: sessionProperties.actions.logOut, });
  });

  it('should save projectId on go into project (no dir saved)', () => {
    // given
    const givenId = 'someId';
    const givenName = 'someName';
    // when
    historyStore.dispatch({
      type: historyProperties.actions.goInsideProject,
      projectId: givenId,
      projectName: givenName,
    });
    // then
    const { project } = historyStore.getState();
    expect(project.projectId).toBe(givenId);
    expect(project.projectName).toBe(givenName);
  });

  it('should throw an error on go into project without id provided', () => {
    // when
    const wrongFunctionCall = () => {
      historyStore.dispatch({ type: historyProperties.actions.goInsideProject, });
    };
    // then
    expect(wrongFunctionCall).toThrowError(HistoryError);
    expect(wrongFunctionCall).toThrowError('Missing projectId.');
    expect(historyStore.getState().directoryArray).toBeFalsy();
  });

  it('should throw an error on go into project without name provided', () => {
    // given
    const givenProjectId = 'someProjectId';
    // when
    const wrongFunctionCall = () => {
      historyStore.dispatch({
        type: historyProperties.actions.goInsideProject,
        projectId: givenProjectId,
      });
    };
    // then
    expect(wrongFunctionCall).toThrowError(HistoryError);
    expect(wrongFunctionCall).toThrowError('Missing projectName.');
    expect(historyStore.getState().directoryArray).toBeFalsy();
  });

  it('should save folderId on go inside (no previous)', () => {
    // given
    const givenDirId = 'someId';
    const givenDirName = 'someName';
    // when
    historyStore.dispatch({
      type: historyProperties.actions.goInside,
      dirId: givenDirId,
      dirName: givenDirName,
    });
    // then
    const dirArray = historyStore.getState().directoryArray;
    expect(dirArray).toBeTruthy();
    expect(dirArray).toHaveLength(1);
    expect(dirArray[0].dirId).toBe(givenDirId);
  });

  it('should save folderId on go inside (another folder present)', () => {
    // given
    const givenDirId = 'someId';
    const givenDirName = 'someName';
    const anotherDirId = 'anotherId';
    const anotherDirName = 'anotherName';
    historyStore.dispatch({
      type: historyProperties.actions.goInside,
      dirId: givenDirId,
      dirName: givenDirName,
    });
    // when
    historyStore.dispatch({
      type: historyProperties.actions.goInside,
      dirId: anotherDirId,
      dirName: anotherDirName,
    });
    // then
    const dirArray = historyStore.getState().directoryArray;
    expect(dirArray).toBeTruthy();
    expect(dirArray).toHaveLength(2);
    expect(dirArray[1].dirId).toBe(anotherDirId);
  });

  it('should throw error when navigating inside without folder', () => {
    // when
    const wrongFunctionCall = () => {
      historyStore.dispatch({ type: historyProperties.actions.goInside, });
    };
    // then
    expect(wrongFunctionCall).toThrowError(HistoryError);
    expect(wrongFunctionCall).toThrowError('Missing dirId.');
    expect(historyStore.getState().directoryArray).toBeFalsy();
  });

  it('should throw error when navigating inside without Name', () => {
    const givenDirId = 'someId';
    // when
    const wrongFunctionCall = () => {
      historyStore.dispatch({
        type: historyProperties.actions.goInside,
        dirId: givenDirId,
      });
    };
    // then
    expect(wrongFunctionCall).toThrowError(HistoryError);
    expect(wrongFunctionCall).toThrowError('Missing dirName.');
    expect(historyStore.getState().directoryArray).toBeFalsy();
  });

  it('should throw an error on go up without id provided', () => {
    // given
    const state = { directoryArray: [] };
    const action = { type: historyProperties.actions.goUpTo };
    // when
    const wrongFunctionCall = () => {
      historyReducer(state, action);
    };
    // then
    expect(wrongFunctionCall).toThrowError(HistoryError);
    expect(wrongFunctionCall).toThrowError('Missing dirId');
  });

  it('should remove most recent directory when go up', () => {
    // given
    const oldId = 'oldId';
    const oldName = 'oldName';
    const recentId = 'newId';
    const recentName = 'newName';
    historyStore.dispatch({
      type: historyProperties.actions.goInside,
      dirId: oldId,
      dirName: oldName,
    });
    historyStore.dispatch({
      type: historyProperties.actions.goInside,
      dirId: recentId,
      dirName: recentName,
    });
    // when
    historyStore.dispatch({ type: historyProperties.actions.goUp, });
    // then
    const dirArray = historyStore.getState().directoryArray;
    expect(dirArray).toBeTruthy();
    expect(dirArray).toHaveLength(1);
    expect(dirArray[0].dirId).toBe(oldId);
    expect(dirArray[0].dirName).toBe(oldName);
  });

  it('should remove project id on go up when there is no dir id', () => {
    // given
    const givenId = 'projectId';
    const givenName = 'projectName';
    historyStore.dispatch({
      type: historyProperties.actions.goInsideProject,
      projectId: givenId,
      projectName: givenName,
    });
    // when
    historyStore.dispatch({ type: historyProperties.actions.goUp, });
    // then
    const { projectId } = historyStore.getState();
    expect(projectId).toBeFalsy();
  });

  it('should remove project id on go up when there is no more dirId', () => {
    // given
    const givenId = 'projectId';
    const givenName = 'projectName';
    const oldId = 'oldId';
    const oldName = 'oldName';
    const recentId = 'newId';
    const recentName = 'newName';
    historyStore.dispatch({
      type: historyProperties.actions.goInsideProject,
      projectId: givenId,
      projectName: givenName,
    });
    historyStore.dispatch({
      type: historyProperties.actions.goInside,
      dirId: oldId,
      dirName: oldName,
    });
    historyStore.dispatch({
      type: historyProperties.actions.goInside,
      dirId: recentId,
      dirName: recentName,
    });
    // when
    for (let i = 0; i < 5; i++) {
      historyStore.dispatch({ type: historyProperties.actions.goUp, });
    }
    // then
    const { project } = historyStore.getState();
    expect(project).toBeFalsy();
  });

  it('should erase history on go to projects', () => {
    // given
    const givenDirId = 'someId';
    const givenDirName = 'someName';
    historyStore.dispatch({
      type: historyProperties.actions.goInside,
      dirId: givenDirId,
      dirName: givenDirName,
    });
    // when
    historyStore.dispatch({ type: historyProperties.actions.goToProjects, });
    // then
    const dirArray = historyStore.getState().directoryArray;
    expect(dirArray).toBeFalsy();
  });

  it('should erase history on log out', () => {
    // given
    const givenDirId = 'someId';
    const givenDirName = 'someName';
    historyStore.dispatch({
      type: historyProperties.actions.goInside,
      dirId: givenDirId,
      dirName: givenDirName,
    });
    // when
    historyStore.dispatch({ type: sessionProperties.actions.logOut, });
    // then
    const dirArray = historyStore.getState().directoryArray;
    expect(dirArray).toBeFalsy();
  });
});
