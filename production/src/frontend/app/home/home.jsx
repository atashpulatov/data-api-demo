/* eslint-disable */
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { Routes } from './routes.jsx';
import { HashRouter as Router } from 'react-router-dom';
import { reduxStore, reduxPersistor } from '../store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs.jsx';
import { Header } from './header.jsx';
import { MenuBar } from '../navigation/menu-bar.jsx';
import { Footer } from './footer.jsx';
import { OfficeLoadedFiles } from './office-loaded-files.jsx';
import './home.css';
/* eslint-enable */

export class Home extends Component {
  render() {
    return (
      <Provider store={reduxStore}>
        <PersistGate persistor={reduxPersistor}>
          <Router>
            <div id="content">
              <Header />
              <MenuBar />
              <Breadcrumbs />
              <OfficeLoadedFiles />
              <Routes />
              <Footer />
            </div>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}
