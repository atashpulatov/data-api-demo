import React, { Component } from 'react';
import './App.css';
import Login from './Login.jsx';

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
      <div id="content">
        <div id="content-header">
          <div className="padding">
            <h1>Microstrategy Office</h1>
          </div>
        </div>
        <div id="content-main">
          {/* <div className="padding">
              <p>Choose the button below to set the color of the selected range to green.</p>
              <br />
              <h3>Try it out</h3>
              <button onClick={this.onSetColor}>Set color</button>
          </div> */}
          <br />
          <br />
          <div>
            <Login> </Login>
          </div>
        </div>
      </div>

    );
  }
}

export default App;