import { HistoryError } from './history-error';
import { historyProperties } from './history-properties';
import { sessionProperties } from '../storage/session-properties';

export const historyReducer = (state = {}, action) => {
    switch (action.type) {
        case historyProperties.actions.goInsideProject:
            return onGoInsideProject(action, state);
        case historyProperties.actions.goInside:
            return onGoInside(action, state);
        case historyProperties.actions.goUp:
            return onGoUp(state);
        case historyProperties.actions.goToProjects:
        case sessionProperties.actions.logOut:
            return eraseHistory(state);
    }
    return state;
};

function onGoInsideProject(action, state) {
    if (!action.projectId) {
        throw new HistoryError('Missing projectId.');
    }
    if (!action.projectName) {
        throw new HistoryError('Missing projectName.');
    }
    return {
        ...state,
        project: {
            projectId: action.projectId,
            projectName: action.projectName,
        },
    };
}

function eraseHistory(state) {
    return {
        ...state,
        project: undefined,
        directoryArray: undefined,
    };
}

function onGoUp(state) {
    if (!state.directoryArray) {
        return {
            ...state,
            project: undefined,
        };
    }
    const updatedArr = [...state.directoryArray];
    updatedArr.splice(-1, 1);
    return {
        ...state,
        directoryArray: updatedArr,
    };
}

function onGoInside(action, state) {
    if (!action.dirId) {
        throw new HistoryError('Missing dirId.');
    }
    if (!action.dirName) {
        throw new HistoryError('Missing dirName.');
    }
    const directory = {
        dirId: action.dirId,
        dirName: action.dirName,
    };
    const oldArr = state.directoryArray ? state.directoryArray : [];
    return {
        ...state,
        directoryArray: oldArr.concat(directory),
    };
}
