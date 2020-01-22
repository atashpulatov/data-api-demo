import React, { Component } from "react";
import "../home/home.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { selectorProperties } from "./selector-properties";
import { attributeSelectorHelpers } from "./attribute-selector-helpers";
import { AttributeSelector } from "./attribute-selector";
import { PopupButtons } from "../popup/popup-buttons/popup-buttons";
import { popupStateActions } from "../popup/popup-state-actions";
import { popupHelper } from "../popup/popup-helper";

export class AttributeSelectorWindowNotConnected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      triggerUpdate: false,
      loading: false,
      attributesSelected: false
    };
  }

  handleOk = () => {
    this.setState({ triggerUpdate: true, loading: true });
  };

  handleCancel = () =>
    attributeSelectorHelpers.officeMessageParent(
      selectorProperties.commandCancel
    );

  onTriggerUpdate = (
    chosenObjectId,
    projectId,
    chosenObjectSubtype,
    body,
    chosenObjectName = this.props.chosenObject.chosenObjectName
  ) => {
    const { chosenObject, editedObject, importSubtotal, displayAttrFormNames } = this.props;
    const subtotalsInfo = {
      importSubtotal: editedObject.subtotalsInfo
        ? editedObject.subtotalsInfo.importSubtotal
        : importSubtotal
    };
    const displayAttrFormNamesSet = editedObject.displayAttrFormNames || displayAttrFormNames;
    attributeSelectorHelpers.officeMessageParent(
      selectorProperties.commandOnUpdate,
      chosenObjectId,
      projectId,
      chosenObjectSubtype,
      body,
      chosenObjectName,
      chosenObject.preparedInstanceId,
      chosenObject.promptsAnswers,
      subtotalsInfo,
      displayAttrFormNamesSet
    );
  };

  /**
   * resets triggerUpdate property to false in order to allow re-pressing OK button
   * should be called every time OK is pressed but selector popup should not close
   */
  resetTriggerUpdate = () => {
    this.setState({ triggerUpdate: false, loading: false });
  };

  attributesBeingSelected = attributesSelected => {
    this.setState({ attributesSelected });
  };

  openModal = () => {
    this.setState({ openModal: true });
  };

  closeModal = () => {
    this.setState({ openModal: false });
  };

  render() {
    const { handleBack, chosenObject, editedObject, mstrData } = this.props;
    const {
      triggerUpdate,
      openModal,
      attributesSelected,
      loading
    } = this.state;
    const { isPrompted } = mstrData;
    const typeName =
      chosenObject.objectType &&
      chosenObject.objectType.name &&
      chosenObject.objectType.name.charAt(0).toUpperCase() +
        chosenObject.objectType.name.substring(1);
    return (
      <div>
        <AttributeSelector
          // TODO: logic for a title
          title={`Import ${typeName} > ${chosenObject.chosenObjectName}`}
          attributesSelectedChange={this.attributesBeingSelected}
          triggerUpdate={triggerUpdate}
          onTriggerUpdate={this.onTriggerUpdate}
          resetTriggerUpdate={this.resetTriggerUpdate}
          openModal={openModal}
          closeModal={this.closeModal}
          handlePopupErrors={popupHelper.handlePopupErrors}
        />
        <PopupButtons
          disableActiveActions={!attributesSelected}
          handleBack={(!editedObject || isPrompted) && handleBack}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          loading={loading}
          onPreviewClick={this.openModal}
        />
      </div>
    );
  }
}

AttributeSelectorWindowNotConnected.propTypes = {
  mstrData: PropTypes.shape({
    envUrl: PropTypes.string,
    authToken: PropTypes.string,
    projectId: PropTypes.string,
    chosenObjectName: PropTypes.string,
    instanceId: PropTypes.string,
    promptsAnswers: PropTypes.string,
    chosenObjectType: PropTypes.string,
    editRequested: PropTypes.bool
  }).isRequired,
  handleBack: PropTypes.func
};

const mapStateToProps = state => {
  const { importSubtotal, displayAttrFormNames, ...chosenObject } = state.navigationTree;
  return {
    mstrData: { ...state.popupStateReducer },
    chosenObject,
    importSubtotal,
    displayAttrFormNames,
    editedObject: state.popupReducer.editedObject
  };
};

const mapDispatchToProps = {
  handleBack: popupStateActions.onPopupBack,
  handlePrepare: popupStateActions.onPrepareData
};

export const AttributeSelectorWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributeSelectorWindowNotConnected);
