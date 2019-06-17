import React from 'react';
import {Button} from 'antd';
import {connect} from 'react-redux';
import '../popup/popup-buttons.css';
import {cancelImportRequest} from '../navigation/navigation-tree-actions';
import {withTranslation} from 'react-i18next';

export const _PromptWindowButtons = ({handleRun, cancelImportRequest, t = (text) => text}) => {
  return (
    <div className="popup-buttons popup-footer">
      <Button id="run" onClick={handleRun}>{t('Run')}</Button>
      <Button id="cancel" onClick={cancelImportRequest}>{t('Cancel')}</Button>
    </div >
  );
};

export const PromptWindowButtons = connect(() => ({}), {cancelImportRequest})(withTranslation('common')(_PromptWindowButtons));
