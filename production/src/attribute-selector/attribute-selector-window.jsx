import React, { Component } from 'react';
import '../home/home.css';
import { selectorProperties } from './selector-properties';
import { attributeSelectorHelpers } from './attribute-selector-helpers';
import { AttributeSelector } from './attribute-selector';
import { PopupButtons } from '../popup/popup-buttons';

export class AttributeSelectorWindow extends Component {
  constructor(props) {
    super(props);
    const { mstrData } = this.props;
    this.state = {
      session: {
        USE_PROXY: false,
        url: mstrData.envUrl,
        authToken: mstrData.token,
        projectId: mstrData.projectId,
      },
      openModal: false,
      triggerUpdate: false,
      loading: false,
      attributesSelected: false,
      importSubtotal: true,
    };
  }

  toggleSubtotal = (isSubtotal) => {
    this.setState({ importSubtotal: isSubtotal });
  }

  handleOk = () => {
    this.setState({ triggerUpdate: true, loading: true });
  };

  handleCancel = () => attributeSelectorHelpers.officeMessageParent(selectorProperties.commandCancel);

  handleBack = () => {
    const { handleBack } = this.props;
    handleBack();
  };

  onTriggerUpdate = (reportId, projectId, reportSubtype, body, reportName = this.props.mstrData.reportName) => {
    const { mstrData } = this.props;
    const { importSubtotal } = this.state;
    attributeSelectorHelpers.officeMessageParent(
      selectorProperties.commandOnUpdate,
      reportId,
      projectId,
      reportSubtype,
      body,
      reportName,
      mstrData.instanceId,
      mstrData.promptsAnswers,
      importSubtotal,
    );
  };

  /**
   * resets triggerUpdate property to false in order to allow re-pressing OK button
   * should be called every time OK is pressed but selector popup should not close
   */
  resetTriggerUpdate = () => {
    this.setState({ triggerUpdate: false, loading: false });
  };

  attributesBeingSelected = (attributesSelected) => {
    this.setState({ attributesSelected });
  };

  openModal = () => {
    this.setState({ openModal: true });
  };

  closeModal = () => {
    this.setState({ openModal: false });
  };

  render() {
    const { mstrData } = this.props;
    const {
      session, triggerUpdate, openModal, attributesSelected, loading,
    } = this.state;
    const { toggleSubtotal } = this;
    const typeName = mstrData.reportType.name
      ? mstrData.reportType.name.charAt(0).toUpperCase() + mstrData.reportType.name.substring(1)
      : mstrData.reportType.charAt(0).toUpperCase() + mstrData.reportType.substring(1);

    return (
      <div>
        <AttributeSelector
          // TODO: logic for a title
          title={`Import ${typeName} > ${mstrData.reportName}`}
          attributesSelectedChange={this.attributesBeingSelected}
          mstrData={mstrData}
          session={session}
          triggerUpdate={triggerUpdate}
          onTriggerUpdate={this.onTriggerUpdate}
          resetTriggerUpdate={this.resetTriggerUpdate}
          openModal={openModal}
          closeModal={this.closeModal}
          toggleSubtotal={toggleSubtotal}
        />
        <PopupButtons
          disableActiveActions={!attributesSelected}
          handleBack={!mstrData.editRequested && this.handleBack}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          loading={loading}
          onPreviewClick={this.openModal}
        />
      </div>
    );
  }
}
