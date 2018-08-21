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
                reduxStore.dispatch({
                    type: historyProperties.actions.goUpTo,
                    dirId: dirId,
                });
                break;
            case historyProperties.actions.goInside:
                dirId = historyData[historyProperties.directoryId];
                const dirName = historyData[historyProperties.directoryName];
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
};

export const historyManager = new HistoryManager();
