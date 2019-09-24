import React from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import '../popup/popup-buttons.css';
import { withTranslation } from 'react-i18next';
import { cancelImportRequest } from '../navigation/navigation-tree-actions';

export const _PromptWindowButtons = ({
  handleRun, isReprompt, closePopup, cancelImportRequest, handleBack, t = (text) => text,
}) => (
  <div className="popup-buttons popup-footer">
    {!isReprompt && <Button id="back" onClick={() => cancelImportRequest() && handleBack()}>{t('Back')}</Button>}
    <Button id="run" onClick={handleRun}>{t('Run')}</Button>
    <Button id="cancel" onClick={closePopup}>{t('Cancel')}</Button>
  </div>
);

export const PromptWindowButtons = connect(() => ({}), { cancelImportRequest })(withTranslation('common')(_PromptWindowButtons));
