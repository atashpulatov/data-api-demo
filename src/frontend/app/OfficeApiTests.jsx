import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import di from './root-di.js';

class OfficeApiTest extends Component {
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
        <div>
                          <h3>Try it out</h3>
              <button onClick={this.onSetColor}>Set color</button>
            </div>
    );
  }
}

export default OfficeApiTest;
