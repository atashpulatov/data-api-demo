import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import di from './root-di.js';
import OfficeApiTest from './OfficeApiTests.jsx'; // eslint-disable-line no-unused-vars
import projectLogic from './project/project-logic';

console.log(di);
const Router = di.Router; // eslint-disable-line no-unused-vars
const Route = di.Route; // eslint-disable-line no-unused-vars

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div id="content">
          <div id="content-header">
            <div className="padding">
              <h1>Microstrategy Office</h1>
            </div>
            <OfficeApiTest />
          </div>
          <div id="content-main">
            <div>
              <Route exact path="/" component={di.Main} />
              <Route path="/auth" component={di.Auth} />
              <Route path="/projects" component={di.Projects} navigateToProject={projectLogic.navigateToProject}/>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
