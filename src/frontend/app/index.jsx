/*eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';
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

registerServiceWorker();
