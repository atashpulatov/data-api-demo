import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { sessionReducer } from './storage/session-reducer';
import { navigationTree } from './storage/navigation-tree-reducer';
import { officeReducer } from './office/office-reducer';
import { notificationReducer } from './notification/reducer';
import { popupReducer } from './popup/popup-reducer';
import cacheReducer from './cache/cache-reducer';
import {popupStateReducer} from './popup/popup-state-reducer';

const rootReducer = combineReducers({
  sessionReducer,
  officeReducer,
  notificationReducer,
  navigationTree,
  popupReducer,
  popupStateReducer,
  cacheReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['historyReducer', 'officeReducer', 'notificationReducer', 'cacheReducer'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const reduxStore = createStore(persistedReducer,
  applyMiddleware(thunk));
export const reduxPersistor = persistStore(reduxStore);
