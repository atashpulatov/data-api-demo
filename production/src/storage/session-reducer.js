import { sessionProperties } from './session-properties';
import { SessionError } from './session-error';

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
  }
  return state;
};

function onLogIn(action, state) {
  if (!action.envUrl) {
    throw new SessionError('Missing EnvUrl.');
  }
  return {
    ...state,
    envUrl: action.envUrl,
  };
}
function onLogOut(action, state) {
  if (state.isRememberMeOn) {
    return {
      ...state,
      authToken: undefined,
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
