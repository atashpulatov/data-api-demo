import React from 'react';
import { Button, Popover } from 'antd';
import './popup-buttons.css';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NOT_PUBLISHED_CUBE } from '../error/constants';

const prepareButton = (disableActiveActions, button, t, isPublished = true, disableSecondary = false) => {
  let disableReason;
  if (isPublished) {
    if (disableSecondary) {
      disableReason = 'This option is not available for dossier';
    } else { disableReason = 'This button is currently disabled because you didn’t select any data'; }
  } else { disableReason = NOT_PUBLISHED_CUBE; }
  return ((disableActiveActions || disableSecondary || !isPublished)
    ? (
      <Popover className="button-tooltip" placement="topRight" content={t(`${disableReason}`)} mouseEnterDelay={1}>
        {button}
      </Popover>
    ) : button);
};

export const NotConnectedPopupButtons = ({
  handleOk, handleSecondary, handleCancel, handleBack,
  loading, disableActiveActions, onPreviewClick, t = (text) => text, hideSecondary, disableSecondary, isPublished
}) => (
  <div className="popup-buttons popup-footer">
    {(!hideSecondary && !handleSecondary)
        && prepareButton(disableActiveActions, <Button id="data-preview" onClick={onPreviewClick} disabled={disableActiveActions}>
          {t('Data Preview')}
        </Button>, t, isPublished)}


    {handleBack && (<Button id="back" onClick={handleBack}>{t('Back')}</Button>)}

    {prepareButton(disableActiveActions,
      <Button id="import" type={!handleSecondary ? 'primary' : ''} onClick={handleOk} loading={loading} disabled={disableActiveActions}>
        {t('Import')}</Button>, t, isPublished)}

    {!hideSecondary && handleSecondary && prepareButton(disableActiveActions, <Button
        id="prepare"
        type="primary"
        disabled={disableActiveActions || loading || disableSecondary || !isPublished}
        onClick={handleSecondary}>
      {t('Prepare Data')}
    </Button>, t, isPublished, disableSecondary)}

    <Button id="cancel" onClick={handleCancel}>
      {t('Cancel')}
    </Button>
  </div>
);

NotConnectedPopupButtons.propTypes = {
  handleOk: PropTypes.func,
  handleSecondary: PropTypes.func,
  handleCancel: PropTypes.func,
  handleBack: PropTypes.func,
  t: PropTypes.func,
  loading: PropTypes.bool,
  disableActiveActions: PropTypes.bool,
  onPreviewClick: PropTypes.func,
  hideSecondary: PropTypes.bool,
  disableSecondary: PropTypes.bool,
  isPublished: PropTypes.bool,
};


function mapStateToProps({ navigationTree }) {
  return { isPrompted: navigationTree.isPrompted };
}

export const PopupButtons = connect(mapStateToProps)(withTranslation('common')(NotConnectedPopupButtons));
