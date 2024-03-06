/* eslint-disable react/no-multi-comp */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import i18n from '../../i18n';
import { BackButton } from './back-button';
import { CancelButton } from './cancel-button';
import { DataPreviewButton } from './data-preview-button';
import { ImportButton } from './import-button';
import { PrepareDataButton } from './prepare-data-button';
import { errorMessages } from '../../error/constants';
import { objectImportType } from '../../mstr-object/constants';
import { importActionTypes, importButtonIds } from './import-btn-constants';

import './popup-buttons.css';

const getDisableReasonImport = (
  isPublished,
  disableActiveActions,
  disableSecondary,
  checkingSelection
) => {
  if (!isPublished && isPublished !== undefined) {
    if (disableSecondary) {
      return errorMessages.NOT_SUPPORTED_VIZ;
    }
    return errorMessages.NOT_PUBLISHED_CUBE;
  }
  if (disableActiveActions) {
    return errorMessages.NO_DATA_SELECTED;
  }
  if (checkingSelection !== undefined && checkingSelection) {
    return errorMessages.CHECKING_SELECTION;
  }
};

const getDisableReason = (isPublished, disableSecondary, disableActiveActions) => {
  const disableReasonForImport = getDisableReasonImport(isPublished, disableActiveActions);
  return disableSecondary ? errorMessages.NOT_AVAILABLE_FOR_DOSSIER : disableReasonForImport;
};

export const PopupButtonsNotConnected = ({
  handleOk,
  handleSecondary,
  handleCancel,
  handleBack,
  shouldShowImportImage,
  primaryImportType = objectImportType.TABLE,
  disableActiveActions,
  onPreviewClick,
  hideSecondary,
  disableSecondary,
  isPublished,
  checkingSelection,
  useImportAsRunButton,
  hideOk,
  isImportReport,
  primaryImportBtnId = importButtonIds.IMPORT_DATA,
  primaryImportBtnString = importActionTypes.IMPORT_DATA,
}) => {
  const [t] = useTranslation('common', { i18n });
  const disableReason = getDisableReason(isPublished, disableSecondary, disableActiveActions);
  const disableReasonForImport = getDisableReasonImport(
    isPublished,
    disableActiveActions,
    disableSecondary,
    checkingSelection
  );

  return (
    <div className='popup-buttons popup-footer'>
      {handleBack && <BackButton handleBack={handleBack} t={t} />}
      {!hideSecondary && !handleSecondary && (
        <DataPreviewButton onPreviewClick={onPreviewClick} disableReason={disableReason} t={t} />
      )}
      {!hideOk &&
        (primaryImportType === objectImportType.TABLE ? (
          <ImportButton
            id={useImportAsRunButton ? importButtonIds.RUN : primaryImportBtnId}
            handleOk={handleOk}
            isPrimaryBtn={isImportReport ? !handleSecondary : true}
            disableReason={disableReasonForImport}
            actionType={useImportAsRunButton ? importActionTypes.APPLY : primaryImportBtnString}
          />
        ) : (
          <ImportButton
            id={useImportAsRunButton ? importButtonIds.RUN : importButtonIds.IMPORT_IMAGE}
            handleOk={handleSecondary}
            isPrimaryBtn
            disableReason={disableReasonForImport}
            actionType={
              useImportAsRunButton ? importActionTypes.APPLY : importActionTypes.IMPORT_IMAGE
            }
          />
        ))}
      {!hideSecondary &&
        handleSecondary &&
        (shouldShowImportImage ? (
          <ImportButton
            id={importButtonIds.IMPORT_IMAGE}
            handleOk={handleSecondary}
            isPrimaryBtn={false}
            disableReason={disableReasonForImport}
            actionType={importActionTypes.IMPORT_IMAGE}
          />
        ) : (
          <PrepareDataButton handleSecondary={handleSecondary} disableReason={disableReason} />
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
  handleBack: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  primaryImportType: PropTypes.string,
  disableActiveActions: PropTypes.bool,
  onPreviewClick: PropTypes.func,
  hideSecondary: PropTypes.bool,
  disableSecondary: PropTypes.bool,
  isPublished: PropTypes.bool,
  checkingSelection: PropTypes.bool,
  useImportAsRunButton: PropTypes.bool,
  hideOk: PropTypes.bool,
  isImportReport: PropTypes.bool,
  primaryImportBtnString: PropTypes.string,
  primaryImportBtnId: PropTypes.string,
};

function mapStateToProps({ navigationTree }) {
  return { isPrompted: navigationTree.isPrompted };
}

export const PopupButtons = connect(mapStateToProps)(PopupButtonsNotConnected);
