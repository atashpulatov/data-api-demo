// issue with storage import
// eslint-disable-next-line simple-import-sort/imports
import { Store, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { thunk } from 'redux-thunk';

import storage from 'redux-persist/lib/storage';
import packageJson from '../package.json';
import { answersReducer } from './redux-reducer/answers-reducer/answers-reducer';
import { configReducer } from './redux-reducer/config-reducer/config-reducer';
import { navigationTree } from './redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import { notificationReducer } from './redux-reducer/notification-reducer/notification-reducer';
import { objectReducer } from './redux-reducer/object-reducer/object-reducer';
import { officeReducer } from './redux-reducer/office-reducer/office-reducer';
import { operationReducer } from './redux-reducer/operation-reducer/operation-reducer';
import { popupReducer } from './redux-reducer/popup-reducer/popup-reducer';
import { popupStateReducer } from './redux-reducer/popup-state-reducer/popup-state-reducer';
import { repromptsQueueReducer } from './redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer';
import { sessionReducer } from './redux-reducer/session-reducer/session-reducer';
import { settingsReducer } from './redux-reducer/settings-reducer/settings-reducer';

const rootReducer = combineReducers({
  sessionReducer,
  officeReducer,
  configReducer,
  notificationReducer,
  navigationTree,
  popupReducer,
  popupStateReducer,
  operationReducer,
  objectReducer,
  answersReducer,
  repromptsQueueReducer,
  settingsReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['navigationTree', 'operationReducer', 'notificationReducer'],
};

// @ts-expect-error
const persistedReducer = persistReducer(persistConfig, rootReducer);
let middleWare;
if (process.env.NODE_ENV === 'development') {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  middleWare = composeEnhancers(applyMiddleware(thunk));
} else {
  middleWare = applyMiddleware(thunk);
}
export const reduxStore = createStore(persistedReducer, middleWare);
// @ts-expect-error
export const reduxPersistor = persistStore(reduxStore);

export type RootState = ReturnType<typeof reduxStore.getState>;
export type ReduxStore = Store<RootState>;

if (localStorage) {
  const version = localStorage.getItem('version');
  const APP_VERSION = packageJson.build;
  if (APP_VERSION !== version) {
    reduxPersistor.purge();
    localStorage.setItem('version', APP_VERSION);
  }
}
