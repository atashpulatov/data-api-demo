import { historyProperties } from './history-properties';
import { HistoryError } from './history-error';
import { sessionProperties } from '../storage/session-properties';
import { reduxStore } from '../store';

class HistoryManager {
    getCurrentDirectory() {
        const dirJson = sessionStorage
            .getItem(historyProperties.directoryArray);
        const dirArr = JSON.parse(dirJson);
        if (!dirArr || (dirArr.length == 0)) {
            throw new HistoryError('No directory ID was stored.');
        }
        return dirArr[dirArr.length - 1];
    }

    handleHistoryData(historyData) {
        const historyCommand = historyData[historyProperties.command];
        switch (historyCommand) {
            case historyProperties.actions.logOut:
            case historyProperties.actions.goToProject:
            case historyProperties.actions.goUp:
                reduxStore.dispatch({
                    type: historyCommand,
                });
            case historyProperties.actions.goInside:
                const dirId = historyData[historyProperties.directoryId];
                if (dirId === undefined) {
                    throw new HistoryError('Missing directoryId.');
                }
                reduxStore.dispatch({
                    type: historyCommand,
                    dirId: dirId,
                });
                break;
            default:
                // TODO: Refactor the lines below
                console.warn(`History command: `
                    + `'${history[historyProperties.command]}'`
                    + ` is not supported.`);
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
