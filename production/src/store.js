import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { historyReducer } from './history/history-reducer';
import { sessionReducer } from './storage/session-reducer';
import { navigationTree } from './storage/navigation-tree-reducer';
import { officeReducer } from './office/office-reducer';
import { notificationReducer } from './notification/reducer';
import { popupReducer } from './popup/popup-reducer';
import cacheReducer from './cache/cache-reducer';
import { browserReducer } from './browser/browser-reducer';

const rootReducer = combineReducers({
  sessionReducer,
  historyReducer,
  officeReducer,
  notificationReducer,
  navigationTree,
  popupReducer,
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
