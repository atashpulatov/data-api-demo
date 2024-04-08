import React, { useState } from 'react';
import { connect } from 'react-redux';

import { popupHelper } from '../popup/popup-helper';

import { AttributeSelectorWindowNotConnectedProps } from './attribute-selector-types';

import { PopupButtons } from '../popup/popup-buttons/popup-buttons';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { AttributeSelector } from './attribute-selector';
import { selectorProperties } from './selector-properties';
import { DisplayAttrFormNames, ObjectImportType } from '../mstr-object/constants';

import '../home/home.css';

export const DEFAULT_PROJECT_NAME = 'Prepare Data';

export const AttributeSelectorWindowNotConnected: React.FC<
  AttributeSelectorWindowNotConnectedProps
> = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [attributesSelected, setAttributesSelected] = useState(false);

  const handleOk = (): void => {
    setTriggerUpdate(true);
  };

  const handleCancel = (): void => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel };
    popupHelper.officeMessageParent(message);
  };

  // TODO: fix any types
  const onTriggerUpdate = (
    chosenObjectId: string,
    projectId: string,
    chosenObjectSubtype: string,
    body: any,
    chosenObjectName: string,
    filterDetails: any
  ): void => {
    const {
      chosenObject: { chosenObjectName: objectName },
    } = props;
    chosenObjectName = chosenObjectName || objectName;

    const { chosenObject, editedObject, importSubtotal, displayAttrFormNames } = props;

    const subtotalsInfo = {
      importSubtotal:
        editedObject && editedObject.subtotalsInfo
          ? editedObject.subtotalsInfo.importSubtotal
          : importSubtotal,
    };
    const displayAttrFormNamesSet =
      (editedObject && editedObject.displayAttrFormNames) ||
      displayAttrFormNames ||
      DisplayAttrFormNames.AUTOMATIC;

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
      pageByData: editedObject?.pageByData,
    };
    popupHelper.officeMessageParent(message);
  };

  /**
   * resets triggerUpdate property to false in order to allow re-pressing OK button
   * should be called every time OK is pressed but selector popup should not close
   */
  const resetTriggerUpdate = (): void => {
    setTriggerUpdate(false);
  };

  const { handleBack, chosenObject, mstrData, objectName, editedObject } = props;
  const { isPrompted } = mstrData;
  const { chosenObjectName } = chosenObject;
  const typeOfObject = editedObject || chosenObject;
  const typeName = typeOfObject.mstrObjectType
    ? typeOfObject.mstrObjectType.name.charAt(0).toUpperCase() +
      typeOfObject.mstrObjectType.name.substring(1)
    : 'Data';
  const isEdit = chosenObjectName === DEFAULT_PROJECT_NAME;

  return (
    <div className='attribute-selector-window'>
      {/* @ts-expect-error */}
      <AttributeSelector
        title={`Import ${typeName} > ${objectName}`}
        attributesSelectedChange={(attributes: React.SetStateAction<boolean>) =>
          setAttributesSelected(attributes)
        }
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
        handleBack={(!isEdit || isPrompted) && (handleBack as () => void)}
        handleOk={handleOk}
        handleCancel={handleCancel}
        primaryImportType={ObjectImportType.TABLE}
        onPreviewClick={() => setIsModalOpen(true)}
      />
    </div>
  );
};

// TODO: fix any types
const mapStateToProps = (state: {
  navigationTree: {
    [x: string]: any;
    importSubtotal: any;
    displayAttrFormNames: any;
  };
  popupReducer: { editedObject: any };
  popupStateReducer: any;
}): any => {
  const { importSubtotal, displayAttrFormNames, ...chosenObject } = state.navigationTree;
  const { editedObject } = state.popupReducer;

  return {
    mstrData: { ...state.popupStateReducer },
    chosenObject,
    objectName: editedObject ? editedObject.name : chosenObject.chosenObjectName,
    importSubtotal,
    displayAttrFormNames,
    editedObject: state.popupReducer.editedObject,
  };
};

const mapDispatchToProps = {
  handleBack: popupStateActions.onPopupBack,
  handlePrepare: popupStateActions.onPrepareData,
};

export const AttributeSelectorWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributeSelectorWindowNotConnected);
