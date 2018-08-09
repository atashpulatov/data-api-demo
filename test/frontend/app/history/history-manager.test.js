/* eslint-disable */
import { historyManager } from '../../../../src/frontend/app/history/history-manager';
import { historyProperties } from '../../../../src/frontend/app/history/history-properties';
import { HistoryError } from '../../../../src/frontend/app/history/history-error';
import { sessionProperties } from '../../../../src/frontend/app/storage/session-properties';
import { reduxStore } from '../../../../src/frontend/app/store';
/* eslint-enable */

describe('historyManager', () => {
    beforeEach(() => {
        // default state should be empty
        expect(reduxStore.getState().historyReducer).toEqual({});
    });

    afterEach(() => {
        reduxStore.dispatch({
            type: historyProperties.actions.logOut,
        });
    });

    it('should save folderId when navigating inside (first folder)', () => {
        // given
        const givenDirId = 'someId';
        const historyObject = {};
        historyObject[historyProperties.command] = historyProperties.actions.goInside;
        historyObject[historyProperties.directoryId] = givenDirId;
        // when
        historyManager.handleHistoryData(historyObject);
        // then
        const dirArray = reduxStore.getState().historyReducer.directoryArray;
        expect(dirArray).toBeTruthy();
        expect(dirArray.length).toBe(1);
        expect(dirArray[0]).toBe(givenDirId);
    });

    it('should save folderId when navigating inside (another folder)', () => {
        // given
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: 'whatever',
        });
        const givenDirId = 'someId';
        const historyObject = {};
        historyObject[historyProperties.command] = historyProperties.actions.goInside;
        historyObject[historyProperties.directoryId] = givenDirId;
        // when
        historyManager.handleHistoryData(historyObject);
        // then
        const dirArray = reduxStore.getState().historyReducer.directoryArray;
        expect(dirArray).toBeTruthy();
        expect(dirArray.length).toBe(2);
        expect(dirArray[1]).toBe(givenDirId);
    });

    it('should throw error when navigating inside without folder', () => {
        // given
        const historyObject = {};
        historyObject[historyProperties.command] = historyProperties.actions.goInside;
        // when
        const wrongFunctionCall = () => {
            historyManager.handleHistoryData(historyObject);
        };
        // then
        expect(wrongFunctionCall).toThrowError(HistoryError);
        expect(wrongFunctionCall).toThrowError('Missing directoryId.');
        expect(sessionStorage.getItem(historyProperties.directoryArray))
            .toBeFalsy();
    });

    it('should return current directory when there is one', () => {
        // given
        const expectedDirId = 'someId';
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: expectedDirId,
        });
        // when
        const currDir = historyManager.getCurrentDirectory();
        // then
        expect(currDir).toBe(expectedDirId);
    });

    it('should return current directory when there is many', () => {
        // given
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: 'oldId',
        });
        const expectedDirId = 'someId';
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: expectedDirId,
        });
        // when
        const currDir = historyManager.getCurrentDirectory();
        // then
        expect(currDir).toBe(expectedDirId);
    });

    it('should throw error when getting current dir but there is no', () => {
        // given
        expect(sessionStorage.getItem(historyProperties.directoryArray))
            .toBeFalsy();
        // when
        // then
        expect(historyManager.getCurrentDirectory).toThrowError(HistoryError);
        expect(historyManager.getCurrentDirectory)
            .toThrowError('No directory ID was stored.');
        expect(sessionStorage.getItem(historyProperties.directoryArray))
            .toBeFalsy();
    });

    it('should remove most recent directory when go up', () => {
        // given
        const oldId = 'oldId';
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: oldId,
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: 'newId',
        });
        const historyObject = {};
        historyObject[historyProperties.command] = historyProperties.actions.goUp;
        // when
        historyManager.handleHistoryData(historyObject);
        // then
        const currDir = historyManager.getCurrentDirectory();
        expect(currDir).toBe(oldId);
    });

    it('should remove project on go up command when there is no dir', () => {
        // given
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: 'id',
        });
        const historyObject = {};
        historyObject[historyProperties.command] = historyProperties.actions.goUp;
        // when
        historyManager.handleHistoryData(historyObject);
        // then
        expect(reduxStore.getState().historyReducer.projectId).toBeFalsy();
    });

    it('should remove project and directories on go to project', () => {
        // given
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: 'projectId',
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: 'oldId',
        });
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: 'newId',
        });
        const historyObject = {};
        historyObject[historyProperties.command] =
            historyProperties.actions.goToProjects;
        // when
        historyManager.handleHistoryData(historyObject);
        // then
        expect(reduxStore.getState().historyReducer.projectId).toBeFalsy();
        expect(reduxStore.getState().historyReducer.directoryArray).toBeFalsy();

    });

    it('should remove project, directories and token on go logout', () => {
        // given
        const autToken = 'someToken';
        sessionStorage.setItem(sessionProperties.authToken, autToken);
        const projectId = 'someId';
        sessionStorage.setItem(sessionProperties.projectId, projectId);
        const oldId = 'oldId';
        const recentId = 'newId';
        const givenJson = JSON.stringify([oldId, recentId]);
        sessionStorage.setItem(historyProperties.directoryArray, givenJson);

        const historyObject = {};
        historyObject[historyProperties.command] =
            historyProperties.actions.logOut;
        // when
        historyManager.handleHistoryData(historyObject);
        // then
        expect(sessionStorage.getItem(sessionProperties.authToken)).toBeFalsy();
        expect(sessionStorage.getItem(sessionProperties.projectId)).toBeFalsy();
        expect(sessionStorage.getItem(historyProperties.directoryArray))
            .toBeFalsy();
    });
});
