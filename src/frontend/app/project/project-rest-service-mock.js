import * as mockData from '../mockData.js';

function getProjectList() {
    return mockData.projects.projectsArray;
}

export let projectRestService = {
    'getProjectList': getProjectList,
};
