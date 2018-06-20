import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import di from './root-di.js';
import Header from './header.jsx';
import Routes from './routes.jsx';

const Router = di.Router; // eslint-disable-line no-unused-vars

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div id="content">
        <Header />
        <Routes />
        </div>
      </Router>
    );
  }
}

export default App;
