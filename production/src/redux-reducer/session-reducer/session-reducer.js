import { sessionProperties } from './session-properties';
import { SessionError } from '../../error/session-error';

export const sessionReducer = (state = {}, action) => {
  switch (action.type) {
    case sessionProperties.actions.logIn:
      return onLogIn(action, state);
    case sessionProperties.actions.logOut:
      return onLogOut(action, state);
    case sessionProperties.actions.loggedIn:
      return onLoggedIn(action, state);
    case sessionProperties.actions.setLoading:
      return onSetLoading(action, state);
    case sessionProperties.actions.getUserInfo:
      return onGetUserInfo(action, state);
    case sessionProperties.actions.setDialog:
      return onSetDialog(action, state);
    case sessionProperties.actions.setAttrFormPrivilege:
      return onSetAttrFormPrivilege(action, state);
    default:
      break;
  }
  return state;
};

function onLogIn(action, state) {
  const { values } = action;
  if (!values || !values.envUrl) {
    throw new SessionError('Missing EnvUrl.');
  }
  return {
    ...state,
    ...values,
  };
}
function onLogOut(action, state) {
  if (state.isRememberMeOn) {
    return {
      ...state,
      authToken: false,
      userID: null,
      userFullName: null,
      userInitials: null,
    };
  }
  return {};
}

function onLoggedIn(action, state) {
  if (!action.authToken) {
    throw new SessionError('Missing AuthToken.');
  }
  return {
    ...state,
    authToken: action.authToken,
  };
}

function onSetLoading(action, state) {
  if (typeof action.loading === 'undefined') {
    throw new SessionError('Missing loading');
  }
  return {
    ...state,
    loading: action.loading,
  };
}
function onGetUserInfo(action, state) {
  return {
    ...state,
    userID: action.userID,
    userFullName: action.userFullName,
    userInitials: action.userInitials,
  };
}

function onSetDialog(action, state) {
  return {
    ...state,
    dialog: action.dialog,
  };
}

function onSetAttrFormPrivilege(action, state) {
  return {
    ...state,
    attrFormPrivilege: action.attrFormPrivilege,
  };
}
