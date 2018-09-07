/* eslint-disable */
import { historyHelper } from '../../../../src/frontend/app/history/history-helper';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
import { HistoryError } from '../../../../src/frontend/app/history/history-error';
import { reduxStore } from '../../../../src/frontend/app/store';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
/* eslint-enable */

// TODO: fix these tests
describe('historyHelper', () => {
    it('should return true when asked is directory stored and there is some',
        () => {
            // given
            const expectedDirId = 'someId';
            const expectedDirName = 'someName';
            reduxStore.dispatch({
                type: historyProperties.actions.goInside,
                dirId: expectedDirId,
                dirName: expectedDirName,
            });
            const dirArr = reduxStore.getState().historyReducer.directoryArray;
            // when
            const isStored = historyHelper.isDirectoryStored(dirArr);
            // then
            expect(isStored).toBe(true);
        }
    );

    it('should return false when asked is directory stored and there is none',
        () => {
            // when
            const isStored = historyHelper.isDirectoryStored();
            // then
            expect(isStored).toBe(false);
        }
    );

    it('should return current directory when there is one', () => {
        // given
        const expectedDirId = 'someId';
        const expectedDirName = 'someName';
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: expectedDirId,
            dirName: expectedDirName,
        });
        const dirArr = reduxStore.getState().historyReducer.directoryArray;
        // when
        const currDir = historyHelper.getCurrentDirectory(dirArr);
        // then
        expect(currDir.dirId).toBe(expectedDirId);
        expect(currDir.dirName).toBe(expectedDirName);
    });

    it('should return current directory when there is many', () => {
        // given
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: 'oldId',
            dirName: 'oldName',
        });
        const expectedDirId = 'someId';
        const expectedDirName = 'someName';
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: expectedDirId,
            dirName: expectedDirName,
        });
        const dirArr = reduxStore.getState().historyReducer.directoryArray;
        // when
        const currDir = historyHelper.getCurrentDirectory(dirArr);
        // then
        expect(currDir.dirId).toBe(expectedDirId);
        expect(currDir.dirName).toBe(expectedDirName);
    });

    it('should throw error when getting current dir but there is no', () => {
        // given
        expect(sessionStorage.getItem(historyProperties.directoryArray))
            .toBeFalsy();
        // when
        // then
        expect(historyHelper.getCurrentDirectory).toThrowError(HistoryError);
        expect(historyHelper.getCurrentDirectory)
            .toThrowError('No directory ID was stored.');
        expect(sessionStorage.getItem(historyProperties.directoryArray))
            .toBeFalsy();
    });
});
