import { propsProxy } from '../enum-props-proxy';

export const historyProperties = new Proxy({
    /**
     * propertyAlias: propertyName,
     */
    directoryId: 'mstr-directoryid',
    directoryArray: 'history-directory-array',
    projectId: 'x-mstr-projectid',
    command: 'history-command',
    // Reducer actions' types. Don't need to be wrapped into Proxy
    actions: {
        goUp: 'HISTORY_GO_UP',
        goToProjects: 'HISTORY_GO_PROJECTS',
        goInsideProject: 'HISTORY_GO_INTO_PROJECTS',
        goInside: 'HISTORY_GO_INSIDE',
        logOut: 'HISTORY_LOG_OUT',
    },
}, propsProxy);
