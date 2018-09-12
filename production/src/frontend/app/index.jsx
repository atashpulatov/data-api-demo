/*eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './home/home.jsx';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
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
    <Home />
    , document.getElementById('root')
  );
}

// goReact();
officeInitialize();

registerServiceWorker();
