import React from 'react';
import { Button, Popover } from 'antd';
import './popup-buttons.css';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

const prepareButton = (disableActiveActions, button, t, disableSecondary = false) => {
  const disableReason = disableSecondary ? 'this action in not possible for selected item' : 'you didn’t select any data';
  return ((disableActiveActions || disableSecondary)
    ? (
      <Popover className="button-tooltip" placement="topRight" content={t(`This button is currently disabled because ${disableReason}`)} mouseEnterDelay={1}>
        {button}
      </Popover>
    ) : button);
};

export const _PopupButtons = ({
  handleOk, handleSecondary, handleCancel, handleBack,
  loading, disableActiveActions, onPreviewClick, t = (text) => text,
  hideSecondary, disableSecondary,
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
        disabled={disableActiveActions || loading || disableSecondary}
        onClick={handleSecondary}
      >
        {t('Prepare Data')}
      </Button>, t, disableSecondary)}
      <Button id="cancel" onClick={handleCancel}>
        {t('Cancel')}
      </Button>
    </div>
  );

function mapStateToProps({ navigationTree }) {
  return { isPrompted: navigationTree.isPrompted };
}

export const PopupButtons = connect(mapStateToProps)(withTranslation('common')(_PopupButtons));
