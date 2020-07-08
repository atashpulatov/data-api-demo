/* eslint-disable react/no-multi-comp */
import React from 'react';
import './popup-buttons.css';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  NOT_PUBLISHED_CUBE, NO_DATA_SELECTED, NOT_SUPPORTED_VIZ, NOT_AVAILABLE_FOR_DOSSIER, CHECKING_SELECTION
} from '../../error/constants';
import { DataPreviewButton } from './data-preview-button';
import { BackButton } from './back-button';
import { PrepareDataButton } from './prepare-data-button';
import { ImportButton } from './import-button';
import { CancelButton } from './cancel-button';

const getDisableReason = (isPublished, disableSecondary, disableActiveActions) => {
  const disableReasonForImport = getDisableReasonImport(isPublished, disableActiveActions);
  return disableSecondary
    ? NOT_AVAILABLE_FOR_DOSSIER
    : disableReasonForImport;
};

const getDisableReasonImport = (isPublished, disableActiveActions, disableSecondary, checkingSelection) => {
  if (!isPublished && isPublished !== undefined) {
    if (disableSecondary) { return NOT_SUPPORTED_VIZ; }
    return NOT_PUBLISHED_CUBE;
  }
  if (disableActiveActions) {
    return NO_DATA_SELECTED;
  }
  if (checkingSelection !== undefined && checkingSelection) {
    return CHECKING_SELECTION;
  }
};

export const PopupButtonsNotConnected = ({
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
  isPublished,
  checkingSelection,
  useImportAsRunButton
}) => {
  const disableReason = getDisableReason(isPublished, disableSecondary, disableActiveActions);
  const disableReasonForImport = getDisableReasonImport(
    isPublished, disableActiveActions, disableSecondary, checkingSelection
  );
  return (
    <div className="popup-buttons popup-footer">
      {handleBack && <BackButton handleBack={handleBack} t={t} />}
      {(!hideSecondary && !handleSecondary) && (
        <DataPreviewButton
          loading={loading}
          onPreviewClick={onPreviewClick}
          disableReason={disableReason}
          t={t} />
      )}
      <ImportButton
        loading={loading}
        handleSecondary={handleSecondary}
        handleOk={handleOk}
        disableReason={disableReasonForImport}
        t={t}
        useImportAsRunButton={useImportAsRunButton}
      />
      {!hideSecondary && handleSecondary && (
        <PrepareDataButton
          loading={loading}
          handleSecondary={handleSecondary}
          disableReason={disableReason}
          t={t} />
      )}
      <CancelButton handleCancel={handleCancel} t={t} />
    </div>
  );
};

PopupButtonsNotConnected.propTypes = {
  handleOk: PropTypes.func,
  handleSecondary: PropTypes.func,
  handleCancel: PropTypes.func,
  t: PropTypes.func,
  loading: PropTypes.bool,
  handleBack: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ]),
  disableActiveActions: PropTypes.bool,
  onPreviewClick: PropTypes.func,
  hideSecondary: PropTypes.bool,
  disableSecondary: PropTypes.bool,
  isPublished: PropTypes.bool,
  checkingSelection: PropTypes.bool,
  useImportAsRunButton: PropTypes.bool,
};

function mapStateToProps({ navigationTree }) {
  return { isPrompted: navigationTree.isPrompted };
}

export const PopupButtons = connect(mapStateToProps)(withTranslation('common')(PopupButtonsNotConnected));
