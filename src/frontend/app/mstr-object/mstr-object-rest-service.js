import di from './mstr-object-di';
import StorageService from '../storage/storage-service';
import propertiesEnum from '../storage/properties-enum';

async function getProjectContent(folderType) {
    const envUrl = StorageService.getProperty(propertiesEnum['envUrl']);
    const authToken = StorageService.getProperty(propertiesEnum['authToken']);
    const projectId = StorageService.getProperty(propertiesEnum['projectId']);
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

async function getFolderContent() {
    const envUrl = StorageService.getProperty(propertiesEnum['envUrl']);
    const authToken = StorageService.getProperty(propertiesEnum['authToken']);
    const folderId = StorageService.getProperty(propertiesEnum['folderId']);
    const projectId = StorageService.getProperty(propertiesEnum['projectId']);
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

export default {
    getProjectContent,
    getFolderContent,
};
