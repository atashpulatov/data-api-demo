import React from 'react';
// @ts-ignore
import { AttributeMetricFilter, ErrorBoundary } from '@mstr/mstr-react-library';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { popupHelper } from '../popup/popup-helper';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { officeProperties } from '../redux-reducer/office-reducer/office-properties';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { errorMessages, errorCodes } from '../error/constants';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import './attribute-selector.css';
import {
  AttributeSelectorNotConnectedProps, EditedObjectProps, MstrDataProps, MstrError, SessionProps
} from './attribute-selector-types';

export const AttributeSelectorNotConnected = (props: AttributeSelectorNotConnectedProps) => {
  const [t, i18n] = useTranslation();

  /**
   * Handles unathorized error from library - rearrange
   * properties to be compatible with errorService.handleError
   *
   * @param {Error} e -  Error thrown by mstrReactLibrary
   */
  const handleUnauthorized = (e: MstrError) => {
    const { ERR009 } = errorCodes;
    const { handlePopupErrors } = props;
    const newErrorObject = {
      status: e.status,
      response: {
        ...e.response,
        body: {
          code: ERR009,
          message: errorMessages.SESSION_EXTENSION_FAILURE_MESSAGE,
        },
        text: `{code: ${ERR009}, message: ${errorMessages.SESSION_EXTENSION_FAILURE_MESSAGE}}`,
      }
    };
    handlePopupErrors(newErrorObject);
  };

  const {
    title, session, displayAttrFormNames, isEdit,
    triggerUpdate, onTriggerUpdate, chosenObject, importSubtotal, editedObject, supportForms,
    resetTriggerUpdate, attributesSelectedChange, openModal, closeModal,
    switchImportSubtotalsOnImport, switchImportSubtotalsOnEdit,
    updateDisplayAttrFormOnImport, updateDisplayAttrFormOnEdit,
  } = props;

  const defaultAttrFormNames = officeProperties.displayAttrFormNames.automatic;
  const displayAttrFormSet = editedObject.displayAttrFormNames || displayAttrFormNames || defaultAttrFormNames;

  return (
    <ErrorBoundary>
      <AttributeMetricFilter
        t={t}
        locale={i18n.language}
        attributesSelectedChange={attributesSelectedChange}
        key={chosenObject.id}
        title={title}
        session={mapToLegacySession(chosenObject, session, editedObject)}
        mstrData={{ ...mapToLegacyMstrData(chosenObject, session, editedObject), supportForms, isEdit }}
        triggerUpdate={triggerUpdate}
        onTriggerUpdate={onTriggerUpdate}
        withDataPreview
        resetTriggerUpdate={resetTriggerUpdate}
        withFolderTree={false}
        openModal={openModal}
        closeModal={closeModal}
        toggleSubtotal={isEdit ? switchImportSubtotalsOnEdit : switchImportSubtotalsOnImport}
        importSubtotal={editedObject.subtotalsInfo ? editedObject.subtotalsInfo.importSubtotal : importSubtotal}
        handleUnauthorized={handleUnauthorized}
        onDisplayAttrFormNamesUpdate={isEdit ? updateDisplayAttrFormOnEdit : updateDisplayAttrFormOnImport}
        displayAttrFormNames={displayAttrFormSet}
        displayAttrFormNamesOptions={officeProperties.displayAttrFormNamesOptions}
      />
    </ErrorBoundary>
  );
};

const mapToLegacyMstrData = (
  chosenObject: MstrDataProps,
  session: SessionProps,
  editedObject: EditedObjectProps
) => {
  const legacyObject = {
    reportId: chosenObject.chosenObjectId || editedObject.chosenObjectId,
    envUrl: session.envUrl,
    projectId: chosenObject.chosenProjectId || editedObject.projectId,
    reportSubtype: chosenObject.chosenSubtype || editedObject.chosenObjectSubtype,
    reportType: chosenObject.chosenObjectId ? chosenObject.mstrObjectType.name : editedObject.chosenObjectType,
    reportName: chosenObject.chosenObjectName || editedObject.chosenObjectName,
    token: session.authToken,
    authToken: session.authToken,
    instanceId: editedObject && editedObject.instanceId,
    isPrompted: chosenObject && chosenObject.isPrompted,
    promptsAnswers: editedObject && editedObject.promptsAnswers,
    selectedAttributes: editedObject.selectedAttributes,
    selectedMetrics: editedObject.selectedMetrics,
    selectedFilters: editedObject.selectedFilters,
    selectedAttrForms: editedObject.selectedAttrForms,
  };

  return legacyObject;
};

const mapToLegacySession = (mstrData: MstrDataProps, session: SessionProps, editedObject: EditedObjectProps) => ({
  url: session.envUrl,
  USE_PROXY: false,
  authToken: session.authToken,
  projectId: mstrData.chosenProjectId || editedObject.projectId,
  attrFormPrivilege: session.attrFormPrivilege
});

// TODO: fix any types
const mapStateToProps = (
  state: {
    navigationTree: { [x: string]: any; promptsAnswers: any; importSubtotal: any; displayAttrFormNames: any; };
    popupStateReducer: any; popupReducer: any; sessionReducer: any; officeReducer: any;
}
) => {
  const {
    navigationTree: {
      promptsAnswers, importSubtotal, displayAttrFormNames, ...chosenObject
    },
    popupStateReducer,
    popupReducer,
    sessionReducer,
    officeReducer
  } = state;
  const { editedObject } = popupReducer;
  const { supportForms } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const isReport = editedObject && editedObject.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  return {
    chosenObject,
    supportForms,
    editedObject: { ...(popupHelper.parsePopupState(editedObject, promptsAnswers, formsPrivilege)) },
    popupState: { ...popupStateReducer },
    session: { ...sessionReducer },
    importSubtotal,
    displayAttrFormNames
  };
};

const mapDispatchToProps = {
  switchImportSubtotalsOnImport: navigationTreeActions.switchImportSubtotalsOnImport,
  switchImportSubtotalsOnEdit: popupActions.switchImportSubtotalsOnEdit,
  updateDisplayAttrFormOnImport: navigationTreeActions.updateDisplayAttrFormOnImport,
  updateDisplayAttrFormOnEdit: popupActions.updateDisplayAttrFormOnEdit,
};

export const AttributeSelector = connect(mapStateToProps, mapDispatchToProps)(AttributeSelectorNotConnected);
