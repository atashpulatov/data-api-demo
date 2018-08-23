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
    }
    return state;
};

function onLogIn(action, state) {
    if (!action.envUrl) {
        throw new SessionError('Missing EnvUrl.');
    }
    if (!action.username) {
        throw new SessionError('Missing Username.');
    }
    return {
        ...state,
        envUrl: action.envUrl,
        username: action.username,
        isRememberMeOn: action.isRememberMeOn !== undefined
            ? action.isRememberMeOn
            : false,
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

function onSetProperty(action, state) {
    let newState = { ...state };
    newState[action.propertyName] = action.propertyValue;
    return newState;
}
