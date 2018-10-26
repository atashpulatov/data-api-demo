/*eslint-disable */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import * as queryString from 'query-string';
import './index.css';
import './home/home.css';
import { selectorProperties } from './attribute-selector/selector-properties';
import { AttributeSelector } from './attribute-selector/attribute-selector.jsx';
import { PopupButtons } from './popup-buttons.jsx';
import 'mstr-react-library/src/css/mstr-react.css';
/* eslint-enable */

const Office = window.Office;

function officeInitialize() {
  Office.onReady()
    .then(() => {
      goReact();
    });
}

class Popup extends Component {
  constructor(props) {
    super(props);
    const parsed = queryString.parse(this.props.location.search);

    this.state = {
      session: {
        USE_PROXY: false,
        url: parsed.envUrl,
        authToken: parsed.token,
        projectId: parsed.projectId,
      },
      reportId: parsed.reportId,
      triggerUpdate: false,
    };
  }

  handleOk = () => {
    this.setState({ triggerUpdate: true });
  }

  handleCancel = () => {
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  }

  onTriggerUpdate = (body) => {
    const updateObject = {
      command: selectorProperties.commandOnUpdate,
      body,
    };
    Office.context.ui.messageParent(JSON.stringify(updateObject));
  };

  render() {
    return (
      <div
        style={{ padding: '20px' }}>
        <AttributeSelector
          session={this.state.session}
          reportId={this.state.reportId}
          triggerUpdate={this.state.triggerUpdate}
          onTriggerUpdate={this.onTriggerUpdate}
        />
        <PopupButtons
          handleOk={this.handleOk}
          handleCancel={this.handleCancel} />
      </div >
    );
  }
}

function goReact() {
  ReactDOM.render(
    <BrowserRouter>
      <Route path="/" component={Popup} />
    </BrowserRouter>,
    document.getElementById('popup')
  );
}

officeInitialize();
