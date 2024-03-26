import { RootState } from '../../store';

import { LogInValues, SessionActionTypes, UserInfo } from './session-reducer-types';

class SessionActions {
  reduxStore: any;

  init = (reduxStore: RootState): void => {
    this.reduxStore = reduxStore;
  };

  saveLoginValues = (logInValues: LogInValues): void => {
    this.reduxStore.dispatch({
      type: SessionActionTypes.LOG_IN,
      logInValues,
    });
  };

  logIn = (authToken: string): void => {
    this.reduxStore.dispatch({
      type: SessionActionTypes.LOGGED_IN,
      authToken,
    });
  };

  enableLoading = (): void => {
    this.reduxStore.dispatch({
      type: SessionActionTypes.SET_LOADING,
      loading: true,
    });
  };

  disableLoading = (): void => {
    this.reduxStore.dispatch({
      type: SessionActionTypes.SET_LOADING,
      loading: false,
    });
  };

  logOut = (): void => {
    this.reduxStore.dispatch({ type: SessionActionTypes.LOG_OUT });
  };

  saveUserInfo = (userInfo: UserInfo): void => {
    this.reduxStore.dispatch({
      type: SessionActionTypes.GET_USER_INFO,
      userFullName: userInfo.fullName,
      userInitials: userInfo.initials,
      userID: userInfo.id,
    });
  };

  setAttrFormPrivilege = (attrFormPrivilege: boolean): void => {
    this.reduxStore.dispatch({
      type: SessionActionTypes.SET_ATTR_FORM_PRIVILEGE,
      attrFormPrivilege,
    });
  };
}

export const sessionActions = new SessionActions();
