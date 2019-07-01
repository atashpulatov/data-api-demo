import React from 'react';
import {Button} from 'antd';
import './popup-buttons.css';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';

export const _PopupButtons = ({handleOk, handleSecondary,
  handleCancel, handleBack, loading, disableActiveActions, onPreviewClick, isPrompted, t = (text) => text}) => {
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
          disabled={disableActiveActions || loading || isPrompted}
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

function mapStateToProps({navigationTree}) {
  return {isPrompted: navigationTree.isPrompted};
}

export const PopupButtons = connect(mapStateToProps)(withTranslation('common')(_PopupButtons));
