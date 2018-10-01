/*eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './home/home.jsx';
import registerServiceWorker from './registerServiceWorker';
import { reduxStore, reduxPersistor } from './store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import './index.css';
/* eslint-enable */

function goReact() {
  ReactDOM.render(
    <div>
      <h1>
        TEST
      </h1>
    </div>
    , document.getElementById('popup')
  );
}

goReact();

registerServiceWorker();
