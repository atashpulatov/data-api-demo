import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { PopupButtons } from '../popup/popup-buttons';
import { selectorProperties } from '../attribute-selector/selector-properties';

const { Office } = window;

export default class _DossierWindow extends React.Component {
  handleCancel() {
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  }

  render() {
    const {
      dossierId, dossierName, handleBack, t,
    } = this.props;
    return (
      <div>
        <h1 title={dossierName} className="ant-col folder-browser-title">{`${t('Importing')} ${dossierName} with id = ${dossierId}`}</h1>
        <p>DossierWindowComponent</p>
        <PopupButtons
          handleBack={handleBack}
          handleCancel={this.handleCancel}
        />
      </div>
    );
  }
}

_DossierWindow.propTypes = {
  dossierId: PropTypes.number,
  dossierName: PropTypes.string,
  handleBack: PropTypes.func,
  t: PropTypes.func,
};

_DossierWindow.defaultProps = {
  dossierId: 1234,
  dossierName: 'testingName',
  handleBack: () => { },
  t: (text) => text,
};

export const DossierWindow = connect()(withTranslation('common')(_DossierWindow));
