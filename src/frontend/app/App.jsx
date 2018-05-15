import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import di from './root-di';

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
    console.log(Router);
    console.log(Route);
    return (
      <Router>
        <div id="content">
          <div id="content-header">
            <div className="padding">
              <h1>Microstrategy Office</h1>
            </div>
          </div>
          <div id="content-main">
            <br />
            <br />
            <div>
              <Route exact path="/" component={di.Main}/>
              <Route path="/login" component={di.Login}/>
              <Route path="/projects" component={di.Projects}/>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
