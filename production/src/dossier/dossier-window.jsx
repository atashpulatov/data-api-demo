import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { MSTRIcon } from '@mstr/mstr-react-library';
import { PopupButtons } from '../popup/popup-buttons/popup-buttons';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { EmbeddedDossier } from './embedded-dossier';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import './dossier.css';
import { DEFAULT_PROJECT_NAME, } from '../storage/navigation-tree-reducer';
import { popupHelper } from '../popup/popup-helper';
import { popupStateActions } from '../popup/popup-state-actions';

export default class _DossierWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisualizationSelected: false,
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
      isVisualizationSelected: newValue,
      chapterKey,
      visualizationKey,
      promptsAnswers,
      preparedInstanceId
    });
  }

  handleOk() {
    const { chosenObjectName, chosenObjectId, chosenProjectId, editedObject } = this.props;
    const { isEdit } = editedObject;
    const { chapterKey, visualizationKey, promptsAnswers, preparedInstanceId } = this.state;
    const visualizationInfo = {
      chapterKey,
      visualizationKey,
    };
    const okObject = {
      command: selectorProperties.commandOk,
      chosenObjectName,
      chosenObject: chosenObjectId,
      chosenProject: chosenProjectId,
      chosenSubtype: mstrObjectEnum.mstrObjectType.visualization.subtypes,
      isPrompted: false,
      promptsAnswers,
      visualizationInfo,
      preparedInstanceId,
      isEdit,
    };
    const { Office } = window;
    Office.context.ui.messageParent(JSON.stringify(okObject));
  }

  handlePromptAnswer(newAnswerws, newInstanceId) {
    this.setState({ promptsAnswers: newAnswerws, preparedInstanceId: newInstanceId });
  }

  render() {
    const { chosenObjectName, t, handleBack } = this.props;
    const isEdit = (chosenObjectName === DEFAULT_PROJECT_NAME);
    const { isVisualizationSelected } = this.state;
    return (
      <div>
        <h1 title={chosenObjectName} className="ant-col folder-browser-title">
          {`${t('Import Dossier')} > ${chosenObjectName}`}
        </h1>
        <span className="dossier-window-information-frame">
          <MSTRIcon clasName="dossier-window-information-icon" type="info-icon" />
          <span className="dossier-window-information-text">
            {`${t('This view supports the regular dossier manipulations. To import data, select a visualization.')}`}
          </span>
        </span>
        <EmbeddedDossier
          handleSelection={this.handleSelection}
          handlePromptAnswer={this.handlePromptAnswer}
        />
        <PopupButtons
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          handleBack={!isEdit && handleBack}
          hideSecondary
          disableActiveActions={!isVisualizationSelected}
        />
      </div>
    );
  }
}

_DossierWindow.propTypes = {
  chosenObjectId: PropTypes.string,
  chosenObjectName: PropTypes.string,
  chosenProjectId: PropTypes.string,
  t: PropTypes.func,
  mstrData: PropTypes.shape({
    envUrl: PropTypes.string,
    authToken: PropTypes.string,
    promptsAnswers: PropTypes.array || null
  }),
  editedObject: PropTypes.shape({
    chosenObjectId: PropTypes.string,
    projectId: PropTypes.string,
    isEdit: PropTypes.bool,
    instanceId: PropTypes.string,
    dossierName: PropTypes.string,
    promptsAnswers: PropTypes.array || null,
    selectedViz: PropTypes.string,
  }),
};

_DossierWindow.defaultProps = {
  chosenObjectId: 'default id',
  chosenObjectName: DEFAULT_PROJECT_NAME,
  chosenProjectId: 'default id',
  t: (text) => text,
  mstrData: {
    envUrl: 'no env url',
    authToken: null,
    promptsAnswers: null
  },
  editedObject: {
    chosenObjectId: undefined,
    projectId: undefined,
    isEdit: false,
    instanceId: undefined,
    dossierName: undefined,
    promptsAnswers: null,
    selectedViz: '',
  },
};

function mapStateToProps(state) {
  const { chosenObjectName, chosenObjectId, chosenProjectId, promptsAnswers } = state.navigationTree;
  const popupState = state.popupReducer.editedObject;
  return {
    chosenObjectName: popupState ? popupState.chosenObjectName : chosenObjectName,
    chosenObjectId: popupState ? popupState.chosenObjectId : chosenObjectId,
    chosenProjectId: popupState ? popupState.projectId : chosenProjectId,
    editedObject: { ...(popupHelper.parsePopupState(popupState, promptsAnswers)) },
  };
}

const mapActionsToProps = { handleBack: popupStateActions.onPopupBack, };

export const DossierWindow = connect(mapStateToProps, mapActionsToProps)(withTranslation('common')(_DossierWindow));
