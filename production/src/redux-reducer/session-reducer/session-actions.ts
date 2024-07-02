import { reduxStore } from '../../store';

import { LogInValues, SessionActionTypes, UserInfo } from './session-reducer-types';

class SessionActions {
  saveLoginValues = (logInValues: LogInValues): void => {
    reduxStore.dispatch({
      type: SessionActionTypes.LOG_IN,
      logInValues,
    });
  };

  logIn = (authToken: string): void => {
    reduxStore.dispatch({
      type: SessionActionTypes.LOGGED_IN,
      authToken,
    });
  };

  enableLoading = (): void => {
    reduxStore.dispatch({
      type: SessionActionTypes.SET_LOADING,
      loading: true,
    });
  };

  disableLoading = (): void => {
    reduxStore.dispatch({
      type: SessionActionTypes.SET_LOADING,
      loading: false,
    });
  };

  logOut = (): void => {
    reduxStore.dispatch({ type: SessionActionTypes.LOG_OUT });
  };

  saveUserInfo = (userInfo: UserInfo): void => {
    reduxStore.dispatch({
      type: SessionActionTypes.GET_USER_INFO,
      userFullName: userInfo.fullName,
      userInitials: userInfo.initials,
      userID: userInfo.id,
    });
  };

  setAttrFormPrivilege = (attrFormPrivilege: boolean): void => {
    reduxStore.dispatch({
      type: SessionActionTypes.SET_ATTR_FORM_PRIVILEGE,
      attrFormPrivilege,
    });
  };
}

export const sessionActions = new SessionActions();
