import { createStore } from 'redux';
import { HistoryError } from './history-error';
import { historyProperties } from './history-properties';

const historyReducer = (state = {}, action) => {
    switch (action.type) {
        case historyProperties.actions.goInside:
            if (!action.dirId) {
                throw new HistoryError('Missing directoryId.');
            }
            const oldArr = state.directoryArray ? state.directoryArray : [];
            return {
                ...state,
                directoryArray: oldArr.concat(action.dirId),
            };
        case historyProperties.actions.goUp:
            const updatedArr = [...state.directoryArray];
            updatedArr.splice(-1, 1);
            return {
                ...state,
                directoryArray: updatedArr,
            };
        case historyProperties.actions.goToProject:
        case historyProperties.actions.logOut:
            return {
                ...state,
                directoryArray: undefined,
            };
    }
    console.warn(`History command: `
        + `'${action.type}'`
        + ` is not supported.`);
    return state;
};

export const historyStore = createStore(historyReducer);
