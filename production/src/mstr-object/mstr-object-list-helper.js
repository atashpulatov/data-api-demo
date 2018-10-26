import { reduxStore } from '../store';
import { historyHelper } from '../history/history-helper';
import { mstrObjectRestService } from './mstr-object-rest-service';
import { historyProperties } from '../history/history-properties';
import { sessionHelper } from '../storage/session-helper';

class MstrObjectListHelper {
    async fetchContent(dirArray) {
        const envUrl = reduxStore.getState().sessionReducer.envUrl;
        const token = reduxStore.getState().sessionReducer.authToken;
        const { projectId } = reduxStore.getState()
            .historyReducer.project || {};
        let data = [];
        if (historyHelper.isDirectoryStored(dirArray)) {
            const { dirId } = historyHelper
                .getCurrentDirectory(dirArray);
            data = await mstrObjectRestService
                .getFolderContent(envUrl, token, projectId, dirId);
        } else {
            data = await mstrObjectRestService
                .getProjectContent(envUrl, token, projectId);
        }
        return data;
    }

    navigateToDir(directoryId, directoryName) {
        sessionHelper.enableLoading();
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: directoryId,
            dirName: directoryName,
        });
    }

    compareMstrObjectArrays(array1, array2) {
        return JSON.stringify(array1) === JSON.stringify(array2);
    }
}

export const mstrObjectListHelper = new MstrObjectListHelper();
