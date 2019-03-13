import React, {Component} from 'react';
import '../index.css';
import '../home/home.css';
import {selectorProperties} from './selector-properties';
import {attributeSelectorHelpers} from './attribute-selector-helpers';
import {AttributeSelector} from '../attribute-selector/attribute-selector.jsx';
import {PopupButtons} from '../popup/popup-buttons.jsx';

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
      openModal: false,
      reportSubtype: this.props.parsed.reportSubtype,
      triggerUpdate: false,
      loading: false,
      attributesSelected: false,
    };
  }

  handleOk = () => {
    this.setState({triggerUpdate: true, loading: true});
  };

  handleCancel = () => attributeSelectorHelpers.officeMessageParent(selectorProperties.commandCancel);

  handleBack = () => {
    this.props.handleBack();
  };

  onTriggerUpdate = (reportId, projectId, reportSubtype, body) => {
    attributeSelectorHelpers.officeMessageParent(selectorProperties.commandOnUpdate,
        reportId, projectId, reportSubtype, body);
  };

  /**
   * resets triggerUpdate property to false in order to allow re-pressing OK button
   * should be called every time OK is pressed but selector popup should not close
   */
  resetTriggerUpdate = () => {
    this.setState({triggerUpdate: false, loading: false});
  };

  attributesBeingSelected = (attributesSelected) => {
    this.setState({attributesSelected});
  };

  openModal = () => {
    this.setState({openModal: true});
  }

  closeModal = () => {
    this.setState({openModal: false});
  }

  render() {
    return (
      <div>
        <AttributeSelector
          // TODO: logic for a title
          title={`Import ${this.props.parsed.reportType} > ${this.props.parsed.reportName}`}
          attributesSelectedChange={this.attributesBeingSelected}
          session={this.state.session}
          reportId={this.props.parsed.reportId}
          reportSubtype={this.state.reportSubtype}
          triggerUpdate={this.state.triggerUpdate}
          onTriggerUpdate={this.onTriggerUpdate}
          resetTriggerUpdate={this.resetTriggerUpdate}
          openModal={this.state.openModal}
          closeModal={this.closeModal}
        />
        <PopupButtons
          disableActiveActions={!this.state.attributesSelected}
          handleBack={this.handleBack}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          loading={this.state.loading}
          onPreviewClick={this.openModal}
        />
      </div >
    );
  }
}
