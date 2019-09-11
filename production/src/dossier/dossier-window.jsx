import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { PopupButtons } from '../popup/popup-buttons';
import { selectorProperties } from '../attribute-selector/selector-properties';

export default class _DossierWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisualisationSelected: false,
      // chapterKey: '',
      // visualisationKey: '',
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
    // TODO:
    // let newValue = false;
    // if ((e.chapterKey !== '') && (e.visualisationKey !== '')) {
    //   newValue = true;
    // }
    // this.setState({ isVisualisationSelected: newValue, chapterKey: e.chapterKey, visualisationKey: e.visualisationKey   });
  }

  handleOk() {
    // TODO: const {chosenObjectId} = this.props;
    // TODO: const {chapterKey, visualisationKey } = this.state;
    // TODO: fetchVisualisationData( )
    // TODO: await fethcing data and procced to import
  }

  render() {
    const { chosenProjectName, handleBack, t } = this.props;
    const { isVisualisationSelected } = this.state;
    return (
      <div>
        <h1 title={chosenProjectName} className="ant-col folder-browser-title">{`${t('Import Dossier')} > ${chosenProjectName}`}</h1>
        {/* TODO:  Insert  dossier iframe for embeded API by using chosenObjectId and attach handlers */}
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
  handleBack: PropTypes.func,
  t: PropTypes.func,
};

_DossierWindow.defaultProps = {
  chosenObjectId: 'default id',
  chosenProjectName: 'default name',
  handleBack: () => { },
  t: (text) => text,
};

function mapStateToProps(state) {
  return {
    ...state.navigationTree,
  };
}

export const DossierWindow = connect(mapStateToProps)(withTranslation('common')(_DossierWindow));
