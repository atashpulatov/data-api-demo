import React, { Component } from 'react';
import '../home/home.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectorProperties } from './selector-properties';
import { AttributeSelector } from './attribute-selector';
import { PopupButtons } from '../popup/popup-buttons/popup-buttons';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { popupHelper } from '../popup/popup-helper';

export const DEFAULT_PROJECT_NAME = 'Prepare Data';
export class AttributeSelectorWindowNotConnected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      triggerUpdate: false,
      attributesSelected: false
    };
  }

  handleOk = () => {
    this.setState({ triggerUpdate: true });
  };

  handleCancel = () => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    popupHelper.officeMessageParent(message);
  }

  onTriggerUpdate = (
    chosenObjectId,
    projectId,
    chosenObjectSubtype,
    body,
    chosenObjectName,
    filterDetails,
  ) => {
    const { chosenObject: { chosenObjectName: objectName } } = this.props;
    chosenObjectName = chosenObjectName || objectName;

    const {
      chosenObject, editedObject, importSubtotal, displayAttrFormNames
    } = this.props;

    const subtotalsInfo = {
      importSubtotal: (editedObject && editedObject.subtotalsInfo)
        ? editedObject.subtotalsInfo.importSubtotal
        : importSubtotal
    };
    const displayAttrFormNamesSet = (editedObject && editedObject.displayAttrFormNames) || displayAttrFormNames;

    const message = {
      command: selectorProperties.commandOnUpdate,
      chosenObjectId,
      projectId,
      chosenObjectSubtype,
      body,
      chosenObjectName,
      instanceId: chosenObject.preparedInstanceId,
      promptsAnswers: chosenObject.promptsAnswers,
      isPrompted: !!chosenObject.promptsAnswers,
      subtotalsInfo,
      displayAttrFormNames: displayAttrFormNamesSet,
      filterDetails,
    };
    popupHelper.officeMessageParent(message);
  };

  /**
   * resets triggerUpdate property to false in order to allow re-pressing OK button
   * should be called every time OK is pressed but selector popup should not close
   */
  resetTriggerUpdate = () => {
    this.setState({ triggerUpdate: false });
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
    const {
      handleBack, chosenObject, mstrData, objectName, editedObject
    } = this.props;
    const { triggerUpdate, openModal, attributesSelected, } = this.state;
    const { isPrompted } = mstrData;
    const { chosenObjectName } = chosenObject;
    const typeOfObject = editedObject || chosenObject;
    const typeName = typeOfObject.mstrObjectType
      ? typeOfObject.mstrObjectType.name.charAt(0).toUpperCase() + typeOfObject.mstrObjectType.name.substring(1)
      : 'Data';
    const isEdit = (chosenObjectName === DEFAULT_PROJECT_NAME);
    return (
      <div>
        <AttributeSelector
          title={`Import ${typeName} > ${objectName}`}
          attributesSelectedChange={this.attributesBeingSelected}
          triggerUpdate={triggerUpdate}
          onTriggerUpdate={this.onTriggerUpdate}
          resetTriggerUpdate={this.resetTriggerUpdate}
          openModal={openModal}
          closeModal={this.closeModal}
          handlePopupErrors={popupHelper.handlePopupErrors}
          isEdit={isEdit}
        />
        <PopupButtons
          disableActiveActions={!attributesSelected}
          handleBack={(!isEdit || isPrompted) && handleBack}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          onPreviewClick={this.openModal}
        />
      </div>
    );
  }
}

AttributeSelectorWindowNotConnected.propTypes = {
  chosenObject: PropTypes.shape({
    chosenObjectName: PropTypes.string,
    objectType: PropTypes.shape({ name: PropTypes.string }),
    preparedInstanceId: PropTypes.string,
    promptsAnswers: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  objectName: PropTypes.string,
  mstrData: PropTypes.shape({
    envUrl: PropTypes.string,
    authToken: PropTypes.string,
    projectId: PropTypes.string,
    instanceId: PropTypes.string,
    promptsAnswers: PropTypes.string,
    isPrompted: PropTypes.number
  }).isRequired,
  handleBack: PropTypes.func,
  importSubtotal: PropTypes.bool,
  displayAttrFormNames: PropTypes.string,
  editedObject: PropTypes.shape({
    displayAttrFormNames: PropTypes.string,
    subtotalsInfo: PropTypes.shape({ importSubtotal: PropTypes.bool, }),
    projectId: PropTypes.string,
    promptsAnswers: PropTypes.arrayOf(PropTypes.shape({}))
  }),
};

const mapStateToProps = state => {
  const { importSubtotal, displayAttrFormNames, ...chosenObject } = state.navigationTree;
  const { editedObject } = state.popupReducer;

  return {
    mstrData: { ...state.popupStateReducer },
    chosenObject,
    objectName: editedObject ? editedObject.name : chosenObject.chosenObjectName,
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
