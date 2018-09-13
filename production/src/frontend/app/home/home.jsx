/* eslint-disable */
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { Routes } from './routes.jsx';
import { HashRouter as Router } from 'react-router-dom';
import { reduxStore, reduxPersistor } from '../store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs.jsx';
import { Header } from './header.jsx';
import { MenuBar } from '../menu-bar/menu-bar.jsx';
import { Footer } from './footer.jsx';
import { FileHistoryContainer } from '../file-history/file-history-container.jsx';
import './home.css';
/* eslint-enable */

export class Home extends Component {
  render() {
    return (
      <Provider store={reduxStore}>
        <PersistGate persistor={reduxPersistor}>
          <Router>
            <div id='content'>
              <Header />
              <MenuBar />
              <Breadcrumbs />
              <FileHistoryContainer />
              <Routes />
              <Footer />
            </div>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}
