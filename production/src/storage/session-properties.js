import { propsProxy } from '../home/enum-props-proxy';

export const sessionProperties = new Proxy({
    /**
     * propertyAlias: propertyName,
     */
    authToken: 'x-mstr-authtoken',
    projectId: 'x-mstr-projectid',
    projectName: 'mstr-project-name',
    envUrl: 'mstr-environment-url',
    isRememberMeOn: 'mstr-remember-me-on',
    username: 'mstr-username',
    actions: {
        logIn: 'SESSION_LOG_IN',
        logOut: 'SESSION_LOG_OUT',
        loggedIn: 'SESSION_LOGGED_IN',
        setProperty: 'SESSION_SET_PROPERTY',
        setLoading: 'SESSION_SET_LOADING',
    },
}, propsProxy);
