import React from 'react';
import {Button} from 'antd';
import './popup-buttons.css';
import {withTranslation} from 'react-i18next';

export const _PopupButtons = ({handleOk, handleSecondary,
  handleCancel, handleBack, loading, disableActiveActions, onPreviewClick, t}) => {
  return (
    <div className="popup-buttons popup-footer">
      {!handleSecondary && <Button id="data-preview" onClick={onPreviewClick} disabled={disableActiveActions}>
        {t('Data Preview')}
      </Button>}
      {
        handleBack &&
        <Button id="back" onClick={handleBack}>
          {t('Back')}
        </Button>
      }
      <Button id="import" type={!handleSecondary ? 'primary' : ''} onClick={handleOk} loading={loading} disabled={disableActiveActions}>
        {t('Import')}
      </Button>
      {
        handleSecondary &&
        <Button id="prepare" type="primary"
          disabled={disableActiveActions || loading}
          onClick={handleSecondary}>
          {t('Prepare Data')}
        </Button>
      }
      <Button id="cancel" onClick={handleCancel}>
        {t('Cancel')}
      </Button>
    </div >
  );
};

export const PopupButtons = withTranslation('common')(_PopupButtons);
