import { createStore, combineReducers, applyMiddleware } from 'redux';
import { historyReducer } from './history/history-reducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { sessionReducer } from './storage/session-reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

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

export const reduxStore = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware())
);
export const reduxPersistor = persistStore(reduxStore);
