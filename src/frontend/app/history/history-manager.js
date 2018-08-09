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
        switch (historyCommand) {
            case historyProperties.actions.logOut:
            case historyProperties.actions.goToProjects:
            case historyProperties.actions.goUp:
                reduxStore.dispatch({
                    type: historyCommand,
                });
                break;
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
