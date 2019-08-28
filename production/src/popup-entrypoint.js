import 'airbnb-browser-shims';
import 'proxy-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Popup } from './popup/popup';

const { Office } = window;

function officeInitialize() {
  Office.onReady()
    .then(() => {
      goReact();
    });
}

function goReact() {
  ReactDOM.render(
    <BrowserRouter>
      <Route path="/" component={Popup} />
    </BrowserRouter>,
    document.getElementById('popup'),
  );
}

officeInitialize();
