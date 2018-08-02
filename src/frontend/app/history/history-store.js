import { createStore } from 'redux';
import { historyActions } from './history-actions';
import { HistoryError } from './history-error';

const historyReducer = (state = {}, action) => {
    switch (action.type) {
        case historyActions.goInside:
            if (!action.dirId) {
                throw new HistoryError('Missing directoryId.');
            }
            const oldArr = state.directoryArray ? state.directoryArray : [];
            return {
                ...state,
                directoryArray: oldArr.concat(action.dirId),
            };
        case historyActions.goUp:
            const updatedArr = [...state.directoryArray];
            updatedArr.splice(-1, 1);
            return {
                ...state,
                directoryArray: updatedArr,
            };
        case historyActions.goToProject:
        case historyActions.logOut:
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
