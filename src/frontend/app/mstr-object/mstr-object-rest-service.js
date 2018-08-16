import { sessionProperties } from '../storage/session-properties';
import StorageService from '../storage/storage-service';
import di from './mstr-object-di';
import { errorHandler } from '../error/error-service';
import { reduxStore } from '../store';

class MstrObjectRestService {
    async getProjectContent(folderType, envUrl, authToken, projectId) {
        const fullPath = `${envUrl}/folders/preDefined/${folderType}`;
        return await di.request.get(fullPath)
            .set('x-mstr-authtoken', authToken)
            .set('x-mstr-projectid', projectId)
            .withCredentials()
            .then((res) => {
                let objects = res.body;
                return objects;
            })
            .catch((err) => {
                errorHandler(err);
            });
    }

    async getFolderContent(envUrl, authToken, projectId, folderId) {
        const fullPath = `${envUrl}/folders/${folderId}`;
        return await di.request.get(fullPath)
            .set('x-mstr-authtoken', authToken)
            .set('x-mstr-projectid', projectId)
            .withCredentials()
            .then((res) => {
                let objects = res.body;
                return objects;
            })
            .catch((err) => {
                errorHandler(err);
            });
    }

    async _getInstanceId(fullPath, authToken, projectId) {
        return await di.request.post(fullPath)
            .set('x-mstr-authtoken', authToken)
            .set('x-mstr-projectid', projectId)
            .withCredentials()
            .then((res) => {
                let objects = res.body;
                return objects.instanceId;
            })
            .catch((err) => {
                errorHandler(err);
            });
    }

    async getObjectContent(objectId) {
        const storeState = reduxStore.getState();
        const envUrl = storeState.sessionReducer.envUrl;
        const authToken = storeState.sessionReducer.authToken;
        const projectId = storeState.historyReducer.projectId;
        let fullPath = `${envUrl}/reports/${objectId}/instances`;
        const reportInstance = await this._getInstanceId(fullPath, authToken, projectId);
        fullPath += `/${reportInstance}`;
        return await di.request.get(fullPath)
            .set('x-mstr-authtoken', authToken)
            .set('x-mstr-projectid', projectId)
            .withCredentials()
            .then((res) => {
                let objects = res.body;
                return objects;
            })
            .catch((err) => {
                errorHandler(err);
            });
    }
};


export default new MstrObjectRestService();
