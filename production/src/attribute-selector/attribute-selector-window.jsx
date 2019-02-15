import React, {Component} from 'react';
import '../index.css';
import '../home/home.css';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {AttributeSelector} from '../attribute-selector/attribute-selector.jsx';
import {PopupButtons} from '../popup-buttons.jsx';

export class AttributeSelectorWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: {
        USE_PROXY: false,
        url: this.props.parsed.envUrl,
        authToken: this.props.parsed.token,
        projectId: this.props.parsed.projectId,
      },
      reportId: this.props.parsed.reportId,
      reportSubtype: this.props.parsed.reportSubtype,
      triggerUpdate: false,
      loading: false,
    };
  }

  handleOk = () => {
    this.setState({triggerUpdate: true, loading: true});
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

  /**
   * resets triggerUpdate property to false in order to allow re-pressing OK button
   * should be called every time OK is pressed but selector popup should not close
   */
  resetTriggerUpdate = () => {
    this.setState({triggerUpdate: false, loading: false});
  };

  render() {
    return (
      <div
        style={{padding: '20px'}}>
        <AttributeSelector
          // TODO: logic for a title
          title='Import a file > Access_Transaction'
          session={this.state.session}
          reportId={this.state.reportId}
          reportSubtype={this.state.reportSubtype}
          triggerUpdate={this.state.triggerUpdate}
          onTriggerUpdate={this.onTriggerUpdate}
          resetTriggerUpdate={this.resetTriggerUpdate}
        />
        <PopupButtons
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          loading={this.state.loading} />
      </div >
    );
  }
}
