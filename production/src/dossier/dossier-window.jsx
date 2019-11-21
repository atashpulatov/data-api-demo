import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { MSTRIcon } from '@mstr/mstr-react-library';
import { PopupButtons } from '../popup/popup-buttons';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { EmbeddedDossier } from './embedded-dossier';
import { actions } from '../navigation/navigation-tree-actions';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import './dossier.css';
import { DEFAULT_PROJECT_NAME, } from '../storage/navigation-tree-reducer';

export default class _DossierWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisualisationSelected: false,
      chapterKey: '',
      visualizationKey: '',
      promptsAnswers: [],
      preparedInstanceId: '',
    };
    this.handleSelection = this.handleSelection.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handlePromptAnswer = this.handlePromptAnswer.bind(this);
  }

  handleCancel() {
    const { Office } = window;
    const cancelObject = { command: selectorProperties.commandCancel, };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  }

  handleSelection(dossierData) {
    const { chapterKey, visualizationKey, promptsAnswers, preparedInstanceId } = dossierData;
    let newValue = false;
    if ((chapterKey !== '') && (visualizationKey !== '')) {
      newValue = true;
    }
    this.setState({
      isVisualisationSelected: newValue,
      chapterKey,
      visualizationKey,
      promptsAnswers,
      preparedInstanceId
    });
  }

  handleOk() {
    const { chosenObjectName, chosenObjectId, chosenProjectId, requestImport, selectObject, editedReport } = this.props;
    const { reportId, projectId, isEdit } = editedReport;
    const { chapterKey, visualizationKey, promptsAnswers, preparedInstanceId } = this.state;
    const selectedVisualization = {
      chosenObjectName,
      chosenObjectId: chosenObjectId || reportId,
      chosenProjectId: chosenProjectId || projectId,
      chosenSubtype: mstrObjectEnum.mstrObjectType.visualization.subtypes,
      objectType: mstrObjectEnum.mstrObjectType.visualization.type,
      chosenChapterKey: chapterKey,
      chosenVisualizationKey: visualizationKey,
      promptsAnswers,
      preparedInstanceId,
      isEdit,
    };
    selectObject(selectedVisualization);
    requestImport();
  }

  handlePromptAnswer(newAnswerws, newInstanceId) {
    this.setState({ promptsAnswers: newAnswerws, preparedInstanceId: newInstanceId });
  }

  render() {
    const { chosenObjectName, chosenObjectId, chosenProjectId, handleBack, t, mstrData, editedReport, handlePopupErrors } = this.props;
    const { envUrl, token } = mstrData;
    const { reportId: editetObjectId, projectId: editedProjectId, instanceId: editedInstanceId, dossierName: editedObjectName, promptsAnswers: editedPromptsAnswers } = editedReport;
    const { isVisualisationSelected, promptsAnswers } = this.state;
    const isEdit = (chosenObjectName === DEFAULT_PROJECT_NAME);
    const propsToPass = {
      envUrl,
      token,
      dossierId: isEdit ? editetObjectId : chosenObjectId,
      projectId: isEdit ? editedProjectId : chosenProjectId,
      promptsAnswers: isEdit ? editedPromptsAnswers : promptsAnswers,

    };
    if (isEdit) propsToPass.instanceId = editedInstanceId;
    const dossierFinalName = (isEdit) ? editedObjectName : chosenObjectName;
    return (
      <div>
        <h1 title={dossierFinalName} className="ant-col folder-browser-title">
          {`${t('Import Dossier')} > ${dossierFinalName}`}
        </h1>
        <span className="dossier-window-information-frame">
          <MSTRIcon clasName="dossier-window-information-icon" type="info-icon" />
          <span className="dossier-window-information-text">
            {`${t('This view supports the regular dossier manipulations. To import data, select a visualization.')}`}
          </span>
        </span>
        <EmbeddedDossier
          mstrData={propsToPass}
          handleSelection={this.handleSelection}
          handlePromptAnswer={this.handlePromptAnswer}
          handlePopupErrors={handlePopupErrors}
        />
        <PopupButtons
          handleOk={this.handleOk}
          handleBack={handleBack}
          handleCancel={this.handleCancel}
          hideSecondary
          disableActiveActions={!isVisualisationSelected}
        />
      </div>
    );
  }
}

_DossierWindow.propTypes = {
  chosenObjectId: PropTypes.string,
  chosenObjectName: PropTypes.string,
  chosenProjectId: PropTypes.string,
  handleBack: PropTypes.func,
  t: PropTypes.func,
  mstrData: PropTypes.shape({
    envUrl: PropTypes.string,
    token: PropTypes.string,
    promptsAnswers: PropTypes.array || null
  }),
  requestImport: PropTypes.func,
  selectObject: PropTypes.func,
  handlePopupErrors: PropTypes.func,
  editedReport: PropTypes.shape({
    reportId: PropTypes.string,
    projectId: PropTypes.string,
    isEdit: PropTypes.bool
  }),
};

_DossierWindow.defaultProps = {
  chosenObjectId: 'default id',
  chosenObjectName: DEFAULT_PROJECT_NAME,
  chosenProjectId: 'default id',
  handleBack: () => { },
  t: (text) => text,
  mstrData: {
    envUrl: 'no env url',
    token: null,
    promptsAnswers: null
  },
  requestImport: () => { },
  selectObject: () => { },
  handlePopupErrors: () => { },
  editedReport: {
    reportId: undefined,
    projectId: undefined,
    isEdit: false
  },
};

function mapStateToProps(state) {
  const { chosenObjectName, chosenObjectId, chosenProjectId } = state.navigationTree;
  return {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
  };
}

const mapActionsToProps = {
  requestImport: actions.requestImport,
  selectObject: actions.selectObject,
};

export const DossierWindow = connect(mapStateToProps, mapActionsToProps)(withTranslation('common')(_DossierWindow));
