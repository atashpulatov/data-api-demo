import React, { Component } from 'react';
import {
  BrowserRouter as Router, 
  Route, 
  browserHistory,
  Link 
} from 'react-router-dom';
import './App.css';
import Login from './Login.jsx';
import Projects from './Projects.jsx';

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
          </div>
          <div id="content-main">
            <br />
            <br />
            <div>
              <Route exact path="/" component={Login}/>
              <Route path="/projects" component={Projects}/>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;