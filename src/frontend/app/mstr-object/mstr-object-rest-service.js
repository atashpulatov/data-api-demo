import { sessionProperties } from '../storage/session-properties';
import StorageService from '../storage/storage-service';
import di from './mstr-object-di';
import { errorHandler } from '../error/error-service';

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
                console.log(res);
                let objects = res.body;
                return objects;
            })
            .catch((err) => {
                errorHandler(err);
            });
    }

    async getObjectContent(objectId) {
        const envUrl = StorageService.getProperty(sessionProperties['envUrl']);
        const authToken = StorageService.getProperty(sessionProperties['authToken']);
        const projectId = StorageService.getProperty(sessionProperties['projectId']);
        let fullPath = `${envUrl}/reports/${objectId}/instances`;
        const reportInstance = await di.request.post(fullPath)
            .set('x-mstr-authtoken', authToken)
            .set('x-mstr-projectid', projectId)
            .withCredentials()
            .then((res) => {
                console.log(res);
                let objects = res.body;
                return objects.instanceId;
            })
            .catch((err) => {
                errorHandler(err);
            });
        fullPath += `/${reportInstance}`;
        return await di.request.get(fullPath)
            .set('x-mstr-authtoken', authToken)
            .set('x-mstr-projectid', projectId)
            .withCredentials()
            .then((res) => {
                console.log(res);
                let objects = res.body;
                return objects;
            })
            .catch((err) => {
                errorHandler(err);
            });
    }
};


export default new MstrObjectRestService();
