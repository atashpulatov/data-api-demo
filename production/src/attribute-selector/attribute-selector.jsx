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

const mapToLegacyMstrData = (chosen, session, editedObject) => {
  console.log({ chosen, session, editedObject });

  const legacyObject = {
    reportId: chosen.id || editedObject.chosenObjectId,
    envUrl: session.envUrl || session.envUrl,
    projectId: chosen.projectId || editedObject.projectId,
    reportSubtype: chosen.subtype || editedObject.chosenObjectSubtype,
    reportType: chosen.id ? chosen.type : editedObject.chosenObjectType,
    reportName: chosen.name || editedObject.chosenObjectName,
    token: session.authToken,
    authToken: session.authToken,
    selectedAttributes: editedObject.selectedAttributes,
    selectedMetrics: editedObject.selectedMetrics,

    // forceChange: false
    // isPrompted: 0
    // editRequested: false
    // instanceId: undefined
    // promptsAnswers: undefined
  };
  console.log(legacyObject);
  return legacyObject;
};

// envUrl: "https://aqueduct-tech.customer.cloud.microstrategy.com/MicroStrategyLibrary/api"
// et: ""
// token: "kslnr5asnmnqaiauc5rmne5kvk"
// editRequested: true
// reportId: "F24F07F411E98BF500000080EFF5EDBD"
// instanceId: undefined
// projectId: "0730F68F4B8B4B52AA23F0AAB46F3CA8"
// reportName: "basic report"
// reportType: {type: 3, subtypes: Array(3), name: "report", request: "reports"}
// reportSubtype: 779
// promptsAnswers: null
// importSubtotal: undefined
// isEdit: undefined
// dossierName: undefined
// selectedAttributes: ["D8404BB6437A07581BF0F88B84B64070"]
// selectedMetrics: ["3E653B5849B625073C1599B53BC59E2B"]

const mapToLegacySession = (chosen, session, editedObject) => ({
  url: session.envUrl,
  USE_PROXY: false,
  authToken: session.authToken,
  projectId: chosen.projectId || editedObject.projectId,
})
// USE_PROXY: false
// url: "https://aqueduct-tech.customer.cloud.microstrategy.com/MicroStrategyLibrary/api"
// authToken: "5ok7qdpeavpbcnd804sb798qpf"
// projectId: "0730F68F4B8B4B52AA23F0AAB46F3CA8"
;

// {
//   envUrl: "https://aqueduct-tech.customer.cloud.microstrategy.com/MicroStrategyLibrary/api"
//   et: ""
//   forceChange: false
//   projectId: "0730F68F4B8B4B52AA23F0AAB46F3CA8"
//   reportId: "F24F07F411E98BF500000080EFF5EDBD"
//   reportSubtype: 768
//   reportName: "basic report"
//   reportType: "Report"
//   isPrompted: 0
//   token: "5ok7qdpeavpbcnd804sb798qpf"
//   editRequested: false
//   instanceId: undefined
//   promptsAnswers: undefined
// }

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
  const { promptsAnswers } = navigationTree;
  return {
    chosen: getChosen(navigationTree),
    editedObject: { ...(popupHelper.parsePopupState(popupState, promptsAnswers)) },
    importSubtotal: navigationTree.importSubtotal,
    popupState: { ...popupStateReducer },
    session: { ...sessionReducer },
  };
};
// selectedAttributes: ["D8404BB6437A07581BF0F88B84B64070"]
// selectedMetrics: ["3E653B5849B625073C1599B53BC59E2B"]
const mapDispatchToProps = {};

export const AttributeSelector = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(AttributeSelectorHOC));
function getChosen(navigationTree) {
  console.log(navigationTree);
  return {
    id: navigationTree.chosenObjectId,
    name: navigationTree.chosenObjectName,
    type: navigationTree.objectType.name,
    subtype: navigationTree.chosenSubtype,
    projectId: navigationTree.chosenProjectId,
  };
}
