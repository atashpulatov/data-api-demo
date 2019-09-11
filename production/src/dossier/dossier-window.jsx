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
    };
  }

  handleCancel() {
    const { Office } = window;
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  }

  render() {
    const { chosenObjectId, chosenProjectName, handleBack, t } = this.props;
    const { isVisualisationSelected } = this.state;
    return (
      <div>
        <h1 title={chosenProjectName} className="ant-col folder-browser-title">{`${t('Import Dossier')} > ${chosenProjectName}`}</h1>
        {/* TODO:  Insert  dossier iframe for embeded API by using dossierId */}
        <PopupButtons
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
