/* eslint-disable */
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import di from './root-di.js';
import Routes from './routes.jsx';
/* eslint-enable */

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <di.Router>
        <div id="content">
          <di.Header />
          <Routes />
          <di.Footer />
        </div>
      </di.Router>
    );
  }
}

export default App;
