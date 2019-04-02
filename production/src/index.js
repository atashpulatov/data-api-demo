import 'core-js';
import 'proxy-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Home} from './home/home.jsx';
import i18next from './i18n';
import {I18nextProvider} from 'react-i18next';
// import * as serviceWorker from './serviceWorker';
import {reduxStore, reduxPersistor} from './store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import './index.css';
const Office = window.Office;

function officeInitialize() {
  Office.onReady()
      .then(() => {
        goReact();
      });
}

function goReact() {
  ReactDOM.render(
      <Provider store={reduxStore}>
        <PersistGate persistor={reduxPersistor}>
          <I18nextProvider>
            <Home loading={false} />
          </I18nextProvider>
        </PersistGate>
      </Provider>
      , document.getElementById('root')
  );
}

// goReact();
officeInitialize();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
