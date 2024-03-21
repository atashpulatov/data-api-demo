export interface SessionState {
  envUrl?: string;
  authToken?: string;
  userID?: string;
  userFullName?: string;
  userInitials?: string;
  canUseOffice?: boolean;
  isRememberMeOn?: boolean;
  loading?: boolean;
  dialog?: any; // Replace 'any' with the appropriate type
  attrFormPrivilege?: any; // Replace 'any' with the appropriate type
}

export enum SessionActionTypes {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  LOGGED_IN = 'LOGGED_IN',
  SET_LOADING = 'SET_LOADING',
  GET_USER_INFO = 'GET_USER_INFO',
  SET_DIALOG = 'SET_DIALOG',
  SET_ATTR_FORM_PRIVILEGE = 'SET_ATTR_FORM_PRIVILEGE',
}
