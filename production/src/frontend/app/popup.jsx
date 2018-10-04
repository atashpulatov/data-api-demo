/*eslint-disable */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import * as queryString from 'query-string';
import './index.css';
import { projectRestService } from './project/project-rest-service';
import { selectorProperties } from './attribute-selector/selector-properties';
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
        url: parsed.url,
        authToken: parsed.authToken,
        projectId: parsed.projectId,
      },
      reportId: parsed.reportId,
      triggerUpdate: parsed.triggerUpdate,
    };
  }

  handleOk() {
    Office.context.ui.messageParent({
      command: selectorProperties.commandOk,
    });
  }

  handleCancel() {
    Office.context.ui.messageParent({
      command: selectorProperties.commandCancel,
    });
  }

  onTriggerUpdate(body) {
    Office.context.ui.messageParent({
      command: selectorProperties.commandOnUpdate,
      body,
    });
  };

  render() {
    return (
      <Modal
        title="Load report"
        onOk={this.handleOk}
        width='1100px'
        onCancel={this.handleCancel}>
        <AttributeSelector
          session={this.state.session}
          reportId={this.state.reportId}
          triggerUpdate={this.state.triggerUpdate}
          onTriggerUpdate={this.onTriggerUpdate}
        />
      </Modal>
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

registerServiceWorker();
