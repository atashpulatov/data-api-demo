import { createStore, combineReducers } from 'redux';
import { historyReducer } from './history/history-reducer';

const masterReducer = combineReducers({
    historyReducer,
});

export const reduxStore = createStore(masterReducer);
