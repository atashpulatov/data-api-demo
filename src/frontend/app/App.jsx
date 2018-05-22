import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import di from './root-di.js';
import OfficeApiTest from './OfficeApiTests.jsx';

console.log(di);
const Router = di.Router;
const Route = di.Route;

class App extends Component {
  constructor(props) {
    super(props);

    this.onSetColor = this.onSetColor.bind(this);
  }

  onSetColor() {
    window.Excel.run(async (context) => {
      const range = context.workbook.getSelectedRange();
      range.format.fill.color = 'red';
      await context.sync();
    });
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
              <Route exact path="/" component={di.Main}/>
              <Route path="/auth" component={di.Auth}/>
              <Route path="/projects" component={di.Projects}/>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
