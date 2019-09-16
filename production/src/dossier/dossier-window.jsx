import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { PopupButtons } from '../popup/popup-buttons';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { EmbeddedDossier } from './embedded-dossier';

export default class _DossierWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisualisationSelected: false,
      // TODO: chapterKey: '',
      // TODO: visualisationKey: '',
    };
    this.handleSelection = this.handleSelection.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  handleCancel() {
    const { Office } = window;
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  }

  handleSelection(e) {
    // TODO: let newValue = false;
    // TODO: if ((e.chapterKey !== '') && (e.visualisationKey !== '')) {
    // TODO:  newValue = true;
    // TODO: }
    // TODO: this.setState({ isVisualisationSelected: newValue, chapterKey: e.chapterKey, visualisationKey: e.visualisationKey   });
  }

  handleOk() {
    // TODO: const {chosenObjectId} = this.props;
    // TODO: const {chapterKey, visualisationKey } = this.state;
    // TODO: fetchVisualisationData( )
    // TODO: await fethcing data and procced to import
  }

  render() {
    const { chosenProjectName, chosenObjectId, chosenProjectId, handleBack, t, mstrData } = this.props;
    const { isVisualisationSelected } = this.state;
    const propsToPass = { envUrl: mstrData.envUrl, token: mstrData.token, dossierId: chosenObjectId, projectId: chosenProjectId };
    return (
      <div>
        <h1 title={chosenProjectName} className="ant-col folder-browser-title">{`${t('Import Dossier')} > ${chosenProjectName}`}</h1>
        <EmbeddedDossier mstrData={propsToPass} />
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
  chosenProjectName: PropTypes.string,
  chosenProjectId: PropTypes.string,
  handleBack: PropTypes.func,
  t: PropTypes.func,
  mstrData: PropTypes.shape({ envUrl: PropTypes.string, token: PropTypes.string }),
};

_DossierWindow.defaultProps = {
  chosenObjectId: 'default id',
  chosenProjectName: 'default name',
  chosenProjectId: 'default id',
  handleBack: () => { },
  t: (text) => text,
  mstrData: { envUrl: 'no env url', token: 'no token' },
};

function mapStateToProps(state) {
  const { chosenProjectName, chosenObjectId, chosenProjectId } = state.navigationTree;
  return {
    chosenProjectName,
    chosenObjectId,
    chosenProjectId,
  };
}

export const DossierWindow = connect(mapStateToProps)(withTranslation('common')(_DossierWindow));
