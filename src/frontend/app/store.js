import { createStore, combineReducers } from 'redux';
import { historyReducer } from './history/history-reducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { sessionReducer } from './storage/session-reducer';

const rootReducer = combineReducers({
    sessionReducer,
    historyReducer,
});
const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['historyReducer'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const reduxStore = createStore(persistedReducer);
export const reduxPersistor = persistStore(reduxStore);
