/*eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import di from './root-di.js';
import App from './app.jsx';
/* eslint-enable */
const Office = window.Office;

function officeInitialize() {
  Office.initialize = () => {
  };
}

function goReact() {
  ReactDOM.render(
    <App />
    , document.getElementById('root')
  );
}

goReact();
officeInitialize();

di.registerServiceWorker();
