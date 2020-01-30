import React, { Component } from 'react';
import { AttributeMetricFilter, ErrorBoundary } from '@mstr/mstr-react-library';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { popupHelper } from '../popup/popup-helper';
import { switchImportSubtotals, updateDisplayAttrForm } from '../navigation/navigation-tree-actions';
import { officeProperties } from '../office/office-properties';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';

export class AttributeSelectorNotConnected extends Component {
  constructor(props) {
    super(props);
    this.handleUnauthorized = this.handleUnauthorized.bind(this);
  }

  /**
   * Handles unathorized error from library - rearrange
   * properties to be compatible with errorService.handleError
   *
   * @param {Error} e -  Error thrown by mstrReactLibrary
   */
  handleUnauthorized(e) {
    const { handlePopupErrors } = this.props;
    const newErrorObject = {
      status: e.status,
      response: {
        ...e.response,
        body: {
          code: 'ERR009',
          message: 'The user\'s session has expired, please reauthenticate',
        },
        text: '{"code":"ERR009","message":"The user\'s session has expired, please reauthenticate"}',
      }
    };
    handlePopupErrors(newErrorObject);
  }

  render() {
    const {
      title, session, displayAttrFormNames, updateDisplayAttrForm,
      triggerUpdate, onTriggerUpdate, chosenObject, importSubtotal, editedObject, supportForms,
      resetTriggerUpdate, attributesSelectedChange, t, openModal, closeModal, switchImportSubtotals,
    } = this.props;
    const defaultAttrFormNames = officeProperties.displayAttrFormNames.automatic;
    const displayAttrFormSet = editedObject.displayAttrFormNames || displayAttrFormNames || defaultAttrFormNames;

    return (
      <ErrorBoundary>
        <AttributeMetricFilter
          t={t}
          attributesSelectedChange={attributesSelectedChange}
          key={chosenObject.id}
          title={title}
          session={mapToLegacySession(chosenObject, session, editedObject)}
          mstrData={{ ...mapToLegacyMstrData(chosenObject, session, editedObject), supportForms }}
          triggerUpdate={triggerUpdate}
          onTriggerUpdate={onTriggerUpdate}
          withDataPreview
          resetTriggerUpdate={resetTriggerUpdate}
          withFolderTree={false}
          openModal={openModal}
          closeModal={closeModal}
          toggleSubtotal={switchImportSubtotals}
          importSubtotal={editedObject.subtotalsInfo ? editedObject.subtotalsInfo.importSubtotal : importSubtotal}
          handleUnauthorized={this.handleUnauthorized}
          onDisplayAttrFormNamesUpdate={updateDisplayAttrForm}
          displayAttrFormNames={displayAttrFormSet}
          displayAttrFormNamesOptions={officeProperties.displayAttrFormNamesOptions}
        />
      </ErrorBoundary>
    );
  }
}

const mapToLegacyMstrData = (chosenObject, session, editedObject) => {
  const legacyObject = {
    reportId: chosenObject.chosenObjectId || editedObject.chosenObjectId,
    envUrl: session.envUrl || session.envUrl,
    projectId: chosenObject.chosenProjectId || editedObject.projectId,
    reportSubtype: chosenObject.chosenSubtype || editedObject.chosenObjectSubtype,
    reportType: chosenObject.chosenObjectId ? chosenObject.objectType.name : editedObject.chosenObjectType,
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

const mapToLegacySession = (mstrData, session, editedObject) => ({
  url: session.envUrl,
  USE_PROXY: false,
  authToken: session.authToken,
  projectId: mstrData.chosenProjectId || editedObject.projectId,
  attrFormPrivilege: session.attrFormPrivilege
});

AttributeSelectorNotConnected.propTypes = {
  title: PropTypes.string,
  triggerUpdate: PropTypes.bool,
  openModal: PropTypes.bool,
  session: PropTypes.shape({}),
  mstrData: PropTypes.shape({
    chosenObjectId: PropTypes.string,
    // subtotalsInfo: PropTypes.shape({ importSubtotal: PropTypes.bool })
  }),
  resetTriggerUpdate: PropTypes.func,
  attributesSelectedChange: PropTypes.func,
  closeModal: PropTypes.func,
  updateDisplayAttrForm: PropTypes.func,
  handlePopupErrors: PropTypes.func,
  onTriggerUpdate: PropTypes.func,
  t: PropTypes.func
};
AttributeSelectorNotConnected.defaultProps = { t: (text) => text, };

const mapStateToProps = (state) => {
  const { navigationTree, popupStateReducer, popupReducer, sessionReducer, officeReducer } = state;
  const { editedObject } = popupReducer;
  const { promptsAnswers, importSubtotal, displayAttrFormNames, ...chosenObject } = navigationTree;
  const { supportForms } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const objectType = editedObject && editedObject.objectType ? editedObject.objectType : mstrObjectEnum.mstrObjectType.report.name;
  const isReport = objectType && (objectType === mstrObjectEnum.mstrObjectType.report.name || objectType.name === mstrObjectEnum.mstrObjectType.report.name);
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

const mapDispatchToProps = { switchImportSubtotals, updateDisplayAttrForm };

export const AttributeSelector = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(AttributeSelectorNotConnected));
