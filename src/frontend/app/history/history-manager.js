import { historyProperties } from './history-properties';
import { HistoryError } from './history-error';
import { sessionProperties } from '../storage/session-properties';
import { reduxStore } from '../store';

class HistoryManager {
    getCurrentDirectory() {
        const dirArr = reduxStore.getState().historyReducer.directoryArray;
        if (!dirArr || (dirArr.length == 0)) {
            throw new HistoryError('No directory ID was stored.');
        }
        return dirArr[dirArr.length - 1];
    }

    handleHistoryData(historyData) {
        const historyCommand = historyData[historyProperties.command];
        let dirId;
        switch (historyCommand) {
            case sessionProperties.actions.logOut:
            case historyProperties.actions.goToProjects:
            case historyProperties.actions.goUp:
                reduxStore.dispatch({
                    type: historyCommand,
                });
                break;
            case historyProperties.actions.goUpTo:
                dirId = historyData[historyProperties.directoryId];
                if (dirId === undefined) {
                    throw new HistoryError('Missing dirId.');
                }
                reduxStore.dispatch({
                    type: historyProperties.actions.goUpTo,
                    dirId: dirId,
                });
                break;
            case historyProperties.actions.goInside:
                dirId = historyData[historyProperties.directoryId];
                if (dirId === undefined) {
                    throw new HistoryError('Missing dirId.');
                }
                const dirName = historyData[historyProperties.directoryName];
                if (dirName === undefined) {
                    throw new HistoryError('Missing dirName.');
                }
                reduxStore.dispatch({
                    type: historyCommand,
                    dirId: dirId,
                    dirName: dirName,
                });
                break;
            default:
                throw new HistoryError(`History command is not supported.`);
        }
    }

    _handleGoUp(dirArray) {
        if (!dirArray || (dirArray.length == 0)) {
            sessionStorage.removeItem(sessionProperties.projectId);
        } else {
            dirArray.pop();
            this._setDirectories(dirArray);
        }
    }

    _handleGoUpTo(dirId) {
        const dirArray = reduxStore.getState().historyReducer.directoryArray;
        if (!dirId) {
            throw new HistoryError('Missing dirId');
        }
        const indexOfElement = dirArray.findIndex((dir) => {
            return (dir.dirId === dirId);
        });
        const resultDirArray = dirArray.slice(0, indexOfElement);
        this._setDirectories(resultDirArray);
    }

    _getDirectories() {
        const dirJson = sessionStorage
            .getItem(historyProperties.directoryArray);
        return JSON.parse(dirJson);
    }

    _setDirectories(dirArray) {
        const dirJson = JSON.stringify(dirArray);
        sessionStorage.setItem(historyProperties.directoryArray, dirJson);
    }
};

export const historyManager = new HistoryManager();
