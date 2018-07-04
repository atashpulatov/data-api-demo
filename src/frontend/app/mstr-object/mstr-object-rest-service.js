import di from './mstr-object-di';
import StorageService from '../storage/storage-service';
import sessionPropertiesEnum from '../storage/session-properties';

class MstrObjectRestService {
    async getProjectContent(folderType, envUrl, authToken, projectId) {
        const fullPath = `${envUrl}/folders/preDefined/${folderType}`;
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
                console.error(`Error: ${err.response.status}`
                    + ` (${err.response.statusMessage})`);
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
                console.error(`Error: ${err.response.status}`
                    + ` (${err.response.statusMessage})`);
            });
    }

    async getObjectContent(objectId) {
        const envUrl = StorageService.getProperty(sessionPropertiesEnum['envUrl']);
        const authToken = StorageService.getProperty(sessionPropertiesEnum['authToken']);
        const projectId = StorageService.getProperty(sessionPropertiesEnum['projectId']);
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
                console.error(`Error: ${err.response.status}`
                    + ` (${err.response.statusMessage})`);
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
                console.error(`Error: ${err.response.status}`
                    + ` (${err.response.statusMessage})`);
            });
    }
};


export default new MstrObjectRestService();
