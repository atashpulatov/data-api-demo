import {
  createStore, combineReducers, applyMiddleware, compose
} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { sessionReducer } from './redux-reducer/session-reducer/session-reducer'; 
import { navigationTree } from './redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import { officeReducer } from './redux-reducer/office-reducer/office-reducer';
import { notificationReducer } from './redux-reducer/notification-reducer/notification-reducer';
import { popupReducer } from './redux-reducer/popup-reducer/popup-reducer';
import cacheReducer from './redux-reducer/cache-reducer/cache-reducer';
import { popupStateReducer } from './redux-reducer/popup-state-reducer/popup-state-reducer';
import { operationReducer } from './redux-reducer/operation-reducer/operation-reducer';
import { objectReducer } from './redux-reducer/object-reducer/object-reducer'

const rootReducer = combineReducers({
  sessionReducer,
  officeReducer,
  notificationReducer,
  navigationTree,
  popupReducer,
  popupStateReducer,
  cacheReducer,
  operationReducer,
  objectReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['officeReducer', 'notificationReducer', 'cacheReducer', 'operationReducer', 'objectReducer'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
let middleWare;
if (process.env.NODE_ENV === 'development') {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  middleWare = composeEnhancers(applyMiddleware(thunk));
} else {
  middleWare = applyMiddleware(thunk);
}
export const reduxStore = createStore(persistedReducer, middleWare);
export const reduxPersistor = persistStore(reduxStore);

if (localStorage) {
  const version = localStorage.getItem('version');
  const APP_VERSION = process.env.REACT_APP_MSTR_OFFICE_VERSION;
  if (APP_VERSION !== version) {
    reduxPersistor.purge();
    localStorage.setItem('version', APP_VERSION);
  }
}
