import React, {Component} from 'react';
import '../index.css';
import '../home/home.css';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {PopupButtons} from '../popup/popup-buttons.jsx';
import {FolderBrowser} from 'mstr-react-library';
import {officeContext} from '../office/office-context';

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
    this.props.handlePrepare(this.state.chosenProjectId, this.state.chosenObjectId, this.state.chosenSubtype);
  }

  handleCancel = () => {
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  }

  // TODO: temporary solution
  onObjectChosen = (objectId, projectId, subtype) => {
    this.setState({
      chosenObjectId: objectId,
      chosenProjectId: projectId,
      chosenSubtype: subtype,
    });
  }

  render() {
    return (
      <FolderBrowser
        title='Import a file'
        session={this.state.session}
        triggerUpdate={this.state.triggerUpdate}
        onTriggerUpdate={this.onTriggerUpdate}
        onObjectChosen={this.onObjectChosen}
      >
        <PopupButtons
          disableActiveActions={!this.state.chosenObjectId}
          handleOk={this.handleOk}
          handleSecondary={this.handleSecondary}
          handleCancel={this.handleCancel}
        />
      </FolderBrowser>
    );
  }
}
