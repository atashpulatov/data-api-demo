import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { sessionReducer } from './redux-reducer/session-reducer/session-reducer';
import { navigationTree } from './redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import { officeReducer } from './redux-reducer/office-reducer/office-reducer';
import { notificationReducer } from './redux-reducer/notification-reducer/notification-reducer';
import { popupReducer } from './redux-reducer/popup-reducer/popup-reducer';
import { popupStateReducer } from './redux-reducer/popup-state-reducer/popup-state-reducer';
import { operationReducer } from './redux-reducer/operation-reducer/operation-reducer';
import { objectReducer } from './redux-reducer/object-reducer/object-reducer';
import { answersReducer } from './redux-reducer/answers-reducer/answers-reducer';
import packageJson from '../package.json';

const rootReducer = combineReducers({
  sessionReducer,
  officeReducer,
  notificationReducer,
  navigationTree,
  popupReducer,
  popupStateReducer,
  operationReducer,
  objectReducer,
  answersReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['notificationReducer', 'navigationTree', 'operationReducer', 'objectReducer'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const reduxStore = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    { serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } }
  )
});
export const reduxPersistor = persistStore(reduxStore);

if (localStorage) {
  const version = localStorage.getItem('version');
  const APP_VERSION = packageJson.build;
  if (APP_VERSION !== version) {
    reduxPersistor.purge();
    localStorage.setItem('version', APP_VERSION);
  }
}
