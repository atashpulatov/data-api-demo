import React from 'react';
import { Button, Popover } from 'antd';
import './popup-buttons.css';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

const prepareButton = (disableActiveActions, button, t) => (disableActiveActions
  ? (
    <Popover className="button-tooltip" placement="topRight" content={t('This button is currently disabled because you didn’t select any data')} mouseEnterDelay={1}>
      {button}
    </Popover>
  ) : button);

export const _PopupButtons = ({
  handleOk, handleSecondary, handleCancel, handleBack,
  loading, disableActiveActions, onPreviewClick, t = (text) => text,
  hideSecondary,
}) => (
    <div className="popup-buttons popup-footer">
      {!hideSecondary && !handleSecondary && prepareButton(disableActiveActions, <Button id="data-preview" onClick={onPreviewClick} disabled={disableActiveActions}>
        {t('Data Preview')}
      </Button>, t)}
      {
        handleBack
        && (
          <Button id="back" onClick={handleBack}>
            {t('Back')}
          </Button>
        )
      }
      {
        prepareButton(disableActiveActions, <Button id="import" type={!handleSecondary ? 'primary' : ''} onClick={handleOk} loading={loading} disabled={disableActiveActions}>
          {t('Import')}
        </Button>, t)
      }
      {!hideSecondary && handleSecondary && prepareButton(disableActiveActions, <Button
        id="prepare"
        type="primary"
        disabled={disableActiveActions || loading}
        onClick={handleSecondary}
      >
        {t('Prepare Data')}
      </Button>, t)}
      <Button id="cancel" onClick={handleCancel}>
        {t('Cancel')}
      </Button>
    </div>
  );

function mapStateToProps({ navigationTree }) {
  return { isPrompted: navigationTree.isPrompted };
}

export const PopupButtons = connect(mapStateToProps)(withTranslation('common')(_PopupButtons));
