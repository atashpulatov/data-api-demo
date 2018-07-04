import { historyProperties } from './history-properties';
import { HistoryError } from './history-error';
import { sessionProperties} from '../storage/session-properties';

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
        const dirArray = this._getDirectories();
        const historyCommand = historyData[historyProperties.command];
        switch (historyCommand) {
            case historyProperties.logOut:
                sessionStorage.removeItem(sessionProperties.authToken);
                sessionStorage.removeItem(sessionProperties.projectId);
                sessionStorage.removeItem(historyProperties.directoryArray);
                break;
            case historyProperties.goToProject:
                sessionStorage.removeItem(sessionProperties.projectId);
                sessionStorage.removeItem(historyProperties.directoryArray);
                break;
            case historyProperties.goUp:
                this._handleGoUp(dirArray);
                break;
            case historyProperties.goInside:
                this._handleGoInside(historyData, dirArray);
                break;
            default:
                console.error(`History command: \
                ${history[historyProperties.command]} wrong value.`);
        }
    }

    _handleGoInside(historyData, dirArray) {
        const dirId = historyData[historyProperties.directoryId];
        if (dirId === undefined) {
            throw new HistoryError('Missing directoryId.');
        }
        if (dirArray === null) {
            this._setDirectories([dirId]);
        } else {
            dirArray.push(dirId);
            this._setDirectories(dirArray);
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
