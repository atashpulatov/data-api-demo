import React from 'react';
import {Button} from 'antd';
import {connect} from 'react-redux';
import '../popup/popup-buttons.css';
import {withTranslation} from 'react-i18next';

export const _PromptWindowButtons = ({handleRun, isReprompt, closePopup, cancelImportRequest, handleBack, t = (text) => text}) => {
  return (
    <div className="popup-buttons popup-footer">
      {!isReprompt && <Button id="back" onClick={() => cancelImportRequest() && handleBack()}>{t('Back')}</Button>}
      <Button id="run" onClick={handleRun}>{t('Run')}</Button>
      <Button id="cancel" onClick={closePopup}>{t('Cancel')}</Button>
    </div >
  );
};

export const PromptWindowButtons = withTranslation('common')(_PromptWindowButtons);
