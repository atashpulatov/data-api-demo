import di from './mstr-object-di';

async function getProjectContent(folderType) {
    const envUrl = sessionStorage.getItem('envUrl');
    const token = sessionStorage.getItem('x-mstr-authtoken');
    const projectId = sessionStorage.getItem('x-mstr-projectid');
    const fullPath = `${envUrl}/folders/preDefined/${folderType}`;
    return await di.request.get(fullPath)
        .set('x-mstr-authtoken', token)
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
};
