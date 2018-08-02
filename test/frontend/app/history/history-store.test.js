/* eslint-disable */
import { historyStore } from '../../../../src/frontend/app/history/history-store';
import { HistoryError } from '../../../../src/frontend/app/history/history-error';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
/* eslint-enable */

describe('historyStore', () => {
    beforeEach(() => {
        // default state should be empty
        expect(historyStore.getState()).toEqual({});
    });

    afterEach(() => {
        historyStore.dispatch({
            type: historyProperties.actions.logOut,
        });
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

    it('should erase history on go to project', () => {
        // given
        const givenDirId = 'someId';
        historyStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: givenDirId,
        });
        // when
        historyStore.dispatch({
            type: historyProperties.actions.goToProject,
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
