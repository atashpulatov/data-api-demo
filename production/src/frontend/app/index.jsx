/*eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './home/home.jsx';
import registerServiceWorker from './registerServiceWorker';
import { reduxStore, reduxPersistor } from './store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import './index.css';
import 'mstr-react/lib/css/mstr-react.css';
/* eslint-enable */
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
        <Home loading={false} />
      </PersistGate>
    </Provider>
    , document.getElementById('root')
  );
}

// goReact();
officeInitialize();

registerServiceWorker();
