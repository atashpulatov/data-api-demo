import React from 'react';

import dialogButtonHelper from './dialog-button-helper';

import { BackButton } from './back-button';
import { CancelButton } from './cancel-button';
import { DataPreviewButton } from './data-preview-button';
import { ImportButton } from './dialog-import-button/import-button';
import { PrepareDataButton } from './prepare-data-button';

import './dialog-buttons.scss';

interface DialogButtonsProps {
  handleOk?: () => void;
  handleSecondary?: () => void;
  shouldShowImportAsVisualization?: boolean;
  handleCancel?: () => void;
  handleBack?: () => void;
  disableActiveActions?: boolean;
  disablePrimaryOnFormattedDataImport?: boolean;
  onPreviewClick?: () => void;
  hideSecondary?: boolean;
  disableSecondary?: boolean;
  isPublished?: boolean;
  checkingSelection?: boolean;
  hideOk?: boolean;
  isImportReport?: boolean;
}

export const DialogButtons: React.FC<DialogButtonsProps> = ({
  handleOk,
  handleSecondary,
  handleCancel,
  handleBack,
  shouldShowImportAsVisualization,
  disableActiveActions,
  disablePrimaryOnFormattedDataImport,
  onPreviewClick,
  hideSecondary,
  disableSecondary,
  isPublished,
  checkingSelection,
  hideOk,
  isImportReport,
}) => {
  const disableReason = dialogButtonHelper.getDisableReason(
    isPublished,
    disableSecondary,
    disableActiveActions
  );

  const disableReasonForImport = dialogButtonHelper.getDisableReasonImport(
    isPublished,
    disableActiveActions,
    disablePrimaryOnFormattedDataImport,
    disableSecondary,
    checkingSelection
  );

  const shouldRenderDataPreviewButton = !hideSecondary && !handleSecondary;
  const shouldRenderPrepareDataButton =
    !hideSecondary && handleSecondary && !shouldShowImportAsVisualization;
  const shouldRenderImportButton = !hideOk;

  return (
    <div className='popup-buttons popup-footer'>
      {handleBack && <BackButton handleBack={handleBack} />}
      {shouldRenderDataPreviewButton && (
        <DataPreviewButton onPreviewClick={onPreviewClick} disableReason={disableReason} />
      )}
      {shouldRenderImportButton && (
        <ImportButton
          handleOk={handleOk}
          isPrimaryBtn={isImportReport ? !handleSecondary : true}
          disableReason={disableReasonForImport}
        />
      )}
      {shouldRenderPrepareDataButton && (
        <PrepareDataButton handleSecondary={handleSecondary} disableReason={disableReason} />
      )}
      <CancelButton handleCancel={handleCancel} />
    </div>
  );
};
