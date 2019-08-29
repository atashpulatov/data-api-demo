import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { PopupButtons } from '../popup/popup-buttons';
import { selectorProperties } from '../attribute-selector/selector-properties';

export default class _DossierWindow extends React.Component {
  handleCancel() {
    const { Office } = window;
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  }

  render() {
    const {
      dossierName, handleBack, t, isVisualisationSelected,
    } = this.props;
    return (
      <div>
        <h1 title={dossierName} className="ant-col folder-browser-title">{`${t('Import Dossier')} > ${dossierName}`}</h1>
        {/* TODO:  Insert  dossier iframe for embeded API */}
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
  // TODO: dossierId: PropTypes.number,
  dossierName: PropTypes.string,
  handleBack: PropTypes.func,
  t: PropTypes.func,
  isVisualisationSelected: PropTypes.bool,
};

_DossierWindow.defaultProps = {
  // TODO: dossierId: 1234,
  dossierName: 'testingName',
  handleBack: () => { },
  t: (text) => text,
  isVisualisationSelected: false,
};

export const DossierWindow = connect()(withTranslation('common')(_DossierWindow));
