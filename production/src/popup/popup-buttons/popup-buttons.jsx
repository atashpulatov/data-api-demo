/* eslint-disable react/no-multi-comp */
import React from 'react';
import './popup-buttons.css';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import { errorMessages } from '../../error/constants';
import { DataPreviewButton } from './data-preview-button';
import { BackButton } from './back-button';
import { PrepareDataButton } from './prepare-data-button';
import { ImportButton } from './import-button';
import { CancelButton } from './cancel-button';
import { importActionTypes, importButtonIds } from './import-btn-constants';

const getDisableReason = (isPublished, disableSecondary, disableActiveActions) => {
  const disableReasonForImport = getDisableReasonImport(isPublished, disableActiveActions);
  return disableSecondary
    ? errorMessages.NOT_AVAILABLE_FOR_DOSSIER
    : disableReasonForImport;
};

const getDisableReasonImport = (isPublished, disableActiveActions, disableSecondary, checkingSelection) => {
  if (!isPublished && isPublished !== undefined) {
    if (disableSecondary) { return errorMessages.NOT_SUPPORTED_VIZ; }
    return errorMessages.NOT_PUBLISHED_CUBE;
  }
  if (disableActiveActions) {
    return errorMessages.NO_DATA_SELECTED;
  }
  if (checkingSelection !== undefined && checkingSelection) {
    return errorMessages.CHECKING_SELECTION;
  }
};

export const PopupButtonsNotConnected = ({
  handleOk,
  handleSecondary,
  handleCancel,
  handleBack,
  shouldShowImportImage,
  disableActiveActions,
  onPreviewClick,
  hideSecondary,
  disableSecondary,
  isPublished,
  checkingSelection,
  useImportAsRunButton,
  hideOk,
}) => {
  const [t] = useTranslation('common', { i18n });
  const disableReason = getDisableReason(isPublished, disableSecondary, disableActiveActions);
  const disableReasonForImport = getDisableReasonImport(
    isPublished, disableActiveActions, disableSecondary, checkingSelection
  );
  return (
    <div className="popup-buttons popup-footer">
      {handleBack && <BackButton handleBack={handleBack} t={t} />}
      {(!hideSecondary && !handleSecondary) && (
        <DataPreviewButton
          onPreviewClick={onPreviewClick}
          disableReason={disableReason}
          t={t}
        />
      )}
      {!hideOk && (
        <ImportButton
          id={useImportAsRunButton ? importButtonIds.RUN : importButtonIds.IMPORT_DATA}
          handleSecondary={handleSecondary}
          handleOk={handleOk}
          disableReason={disableReasonForImport}
          t={t}
          actionType={useImportAsRunButton ? importActionTypes.APPLY : importActionTypes.IMPORT_DATA}
        />
      )}
      {!hideSecondary
        && handleSecondary
        && (shouldShowImportImage ? (
          <ImportButton
            id={importButtonIds.IMPORT_IMAGE}
            handleOk={handleSecondary}
            disableReason={disableReasonForImport}
            t={t}
            actionType={importActionTypes.IMPORT_IMAGE}
          />
        ) : (
          <PrepareDataButton
            handleSecondary={handleSecondary}
            disableReason={disableReason}
            t={t}
          />
        ))}
      <CancelButton handleCancel={handleCancel} t={t} />
    </div>
  );
};

PopupButtonsNotConnected.propTypes = {
  handleOk: PropTypes.func,
  handleSecondary: PropTypes.func,
  shouldShowImportImage: PropTypes.bool,
  handleCancel: PropTypes.func,
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
  hideOk: PropTypes.bool,
};

function mapStateToProps({ navigationTree }) {
  return { isPrompted: navigationTree.isPrompted };
}

export const PopupButtons = connect(mapStateToProps)(PopupButtonsNotConnected);
