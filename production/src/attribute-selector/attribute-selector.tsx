import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
// @ts-ignore
import { AttributeMetricFilter, ErrorBoundary } from '@mstr/mstr-react-library';

import { popupHelper } from '../popup/popup-helper';

import {
  AttributeSelectorNotConnectedProps,
  EditedObjectProps,
  MstrDataProps,
  MstrError,
  SessionProps,
} from './attribute-selector-types';

import i18n from '../i18n';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { officeProperties } from '../redux-reducer/office-reducer/office-properties';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { errorCodes, ErrorMessages } from '../error/constants';

import './attribute-selector.css';

const mapToLegacyMstrData = (
  chosenObject: MstrDataProps,
  session: SessionProps,
  editedObject: EditedObjectProps
): any => {
  const legacyObject = {
    reportId: chosenObject.chosenObjectId || editedObject.chosenObjectId,
    envUrl: session.envUrl,
    projectId: chosenObject.chosenProjectId || editedObject.projectId,
    reportSubtype: chosenObject.chosenSubtype || editedObject.chosenObjectSubtype,
    reportType: chosenObject.chosenObjectId
      ? chosenObject.mstrObjectType.name
      : editedObject.chosenObjectType,
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

const mapToLegacySession = (
  mstrData: MstrDataProps,
  session: SessionProps,
  editedObject: EditedObjectProps
): any => ({
  url: session.envUrl,
  USE_PROXY: false,
  authToken: session.authToken,
  projectId: mstrData.chosenProjectId || editedObject.projectId,
  attrFormPrivilege: session.attrFormPrivilege,
});

export const AttributeSelectorNotConnected: React.FC<
  AttributeSelectorNotConnectedProps
> = props => {
  const [t] = useTranslation('common', { i18n });

  /**
   * Handles unathorized error from library - rearrange
   * properties to be compatible with errorService.handleError
   *
   * @param {Error} e -  Error thrown by mstrReactLibrary
   */
  const handleUnauthorized = (e: MstrError): void => {
    const { ERR009 } = errorCodes;
    const { handlePopupErrors } = props;
    const newErrorObject = {
      status: e.status,
      response: {
        ...e.response,
        body: {
          code: ERR009,
          message: ErrorMessages.SESSION_EXTENSION_FAILURE_MESSAGE,
        },
        text: `{code: ${ERR009}, message: ${ErrorMessages.SESSION_EXTENSION_FAILURE_MESSAGE}}`,
      },
    };
    handlePopupErrors(newErrorObject);
  };

  const {
    title,
    session,
    displayAttrFormNames,
    isEdit,
    triggerUpdate,
    onTriggerUpdate,
    chosenObject,
    importSubtotal,
    editedObject,
    supportForms,
    resetTriggerUpdate,
    attributesSelectedChange,
    openModal,
    closeModal,
    switchImportSubtotalsOnImport,
    switchImportSubtotalsOnEdit,
    updateDisplayAttrFormOnImport,
    updateDisplayAttrFormOnEdit,
  } = props;

  const defaultAttrFormNames = officeProperties.displayAttrFormNames.automatic;
  const displayAttrFormSet =
    editedObject.displayAttrFormNames || displayAttrFormNames || defaultAttrFormNames;

  return (
    <ErrorBoundary>
      <AttributeMetricFilter
        t={t}
        attributesSelectedChange={attributesSelectedChange}
        key={chosenObject.id}
        title={title}
        session={mapToLegacySession(chosenObject, session, editedObject)}
        mstrData={{
          ...mapToLegacyMstrData(chosenObject, session, editedObject),
          supportForms,
          isEdit,
        }}
        triggerUpdate={triggerUpdate}
        onTriggerUpdate={onTriggerUpdate}
        withDataPreview
        resetTriggerUpdate={resetTriggerUpdate}
        withFolderTree={false}
        openModal={openModal}
        closeModal={closeModal}
        toggleSubtotal={isEdit ? switchImportSubtotalsOnEdit : switchImportSubtotalsOnImport}
        importSubtotal={
          editedObject.subtotalsInfo ? editedObject.subtotalsInfo.importSubtotal : importSubtotal
        }
        handleUnauthorized={handleUnauthorized}
        onDisplayAttrFormNamesUpdate={
          isEdit ? updateDisplayAttrFormOnEdit : updateDisplayAttrFormOnImport
        }
        displayAttrFormNames={displayAttrFormSet}
        displayAttrFormNamesOptions={officeProperties.displayAttrFormNamesOptions}
      />
    </ErrorBoundary>
  );
};

// TODO: fix any types
const mapStateToProps = (state: {
  navigationTree: {
    [x: string]: any;
    promptsAnswers: any;
    importSubtotal: any;
    displayAttrFormNames: any;
  };
  popupStateReducer: any;
  popupReducer: any;
  sessionReducer: any;
  officeReducer: any;
}): any => {
  const {
    navigationTree: { promptsAnswers, importSubtotal, displayAttrFormNames, ...chosenObject },
    popupStateReducer,
    popupReducer,
    sessionReducer,
    officeReducer,
  } = state;
  const { editedObject } = popupReducer;
  const { supportForms } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const isReport =
    editedObject && editedObject.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  return {
    chosenObject,
    supportForms,
    editedObject: {
      ...popupHelper.parsePopupState(editedObject, promptsAnswers, formsPrivilege),
    },
    popupState: { ...popupStateReducer },
    session: { ...sessionReducer },
    importSubtotal,
    displayAttrFormNames,
  };
};

const mapDispatchToProps = {
  switchImportSubtotalsOnImport: navigationTreeActions.switchImportSubtotalsOnImport,
  switchImportSubtotalsOnEdit: popupActions.switchImportSubtotalsOnEdit,
  updateDisplayAttrFormOnImport: navigationTreeActions.updateDisplayAttrFormOnImport,
  updateDisplayAttrFormOnEdit: popupActions.updateDisplayAttrFormOnEdit,
};

export const AttributeSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributeSelectorNotConnected);
