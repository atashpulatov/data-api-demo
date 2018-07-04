import { propsProxy } from '../enum-props-proxy';

export const historyProperties = new Proxy({
    /**
     * propertyAlias: propertyName,
     */
    command: 'history-command',
    goUp: 'history-go-up',
    goToProject: 'history-go-project',
    goInside: 'history-go-inside',
    logOut: 'history-logOut',
    directoryId: 'mstr-directoryid',
    directoryArray: 'history-directory-array',
}, propsProxy);
