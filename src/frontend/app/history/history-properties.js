import { propsProxy } from '../enum-props-proxy';

export const historyProperties = new Proxy({
    /**
     * propertyAlias: propertyName,
     */
    directoryId: 'mstr-directoryid',
    directoryArray: 'history-directory-array',
    projectId: 'x-mstr-projectid',
    projectName: 'mstr-project-name',
    command: 'history-command',
    // Reducer actions' types. Don't need to be wrapped into Proxy
    actions: {
        goUp: 'HISTORY_GO_UP',
        goToProjects: 'HISTORY_GO_PROJECTS',
        goInsideProject: 'HISTORY_GO_INSIDE_PROJECTS',
        goInside: 'HISTORY_GO_INSIDE',
    },
}, propsProxy);
