import React, { Component } from 'react';
import { AttributeMetricFilter, ErrorBoundary } from '@mstr/mstr-react-library';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { popupHelper } from '../popup/popup-helper';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { officeProperties } from '../redux-reducer/office-reducer/office-properties';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { officeContext } from '../office/office-context';
import { SESSION_EXTENSION_FAILURE_MESSAGE, errorCodes } from '../error/constants';


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
    const { ERR009 } = errorCodes;
    const { handlePopupErrors } = this.props;
    const newErrorObject = {
      status: e.status,
      response: {
        ...e.response,
        body: {
          code: ERR009,
          message: SESSION_EXTENSION_FAILURE_MESSAGE,
        },
        text: `{code: ${ERR009}, message: ${SESSION_EXTENSION_FAILURE_MESSAGE}}`,
      }
    };
    handlePopupErrors(newErrorObject);
  }

  render() {
    const {
      title, session, displayAttrFormNames, updateDisplayAttrForm, isEdit,
      triggerUpdate, onTriggerUpdate, chosenObject, importSubtotal, editedObject, supportForms,
      resetTriggerUpdate, attributesSelectedChange, t, openModal, closeModal, switchImportSubtotals,
    } = this.props;
    const locale = officeContext.getOffice().context.displayLanguage;
    const defaultAttrFormNames = officeProperties.displayAttrFormNames.automatic;
    const displayAttrFormSet = editedObject.displayAttrFormNames || displayAttrFormNames || defaultAttrFormNames;
    return (
      <ErrorBoundary>
        <AttributeMetricFilter
          t={t}
          locale={locale}
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
  mstrData: PropTypes.shape({ chosenObjectId: PropTypes.string, }),
  resetTriggerUpdate: PropTypes.func,
  attributesSelectedChange: PropTypes.func,
  closeModal: PropTypes.func,
  updateDisplayAttrForm: PropTypes.func,
  handlePopupErrors: PropTypes.func,
  onTriggerUpdate: PropTypes.func,
  t: PropTypes.func,
  isEdit: PropTypes.bool,
  importSubtotal: PropTypes.bool,
  switchImportSubtotals: PropTypes.func,
  displayAttrFormNames: PropTypes.string,
  chosenObject: PropTypes.shape({ id: PropTypes.string, }),
  editedObject: PropTypes.shape({
    displayAttrFormNames: PropTypes.string,
    subtotalsInfo: PropTypes.shape({ importSubtotal: PropTypes.bool, }),
    projectId: PropTypes.string,
    promptsAnswers: PropTypes.arrayOf(PropTypes.shape({}))
  }),
  supportForms: PropTypes.bool,
};

AttributeSelectorNotConnected.defaultProps = { t: (text) => text, };

const mapStateToProps = (state) => {
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
  switchImportSubtotals: navigationTreeActions.switchImportSubtotals,
  updateDisplayAttrForm: navigationTreeActions.updateDisplayAttrForm,
};

export const AttributeSelector = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(AttributeSelectorNotConnected));
