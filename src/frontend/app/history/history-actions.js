import { propsProxy } from '../enum-props-proxy';

export const historyActions = new Proxy({
    /**
     * propertyAlias: propertyName,
     */
    goUp: 'HISTORY_GO_UP',
    goToProject: 'HISTORY_GO_PROJECT',
    goInside: 'HISTORY_GO_INSIDE',
    logOut: 'HISTORY_LOG_OUT',
}, propsProxy);
