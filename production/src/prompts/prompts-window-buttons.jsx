import React from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import '../popup/popup-buttons.css';
import { withTranslation } from 'react-i18next';
import { cancelImportRequest } from '../navigation/navigation-tree-actions';
import {popupStateActions} from '../popup/popup-state-actions';

export const _PromptWindowButtons = ({
  handleRun, isReprompt, closePopup, cancelImportRequest,
  handleBack, t = (text) => text, disableRunButton
}) => (
  <div className="popup-buttons popup-footer">
    {!isReprompt && <Button id="back" onClick={() => cancelImportRequest() && handleBack()}>{t('Back')}</Button>}
    <Button id="run" type="primary" onClick={handleRun} disabled={disableRunButton}>{t('Run')} </Button>
    <Button id="cancel" onClick={closePopup}>{t('Cancel')}</Button>
  </div>
);

export const PromptWindowButtons = connect(() => ({}), { cancelImportRequest, handleBack: popupStateActions.onPopupBack })(withTranslation('common')(_PromptWindowButtons));
