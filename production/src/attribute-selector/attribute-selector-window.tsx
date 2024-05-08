import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';

import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { popupHelper } from '../popup/popup-helper';
import { popupViewSelectorHelper } from '../popup/popup-view-selector-helper';

import { RootState } from '../store';

import { PageByDisplayOption } from '../right-side-panel/settings-side-panel/settings-side-panel-types';
import { AttributeSelectorWindowNotConnectedProps } from './attribute-selector-types';

import { PopupButtons } from '../popup/popup-buttons/popup-buttons';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { settingsReducerSelectors } from '../redux-reducer/settings-reducer/settings-reducer-selectors';
import { AttributeSelector } from './attribute-selector';
import { selectorProperties } from './selector-properties';
import { DisplayAttrFormNames } from '../mstr-object/constants';

import '../home/home.css';

export const DEFAULT_PROJECT_NAME = 'Prepare Data';

export const AttributeSelectorWindowNotConnected: React.FC<
  AttributeSelectorWindowNotConnectedProps
> = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [attributesSelected, setAttributesSelected] = useState(false);
  const [selectedPageByConfigurations, setSelectedPageByConfigurations] = useState([]);

  const pageByDisplaySetting = useSelector(settingsReducerSelectors.selectPageByDisplaySetting);

  const handleOk = async (): Promise<void> => {
    const {
      chosenObject,
      editedObject,
      displayAttrFormNames: chosenDisplayAttrFormNames,
      requestPageByModalOpen,
    } = props;

    const objectId = editedObject?.objectId || chosenObject.chosenObjectId;
    const projectId = editedObject?.projectId || chosenObject.chosenProjectId;
    const instanceId = editedObject?.instanceId;
    const displayAttrFormNames = (editedObject?.displayAttrFormNames ||
      chosenDisplayAttrFormNames) as DisplayAttrFormNames;

    let instance;

    if (!editedObject?.instanceId) {
      instance = await mstrObjectRestService.createInstance({
        objectId,
        projectId,
        displayAttrFormNames,
      });
    } else {
      instance = await mstrObjectRestService.getInstance({
        objectId,
        projectId,
        instanceId,
        displayAttrFormNames,
      });
    }

    const { pageBy } = instance.definition?.grid || {};

    const selectedPageByDisplaySetting =
      editedObject?.pageByData?.pageByDisplayType || pageByDisplaySetting;

    if (pageBy?.length && selectedPageByDisplaySetting === PageByDisplayOption.SELECT_PAGES) {
      await popupViewSelectorHelper.handleRequestPageByModalOpen({
        objectId,
        projectId,
        instanceId: instance.instanceId,
        requestPageByModalOpen,
        importCallback: pageByConfigurations => {
          setTriggerUpdate(true);
          setSelectedPageByConfigurations(pageByConfigurations);
        },
      });
    } else {
      setTriggerUpdate(true);
    }
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
    const { chosenObject, editedObject, importSubtotal, displayAttrFormNames, objectName } = props;
    chosenObjectName = chosenObjectName || objectName;

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
      objectWorkingId: editedObject?.objectWorkingId,
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
      pageByConfigurations: selectedPageByConfigurations,
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
        onPreviewClick={() => setIsModalOpen(true)}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState): any => {
  const { importSubtotal, displayAttrFormNames, ...chosenObject } = state.navigationTree;
  const { editedObject } = state.popupReducer;

  let editedObjectName;

  if (editedObject?.pageByData) {
    editedObjectName = editedObject.definition?.sourceName;
  } else if (editedObject?.name) {
    editedObjectName = editedObject.name;
  }

  return {
    mstrData: { ...state.popupStateReducer },
    chosenObject,
    objectName: editedObjectName ?? chosenObject.chosenObjectName,
    importSubtotal,
    displayAttrFormNames,
    editedObject: state.popupReducer.editedObject,
  };
};

const mapDispatchToProps = {
  handleBack: popupStateActions.onPopupBack,
  handlePrepare: popupStateActions.onPrepareData,
  requestPageByModalOpen: navigationTreeActions.requestPageByModalOpen,
};

export const AttributeSelectorWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributeSelectorWindowNotConnected);
