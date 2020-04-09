import React from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../popup/popup-buttons/popup-buttons.css';
import { withTranslation } from 'react-i18next';
import { cancelImportRequest } from '../navigation/navigation-tree-actions';
import { popupStateActions } from '../popup/popup-state-actions';

export const PromptWindowButtonsNotConnected = ({
  handleRun,
  isReprompt,
  closePopup,
  cancelImport,
  handleBack,
  t = (text) => text,
  disableRunButton
}) => (
  <div className="popup-buttons popup-footer">
    {!isReprompt && <Button id="back" onClick={() => cancelImport() && handleBack()}>{t('Back')}</Button>}
    <Button id="run" type="primary" onClick={handleRun} disabled={disableRunButton}>{t('Run')} </Button>
    <Button id="cancel" onClick={closePopup}>{t('Cancel')}</Button>
  </div>
);

PromptWindowButtonsNotConnected.propTypes = {
  handleRun: PropTypes.func,
  isReprompt: PropTypes.bool,
  closePopup: PropTypes.func,
  cancelImport: PropTypes.func,
  handleBack: PropTypes.func,
  t: PropTypes.func,
  disableRunButton: PropTypes.bool,

};

export const PromptWindowButtons = connect(() => ({}), { cancelImport: cancelImportRequest, handleBack: popupStateActions.onPopupBack })(withTranslation('common')(PromptWindowButtonsNotConnected));
