import { mstrTutorial } from '../mockData';

function getProjectContent(projectId) {
    return mstrTutorial;
}

function getFolderContent() {
    return 'ProperContent';
}

export default {
    getProjectContent,
    getFolderContent,
};
