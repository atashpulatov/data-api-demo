import {createStore, combineReducers, applyMiddleware} from 'redux';
import {historyReducer} from './history/history-reducer';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {sessionReducer} from './storage/session-reducer';
import {navigationTree} from './storage/navigation-tree-reducer';
import {composeWithDevTools} from 'redux-devtools-extension';
import {officeReducer} from './office/office-reducer';
import {notificationReducer} from './notification/reducer';
import {popupReducer} from './popup/popup-reducer';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  sessionReducer,
  historyReducer,
  officeReducer,
  notificationReducer,
  navigationTree,
  popupReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['historyReducer', 'officeReducer', 'notificationReducer'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const reduxStore = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(thunk))
);
export const reduxPersistor = persistStore(reduxStore);
