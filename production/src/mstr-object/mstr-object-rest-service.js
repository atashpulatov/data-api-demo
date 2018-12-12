import { errorHandler } from '../error/error-handler';
import { reduxStore } from '../store';
import { moduleProxy } from '../module-proxy';

const sharedFolderIdType = 7;

class MstrObjectRestService {
    async getProjectContent(envUrl, authToken, projectId,
        folderType = sharedFolderIdType) {
        //
        const fullPath = `${envUrl}/folders/preDefined/${folderType}`;
        return await moduleProxy.request
            .get(fullPath)
            .set('x-mstr-authtoken', authToken)
            .set('x-mstr-projectid', projectId)
            .withCredentials()
            .then((res) => {
                return res.body;
            })
            .catch((err) => {
                errorHandler(err);
            });
    }

    async getFolderContent(envUrl, authToken, projectId, folderId) {
        const fullPath = `${envUrl}/folders/${folderId}`;
        return await moduleProxy.request
            .get(fullPath)
            .set('x-mstr-authtoken', authToken)
            .set('x-mstr-projectid', projectId)
            .withCredentials()
            .then((res) => {
                return res.body;
            })
            .catch((err) => {
                errorHandler(err);
            });
    }

    async _getInstanceId(fullPath, authToken, projectId, body) {
        return await moduleProxy.request
            .post(fullPath)
            .set('x-mstr-authtoken', authToken)
            .set('x-mstr-projectid', projectId)
            .send(body)
            .withCredentials()
            .then((res) => {
                return res.body.instanceId;
            })
            .catch((err) => {
                errorHandler(err);
            });
    }

    async getObjectContent(objectId, body) {
        const storeState = reduxStore.getState();
        const envUrl = storeState.sessionReducer.envUrl;
        const authToken = storeState.sessionReducer.authToken;
        const projectId = storeState.historyReducer.project.projectId;
        let fullPath = `${envUrl}/reports/${objectId}/instances`;
        const reportInstance = await this._getInstanceId(fullPath, authToken, projectId, body);
        fullPath += `/${reportInstance}`;
        return await moduleProxy.request
            .get(fullPath)
            .set('x-mstr-authtoken', authToken)
            .set('x-mstr-projectid', projectId)
            .withCredentials()
            .then((res) => {
                return res.body;
            })
            .catch((err) => {
                errorHandler(err);
            });
    }
};


export const mstrObjectRestService = new MstrObjectRestService();
