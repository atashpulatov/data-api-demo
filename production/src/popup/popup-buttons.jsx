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
  handleOk,
  handleSecondary,
  handleCancel,
  handleBack,
  loading,
  disableActiveActions,
  onPreviewClick,
  t = (text) => text,
  hideSecondary,
  disableSecondary,
  isPublished
}) => {
  const dataPreviewButton = (
    <Button id="data-preview" tabIndex={1} onMouseDown={(e) => { e.preventDefault(); }} onClick={onPreviewClick} disabled={disableActiveActions}>
      {t('Data Preview')}
    </Button>
  );

  const backButton = (<Button id="back" tabIndex={0} onClick={handleBack}>{t('Back')}</Button>);

  const importButton = (
    <Button id="import" tabIndex={2} type={!handleSecondary ? 'primary' : ''} onClick={handleOk} loading={loading} disabled={disableActiveActions}> 
      {t('Import')}</Button>
  );

  const prepareDataButton = (
    <Button
  id="prepare"
  type="primary"
  tabIndex={3}
  disabled={disableActiveActions || loading || disableSecondary || !isPublished}
  onClick={handleSecondary}>
      {t('Prepare Data')}
    </Button>
  );

  const cancelButton = (
    <Button tabIndex={4} id="cancel" onClick={handleCancel}>
      {t('Cancel')}
    </Button>
  );

  return (
    <div className="popup-buttons popup-footer">
      {(!hideSecondary && !handleSecondary) && prepareButton(disableActiveActions, dataPreviewButton, t, isPublished)}
      {handleBack && backButton}
      {prepareButton(disableActiveActions, importButton, t, isPublished)}
      {!hideSecondary && handleSecondary && prepareButton(disableActiveActions, prepareDataButton, t, isPublished, disableSecondary)}
      {cancelButton}
    </div>
  );
};

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
