import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';

import { dialogHelper } from '../dialog/dialog-helper';
import { dialogViewSelectorHelper } from '../dialog/dialog-view-selector-helper';
import instanceDefinitionHelper from '../mstr-object/instance/instance-definition-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { pageByHelper } from '../page-by/page-by-helper';

import { RootState } from '../store';

import { DialogCommands, DialogResponse } from '../dialog/dialog-controller-types';
import { AttributeSelectorWindowNotConnectedProps } from './attribute-selector-types';

import { DialogButtons } from '../dialog/dialog-buttons/dialog-buttons';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { navigationTreeSelectors } from '../redux-reducer/navigation-tree-reducer/navigation-tree-reducer-selectors';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { AttributeSelector } from './attribute-selector';
import { DisplayAttrFormNames } from '../mstr-object/constants';

import '../home/home.scss';

export const DEFAULT_PROJECT_NAME = 'Prepare Data';

export const AttributeSelectorWindowNotConnected: React.FC<
  AttributeSelectorWindowNotConnectedProps
> = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [attributesSelected, setAttributesSelected] = useState(false);

  const { editedObject, setImportType, importType } = props;

  if (editedObject?.importType && importType !== editedObject.importType) {
    setImportType(editedObject.importType);
  }

  const isPageByModalOpenRequested = useSelector(
    navigationTreeSelectors.selectIsPageByModalOpenRequested
  );

  useEffect(() => {
    if (!isPageByModalOpenRequested) {
      setTriggerUpdate(false);
    }
  }, [isPageByModalOpenRequested]);

  const handleOk = async (): Promise<void> => {
    setTriggerUpdate(true);
  };

  const handleCancel = (): void => {
    const message = { command: DialogCommands.COMMAND_CANCEL };
    dialogHelper.officeMessageParent(message);
  };

  const handleImport = async (message: DialogResponse): Promise<void> => {
    const {
      chosenObject,
      displayAttrFormNames: chosenDisplayAttrFormNames,
      requestPageByModalOpen,
    } = props;

    const objectId = editedObject?.objectId || chosenObject.chosenObjectId;
    const projectId = editedObject?.projectId || chosenObject.chosenProjectId;
    const instanceId = editedObject?.instanceId;
    const displayAttrFormNames = editedObject?.displayAttrFormNames || chosenDisplayAttrFormNames;

    let instance;

    const body = instanceDefinitionHelper.setupBodyTemplate(message.body);

    if (!editedObject?.instanceId) {
      instance = await mstrObjectRestService.createInstance({
        objectId,
        projectId,
        displayAttrFormNames,
        body,
      });
    } else {
      instance = await mstrObjectRestService.modifyInstance({
        objectId,
        projectId,
        instanceId,
        displayAttrFormNames,
        body,
      });
    }

    const { pageBy } = instance.definition?.grid || {};
    const isPageBy = !!pageBy?.length;

    const shouldOpenPageByModal = pageByHelper.getShouldOpenPageByModal(pageBy, importType);

    if (shouldOpenPageByModal) {
      await dialogViewSelectorHelper.handleRequestPageByModalOpen({
        objectId,
        projectId,
        instanceId: instance.instanceId,
        requestPageByModalOpen,
        importCallback: pageByConfigurations => {
          dialogHelper.officeMessageParent({ ...message, isPageBy, pageByConfigurations });
        },
      });
    } else {
      const pageByData = isPageBy ? editedObject?.pageByData : undefined;
      dialogHelper.officeMessageParent({ ...message, isPageBy, pageByData });
    }
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
    const { chosenObject, importSubtotal, displayAttrFormNames, objectName } = props;
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
      command: DialogCommands.COMMAND_ON_UPDATE,
      objectWorkingId: editedObject?.objectWorkingId,
      chosenObjectId,
      projectId,
      chosenObjectSubtype,
      body,
      chosenObjectName,
      instanceId: chosenObject.preparedInstanceId,
      promptsAnswers: chosenObject.promptsAnswers,
      importType,
      isPrompted: !!chosenObject.promptsAnswers,
      subtotalsInfo,
      displayAttrFormNames: displayAttrFormNamesSet,
      filterDetails,
    };
    handleImport(message);
  };

  /**
   * resets triggerUpdate property to false in order to allow re-pressing OK button
   * should be called every time OK is pressed but selector popup should not close
   */
  const resetTriggerUpdate = (): void => {
    setTriggerUpdate(false);
  };

  const { handleBack, chosenObject, mstrData, objectName } = props;
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
        handlePopupErrors={dialogHelper.handlePopupErrors}
        isEdit={isEdit}
      />
      <DialogButtons
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
  const { importType } = state.popupStateReducer;

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
    importType,
  };
};

const mapDispatchToProps = {
  handleBack: popupStateActions.onPopupBack,
  handlePrepare: popupStateActions.onPrepareData,
  setImportType: popupStateActions.setImportType,
  requestPageByModalOpen: navigationTreeActions.requestPageByModalOpen,
};

export const AttributeSelectorWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributeSelectorWindowNotConnected);
