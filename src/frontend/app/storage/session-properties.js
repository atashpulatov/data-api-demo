import { propsProxy } from '../enum-props-proxy';

export const sessionProperties = new Proxy({
    /**
     * propertyAlias: propertyName,
     */
    authToken: 'x-mstr-authtoken',
    projectId: 'x-mstr-projectid',
    envUrl: 'mstr-environment-url',
}, propsProxy);
