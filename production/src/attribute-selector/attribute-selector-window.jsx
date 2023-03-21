import React, { Component, useState } from 'react';
import '../home/home.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectorProperties } from './selector-properties';
import { AttributeSelector } from './attribute-selector';
import { PopupButtons } from '../popup/popup-buttons/popup-buttons';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { popupHelper } from '../popup/popup-helper';
import { officeProperties } from '../redux-reducer/office-reducer/office-properties';

export const DEFAULT_PROJECT_NAME = 'Prepare Data';
export const AttributeSelectorWindowNotConnected = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [attributesSelected, setAttributesSelected] = useState(false);

  const handleOk = () => {
    setTriggerUpdate(true);
  };

  const handleCancel = () => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    popupHelper.officeMessageParent(message);
  };

  const onTriggerUpdate = (
    chosenObjectId,
    projectId,
    chosenObjectSubtype,
    body,
    chosenObjectName,
    filterDetails,
  ) => {
    const { chosenObject: { chosenObjectName: objectName } } = props;
    chosenObjectName = chosenObjectName || objectName;

    const {
      chosenObject, editedObject, importSubtotal, displayAttrFormNames
    } = props;

    const subtotalsInfo = {
      importSubtotal: (editedObject && editedObject.subtotalsInfo)
        ? editedObject.subtotalsInfo.importSubtotal
        : importSubtotal
    };
    const displayAttrFormNamesSet = (editedObject && editedObject.displayAttrFormNames) || displayAttrFormNames
    || officeProperties.displayAttrFormNames.automatic;

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
  const resetTriggerUpdate = () => {
    setTriggerUpdate(false);
  };

  const {
    handleBack, chosenObject, mstrData, objectName, editedObject
  } = props;
  const { isPrompted } = mstrData;
  const { chosenObjectName } = chosenObject;
  const typeOfObject = editedObject || chosenObject;
  const typeName = typeOfObject.mstrObjectType
    ? typeOfObject.mstrObjectType.name.charAt(0).toUpperCase() + typeOfObject.mstrObjectType.name.substring(1)
    : 'Data';
  const isEdit = (chosenObjectName === DEFAULT_PROJECT_NAME);
  return (
    <div className="attribute-selector-window">
      <AttributeSelector
        title={`Import ${typeName} > ${objectName}`}
        attributesSelectedChange={(attributes) => setAttributesSelected(attributes)}
        triggerUpdate={triggerUpdate}
        onTriggerUpdate={onTriggerUpdate}
        resetTriggerUpdate={resetTriggerUpdate}
        openModal={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        handlePopupErrors={popupHelper.handlePopupErrors}
        isEdit={isEdit}
      />
      <PopupButtons
        disableActiveActions={!attributesSelected}
        handleBack={(!isEdit || isPrompted) && handleBack}
        handleOk={() => handleOk()}
        handleCancel={() => handleCancel()}
        onPreviewClick={() => setIsModalOpen(true)}
      />
    </div>
  );
};

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
