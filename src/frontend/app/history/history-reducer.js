import { HistoryError } from './history-error';
import { historyProperties } from './history-properties';

export const historyReducer = (state = {}, action) => {
    switch (action.type) {
        case historyProperties.actions.goInside:
            return onGoInside(action, state);
        case historyProperties.actions.goUp:
            return onGoUp(state);
        case historyProperties.actions.goToProject:
            if (!action.projectId) {
                throw new HistoryError('Missing projectId.');
            }
            return {
                ...state,
                projectId: action.projectId,
            };
        case historyProperties.actions.logOut:
            return onLogOut(state);
    }
    console.warn(`History command: `
        + `'${action.type}'`
        + ` is not supported.`);
    return state;
};

function onLogOut(state) {
    return {
        ...state,
        directoryArray: undefined,
    };
}

function onGoUp(state) {
    const updatedArr = [...state.directoryArray];
    updatedArr.splice(-1, 1);
    return {
        ...state,
        directoryArray: updatedArr,
    };
}

function onGoInside(action, state) {
    if (!action.dirId) {
        throw new HistoryError('Missing directoryId.');
    }
    const oldArr = state.directoryArray ? state.directoryArray : [];
    return {
        ...state,
        directoryArray: oldArr.concat(action.dirId),
    };
}
