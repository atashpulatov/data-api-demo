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
    const { chosenObjectId, chosenProjectId, requestImport, selectObject } = this.props;
    const { chapterKey, visualizationKey, promptsAnswers, preparedInstanceId } = this.state;
    const selectedVisualization = {
      chosenObjectId,
      chosenProjectId,
      chosenSubtype: mstrObjectEnum.mstrObjectType.visualization.subtypes,
      objectType: mstrObjectEnum.mstrObjectType.visualization.type,
      chosenChapterKey: chapterKey,
      chosenVisualizationKey: visualizationKey,
      promptsAnswers,
      preparedInstanceId,
    };
    selectObject(selectedVisualization);
    requestImport();
  }

  render() {
    const { chosenObjectName, chosenObjectId, chosenProjectId, handleBack, t, mstrData, handlePopupErrors } = this.props;
    const { isVisualisationSelected } = this.state;
    const propsToPass = {
      envUrl: mstrData.envUrl,
      token: mstrData.token,
      dossierId: chosenObjectId,
      projectId: chosenProjectId,
      promptsAnswers: mstrData.promptsAnswers
    };
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
          mstrData={propsToPass}
          handleSelection={this.handleSelection}
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
};

_DossierWindow.defaultProps = {
  chosenObjectId: 'default id',
  chosenObjectName: 'default name',
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
};

function mapStateToProps(state) {
  const { chosenObjectName, chosenObjectId, chosenProjectId } = state.navigationTree;
  return {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
  };
}

export const DossierWindow = connect(mapStateToProps, actions)(withTranslation('common')(_DossierWindow));
