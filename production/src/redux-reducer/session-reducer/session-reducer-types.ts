import { Action } from 'redux';

export interface UserInfo {
  fullName: string;
  initials: string;
  id: string;
}

export interface LogInValues {
  envUrl: string;
  authToken?: string;
  username?: string;
  password?: string;
  loginMode?: number;
}

export interface SessionState {
  envUrl?: string;
  authToken?: string;
  userID?: string;
  userFullName?: string;
  userInitials?: string;
  canUseOffice?: boolean;
  isRememberMeOn?: boolean;
  loading?: boolean;
  attrFormPrivilege?: boolean;
}

export enum SessionActionTypes {
  LOG_IN = 'SESSION_LOG_IN',
  LOG_OUT = 'SESSION_LOG_OUT',
  LOGGED_IN = 'SESSION_LOGGED_IN',
  SET_LOADING = 'SESSION_SET_LOADING',
  GET_USER_INFO = 'SESSION_GET_USERINFO',
  SET_DIALOG = 'SESSION_SET_DIALOG',
  SET_ATTR_FORM_PRIVILEGE = 'SESSION_SET_ATTR_FORM_PRIVILEGE',
}

export interface LogInAction extends Action {
  type: SessionActionTypes.LOG_IN;
  logInValues: LogInValues; // Replace 'any' with the appropriate type
}

export interface LogOutAction extends Action {
  type: SessionActionTypes.LOG_OUT;
}

export interface LoggedInAction extends Action {
  type: SessionActionTypes.LOGGED_IN;
  authToken: string;
}

export interface SetLoadingAction extends Action {
  type: SessionActionTypes.SET_LOADING;
  loading: boolean;
}

export interface GetUserInfoAction extends Action {
  type: SessionActionTypes.GET_USER_INFO;
  userID: string;
  userFullName: string;
  userInitials: string;
}

export interface SetAttrFormPrivilegeAction extends Action {
  type: SessionActionTypes.SET_ATTR_FORM_PRIVILEGE;
  attrFormPrivilege: any; // Replace 'any' with the appropriate type
}

export type SessionActions =
  | LogInAction
  | LogOutAction
  | LoggedInAction
  | SetLoadingAction
  | GetUserInfoAction
  | SetAttrFormPrivilegeAction;
