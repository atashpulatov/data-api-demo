import React, { Component } from 'react';
import { AttributeMetricFilter, ErrorBoundary } from '@mstr/mstr-react-library';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { popupHelper } from '../popup/popup-helper';

export class AttributeSelectorHOC extends Component {
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
      title, session,
      triggerUpdate, onTriggerUpdate, chosen, importSubtotal, editedObject,
      resetTriggerUpdate, attributesSelectedChange, t, openModal, closeModal, toggleSubtotal,
    } = this.props;

    console.log({ props: this.props });

    return (
      <ErrorBoundary>
        <AttributeMetricFilter
          t={t}
          attributesSelectedChange={attributesSelectedChange}
          key={chosen.id}
          title={title}
          session={mapToLegacySession(chosen, session, editedObject)}
          mstrData={mapToLegacyMstrData(chosen, session, editedObject)}
          triggerUpdate={triggerUpdate}
          onTriggerUpdate={onTriggerUpdate}
          withDataPreview
          resetTriggerUpdate={resetTriggerUpdate}
          withFolderTree={false}
          openModal={openModal}
          closeModal={closeModal}
          toggleSubtotal={toggleSubtotal}
          importSubtotal={importSubtotal}
          handleUnauthorized={this.handleUnauthorized}
        />
      </ErrorBoundary>
    );
  }
}

const mapToLegacyMstrData = (mstrData, session, editedObject) => {
  const legacyObject = {
    reportId: mstrData.chosenObjectId || editedObject.chosenObjectId,
    envUrl: session.envUrl || session.envUrl,
    projectId: mstrData.chosenProjectId || editedObject.projectId,
    reportSubtype: mstrData.chosenSubtype || editedObject.chosenObjectSubtype,
    reportType: mstrData.chosenObjectId ? mstrData.objectType.name : editedObject.chosenObjectType,
    reportName: mstrData.chosenObjectName || editedObject.chosenObjectName,
    token: session.authToken,
    authToken: session.authToken,
    isPrompted: mstrData && mstrData.isPrompted,
    promptsAnswers: editedObject && editedObject.promptsAnswers,
    selectedAttributes: editedObject.selectedAttributes,
    selectedMetrics: editedObject.selectedMetrics,
    selectedFilters: editedObject.selectedFilters,
  };
  console.log({ legacyObject, chosen: mstrData, session, editedObject });

  return legacyObject;
};

const mapToLegacySession = (mstrData, session, editedObject) => ({
  url: session.envUrl,
  USE_PROXY: false,
  authToken: session.authToken,
  projectId: mstrData.chosenProjectId || editedObject.projectId,
});

AttributeSelectorHOC.propTypes = {
  title: PropTypes.string,
  triggerUpdate: PropTypes.bool,
  openModal: PropTypes.bool,
  session: PropTypes.shape({}),
  mstrData: PropTypes.shape({
    chosenObjectId: PropTypes.string,
    importSubtotal: PropTypes.bool
  }),
  resetTriggerUpdate: PropTypes.func,
  attributesSelectedChange: PropTypes.func,
  closeModal: PropTypes.func,
  toggleSubtotal: PropTypes.func,
  handlePopupErrors: PropTypes.func,
  onTriggerUpdate: PropTypes.func,
  t: PropTypes.func
};
AttributeSelectorHOC.defaultProps = { t: (text) => text, };

const mapStateToProps = (state) => {
  const { navigationTree, popupStateReducer, popupReducer, sessionReducer } = state;
  const popupState = popupReducer.editedObject;
  const { promptsAnswers, importSubtotal, ...chosen } = navigationTree;
  console.log({ state });

  return {
    chosen,
    importSubtotal,
    editedObject: { ...(popupHelper.parsePopupState(popupState, promptsAnswers)) },
    popupState: { ...popupStateReducer },
    session: { ...sessionReducer },
  };
};

const mapDispatchToProps = {};

export const AttributeSelector = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(AttributeSelectorHOC));
