import di from './project-di';
import StorageService from '../storage/storage-service';
import propertiesEnum from '../storage/properties-enum';

async function getProjectList() {
    const envUrl = StorageService.getProperty(propertiesEnum['envUrl']);
    const authToken = StorageService.getProperty(propertiesEnum['authToken']);
    return await di.request.get(envUrl + '/projects')
            .set('x-mstr-authtoken', authToken)
            .withCredentials()
            .then((res) => {
                console.log(res);
                let projects = res.body;
                return projects;
            })
        .catch((err) => {
        console.error(`Error: ${err.response.status}`
            + ` (${err.response.statusMessage})`);
        });
}

export default {
    getProjectList,
};
