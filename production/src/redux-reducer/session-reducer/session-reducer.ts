/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  GetUserInfoAction,
  LoggedInAction,
  LogInAction,
  LogOutAction,
  SessionActions,
  SessionActionTypes,
  SessionState,
  SetAttrFormPrivilegeAction,
  SetLoadingAction,
} from './session-reducer-types';

const initialState: SessionState = {};

export const sessionReducer = (
  state = initialState,
  action = {} as SessionActions
): SessionState => {
  switch (action.type) {
    case SessionActionTypes.LOG_IN:
      return onLogIn(action, state);
    case SessionActionTypes.LOG_OUT:
      return onLogOut(action, state);
    case SessionActionTypes.LOGGED_IN:
      return onLoggedIn(action, state);
    case SessionActionTypes.SET_LOADING:
      return onSetLoading(action, state);
    case SessionActionTypes.GET_USER_INFO:
      return onGetUserInfo(action, state);
    case SessionActionTypes.SET_ATTR_FORM_PRIVILEGE:
      return onSetAttrFormPrivilege(action, state);
    default:
      break;
  }
  return state;
};

function onLogIn(action: LogInAction, state: SessionState): SessionState {
  const { logInValues } = action;

  return {
    ...state,
    ...logInValues,
  };
}

function onLogOut(action: LogOutAction, state: SessionState): SessionState {
  window.localStorage.removeItem('iSession');

  if (state.isRememberMeOn) {
    return {
      ...state,
      authToken: '',
      userID: null,
      userFullName: null,
      userInitials: null,
      canUseOffice: false,
    };
  }
  return {};
}

function onLoggedIn(action: LoggedInAction, state: SessionState): SessionState {
  return {
    ...state,
    authToken: action.authToken,
  };
}

function onSetLoading(action: SetLoadingAction, state: SessionState): SessionState {
  return {
    ...state,
    loading: action.loading,
  };
}
function onGetUserInfo(userInfo: GetUserInfoAction, state: SessionState): SessionState {
  return {
    ...state,
    userID: userInfo.userID,
    userFullName: userInfo.userFullName,
    userInitials: userInfo.userInitials,
  };
}

function onSetAttrFormPrivilege(
  action: SetAttrFormPrivilegeAction,
  state: SessionState
): SessionState {
  return {
    ...state,
    attrFormPrivilege: action.attrFormPrivilege,
  };
}
