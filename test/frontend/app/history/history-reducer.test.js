/* eslint-disable */
import { createStore } from 'redux';
import { historyReducer } from '../../../../src/frontend/app/history/history-reducer';
import { HistoryError } from '../../../../src/frontend/app/history/history-error';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
/* eslint-enable */

describe('historyReducer', () => {
    const historyStore = createStore(historyReducer);

    beforeEach(() => {
        // default state should be empty
        expect(historyStore.getState()).toEqual({});
    });

    afterEach(() => {
        historyStore.dispatch({
            type: historyProperties.actions.logOut,
        });
    });

    it('should save projectId on go into project (no dir saved)', () => {
        // given
        const givenId = 'someId';
        // when
        historyStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: givenId,
        });
        // then
        const projectId = historyStore.getState().projectId;
        expect(projectId).toBe(givenId);
    });

    it('should throw an error on go into project without id provided', () => {
        // when
        const wrongFunctionCall = () => {
            historyStore.dispatch({
                type: historyProperties.actions.goInsideProject,
            });
        };
        // then
        expect(wrongFunctionCall).toThrowError(HistoryError);
        expect(wrongFunctionCall).toThrowError('Missing projectId.');
        expect(historyStore.getState().directoryArray).toBeFalsy();
    });

    it('should save folderId on go inside (no previous)', () => {
        // given
        const givenDirId = 'someId';
        // when
        historyStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: givenDirId,
        });
        // then
        const dirArray = historyStore.getState().directoryArray;
        expect(dirArray).toBeTruthy();
        expect(dirArray.length).toBe(1);
        expect(dirArray[0]).toBe(givenDirId);
    });

    it('should save folderId on go inside (another folder present)', () => {
        // given
        const givenDirId = 'someId';
        const anotherDirId = 'anotherId';
        historyStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: givenDirId,
        });
        // when
        historyStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: anotherDirId,
        });
        // then
        const dirArray = historyStore.getState().directoryArray;
        expect(dirArray).toBeTruthy();
        expect(dirArray.length).toBe(2);
        expect(dirArray[1]).toBe(anotherDirId);
    });

    it('should throw error when navigating inside without folder', () => {
        // when
        const wrongFunctionCall = () => {
            historyStore.dispatch({
                type: historyProperties.actions.goInside,
            });
        };
        // then
        expect(wrongFunctionCall).toThrowError(HistoryError);
        expect(wrongFunctionCall).toThrowError('Missing directoryId.');
        expect(historyStore.getState().directoryArray).toBeFalsy();
    });

    it('should remove most recent directory when go up', () => {
        // given
        const oldId = 'oldId';
        const recentId = 'newId';
        historyStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: oldId,
        });
        historyStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: recentId,
        });
        // when
        historyStore.dispatch({
            type: historyProperties.actions.goUp,
        });
        // then
        const dirArray = historyStore.getState().directoryArray;
        expect(dirArray).toBeTruthy();
        expect(dirArray.length).toBe(1);
        expect(dirArray[0]).toBe(oldId);
    });

    it('should remove project id on go up when there is no dir id', () => {
        // given
        const givenId = 'projectId';
        historyStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: givenId,
        });
        // when
        historyStore.dispatch({
            type: historyProperties.actions.goUp,
        });
        // then
        const projectId = historyStore.getState().projectId;
        expect(projectId).toBeFalsy();
    });

    it('should erase history on go to projects', () => {
        // given
        const givenDirId = 'someId';
        historyStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: givenDirId,
        });
        // when
        historyStore.dispatch({
            type: historyProperties.actions.goToProjects,
        });
        // then
        const dirArray = historyStore.getState().directoryArray;
        expect(dirArray).toBeFalsy();
    });

    it('should erase history on log out', () => {
        // given
        const givenDirId = 'someId';
        historyStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: givenDirId,
        });
        // when
        historyStore.dispatch({
            type: historyProperties.actions.logOut,
        });
        // then
        const dirArray = historyStore.getState().directoryArray;
        expect(dirArray).toBeFalsy();
    });
});
