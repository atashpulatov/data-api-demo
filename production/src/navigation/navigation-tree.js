import React, { Component } from 'react';
import '../index.css';
import '../home/home.css';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupButtons } from '../popup-buttons.jsx';
import { FolderBrowser } from 'mstr-react-library';
import { officeContext } from '../office/office-context';

export class NavigationTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: {
        USE_PROXY: false,
        url: this.props.parsed.envUrl,
        authToken: this.props.parsed.token,
      },
      reportId: this.props.parsed.reportId,
      triggerUpdate: false,
    };
  }

  onTriggerUpdate = (body) => {
    const updateObject = {
      command: selectorProperties.commandOnUpdate,
      body,
    };
    Office.context.ui.messageParent(JSON.stringify(updateObject));
  };

  handleOk = () => {
    const okObject = {
      command: selectorProperties.commandOk,
      chosenObject: this.state.chosenObjectId,
      chosenProject: this.state.chosenProjectId,
    };
    Office.context.ui.messageParent(JSON.stringify(okObject));
  }

  handleSecondary = () => {
    const actionObject = {
      command: selectorProperties.commandSecondary,
      chosenObject: this.state.chosenObjectId,
      chosenProject: this.state.chosenProjectId,
    };
    officeContext.getOffice()
      .context.ui.messageParent(JSON.stringify(actionObject));
  }

  handleCancel = () => {
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  }

  // TODO: temporary solution
  onObjectChosen = (objectId, projectId) => {
    this.setState({
      chosenObjectId: objectId,
      chosenProjectId: projectId,
    });
  }

  render() {
    return (
      <FolderBrowser
        session={this.state.session}
        triggerUpdate={this.state.triggerUpdate}
        onTriggerUpdate={this.onTriggerUpdate}
        onObjectChosen={this.onObjectChosen}
      >
        <PopupButtons
          handleOk={this.handleOk}
          handleSecondary={this.handleSecondary}
          handleCancel={this.handleCancel}
        />
      </FolderBrowser>
    );
  }
}
