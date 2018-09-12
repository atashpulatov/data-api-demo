/*eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app.jsx';
import registerServiceWorker from './registerServiceWorker';
/* eslint-enable */
const Office = window.Office;

function officeInitialize() {
  console.log(Office);
  Office.onReady()
    .then(() => {
      console.log(Excel);
      goReact();
    });
}

function goReact() {
  ReactDOM.render(
    <App />
    , document.getElementById('root')
  );
}

// goReact();
officeInitialize();

registerServiceWorker();
