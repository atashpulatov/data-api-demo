/* eslint-disable */
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import di from './root-di.js';
import Routes from './routes.jsx';
import { reduxStore, reduxPersistor } from './store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
/* eslint-enable */

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={reduxStore}>
        <PersistGate persistor={reduxPersistor}>
          <di.Router>
            <div id="content">
              <di.Header />
              <di.MenuBar />
              <Routes />
              <di.Footer />
            </div>
          </di.Router>
        </PersistGate>
      </Provider>

    );
  }
}

export default App;
