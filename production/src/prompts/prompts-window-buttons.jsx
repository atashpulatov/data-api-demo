import React from 'react';
import {Button} from 'antd';
import {connect} from 'react-redux';
import '../popup/popup-buttons.css';
import {cancelImportRequest} from '../navigation/navigation-tree-actions';
import {withTranslation} from 'react-i18next';
import {selectorProperties} from '../attribute-selector/selector-properties';

export const _PromptWindowButtons = ({handleRun, isReprompt, cancelImportRequest, t = (text) => text}) => {
  const handleCancel = () => {
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  };
  return (
    <div className="popup-buttons popup-footer">
      <Button id="run" onClick={handleRun}>{t('Run')}</Button>
      <Button id="cancel" onClick={isReprompt ? handleCancel : cancelImportRequest}>{t('Cancel')}</Button>
    </div >
  );
};

export const PromptWindowButtons = connect(() => ({}), {cancelImportRequest})(withTranslation('common')(_PromptWindowButtons));
