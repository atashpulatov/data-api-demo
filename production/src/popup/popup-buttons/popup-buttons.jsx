/* eslint-disable react/no-multi-comp */
import React from 'react';
import './popup-buttons.css';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NOT_PUBLISHED_CUBE, NO_DATA_SELECTED } from '../../error/constants';
import { DataPreviewButton } from './data-preview-button';
import { BackButton } from './back-button';
import { PrepareDataButton } from './prepare-data-button';
import { ImportButton } from './import-button';
import { CancelButton } from './cancel-button';

const getDisableReason = (isPublished, disableSecondary) => {
  if (isPublished) {
    if (disableSecondary) {
      return 'This option is not available for dossier';
    }
    return NO_DATA_SELECTED;
  }
  return NOT_PUBLISHED_CUBE;
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
  const disableReason = getDisableReason(isPublished, disableSecondary);
  return (
    <div className="popup-buttons popup-footer">
      {handleBack && <BackButton handleBack={handleBack} t={t} />}
      {(!hideSecondary && !handleSecondary) && (
      <DataPreviewButton
        isPublished={isPublished}
        disableSecondary={disableSecondary}
        disableActiveActions={disableActiveActions}
        onPreviewClick={onPreviewClick}
        disableReason={disableReason}
        t={t} />
      )}
      <ImportButton
        loading={loading}
        isPublished={isPublished}
        disableSecondary={disableSecondary}
        disableActiveActions={disableActiveActions}
        handleSecondary={handleSecondary}
        handleOk={handleOk}
        disableReason={disableReason}
        t={t} />
      {!hideSecondary && handleSecondary && (
      <PrepareDataButton
        isPublished={isPublished}
        disableSecondary={disableSecondary}
        disableActiveActions={disableActiveActions}
        loading={loading}
        handleSecondary={handleSecondary}
        disableReason={disableReason}
        t={t} />
      )}
      <CancelButton handleCancel={handleCancel} t={t} />
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
