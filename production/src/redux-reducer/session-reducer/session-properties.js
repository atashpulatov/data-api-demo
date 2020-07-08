import { propsProxy } from '../../home/enum-props-proxy';

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
  userFullName: 'fullName',
  userInitials: 'initials',
  actions: {
    logIn: 'SESSION_LOG_IN',
    logOut: 'SESSION_LOG_OUT',
    loggedIn: 'SESSION_LOGGED_IN',
    setProperty: 'SESSION_SET_PROPERTY',
    setLoading: 'SESSION_SET_LOADING',
    getUserInfo: 'SESSION_GET_USERINFO',
    setDialog: 'SESSION_SET_DIALOG',
    setAttrFormPrivilege: 'SESSION_SET_ATTR_FORM_PRIVILEGE'
  },
}, propsProxy);