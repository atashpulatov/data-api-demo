import React from 'react';
import { useSelector } from 'react-redux';

import dialogButtonHelper from './dialog-button-helper';

import { selectIsImportAsPivotTableSupported } from '../../redux-reducer/office-reducer/office-reducer-selectors';
import { selectImportType } from '../../redux-reducer/popup-state-reducer/popup-state-reducer-selectors';
import { BackButton } from './back-button';
import { CancelButton } from './cancel-button';
import { DataPreviewButton } from './data-preview-button';
import { ImportButton } from './import-button';
import { PrepareDataButton } from './prepare-data-button';

import './popup-buttons.scss';

interface PopupButtonsProps {
  handleOk?: () => void;
  handleSecondary?: () => void;
  shouldShowImportAsVisualization?: boolean;
  handleCancel?: () => void;
  handleBack?: () => void;
  disableActiveActions?: boolean;
  onPreviewClick?: () => void;
  hideSecondary?: boolean;
  disableSecondary?: boolean;
  isPublished?: boolean;
  checkingSelection?: boolean;
  isEdit?: boolean;
  useImportAsRunButton?: boolean;
  hideOk?: boolean;
  isImportReport?: boolean;
}

export const PopupButtons: React.FC<PopupButtonsProps> = ({
  handleOk: handleOkProp,
  handleSecondary,
  handleCancel,
  handleBack,
  shouldShowImportAsVisualization,
  disableActiveActions,
  onPreviewClick,
  hideSecondary,
  disableSecondary,
  isPublished,
  isEdit = false,
  checkingSelection,
  useImportAsRunButton,
  hideOk,
  isImportReport,
}) => {
  const importAsPivotTable = useSelector(selectIsImportAsPivotTableSupported);
  const importType = useSelector(selectImportType);

  const disableReason = dialogButtonHelper.getDisableReason(
    isPublished,
    disableSecondary,
    disableActiveActions
  );
  const disableReasonForImport = dialogButtonHelper.getDisableReasonImport(
    isPublished,
    disableActiveActions,
    disableSecondary,
    checkingSelection
  );
  const { id, actionType, handleOk } = dialogButtonHelper.getImportButtonProps(
    useImportAsRunButton,
    importType,
    handleOkProp,
    handleSecondary
  );
  const shouldRenderDataPreviewButton = !hideSecondary && !handleSecondary;
  const shouldRenderPrepareDataButton =
    !hideSecondary && handleSecondary && !shouldShowImportAsVisualization;
  const shouldRenderImportButton = !hideOk;

  /**
   * Render ButtonWithOptions and show import as pivot table option if the feature flag is enabled and:
   * a) selected object is a Report / Cube / Dataset and is loaded (Library screen)
   * b) or import as viz option is available (Dossier screen) [TODO: Update to also check if the selected viz type is supported]
   * c) or data preview button is shown (Prepare Data screen)
   */
  const shouldShowImportAsPivotTable =
    importAsPivotTable &&
    (isImportReport || shouldShowImportAsVisualization || shouldRenderDataPreviewButton);

  return (
    <div className='popup-buttons popup-footer'>
      {handleBack && <BackButton handleBack={handleBack} />}
      {shouldRenderDataPreviewButton && (
        <DataPreviewButton onPreviewClick={onPreviewClick} disableReason={disableReason} />
      )}
      {shouldRenderImportButton && (
        <ImportButton
          id={id}
          handleOk={handleOk}
          isPrimaryBtn={isImportReport ? !handleSecondary : true}
          disableReason={disableReasonForImport}
          actionType={actionType}
          showImportAsPivotTable={shouldShowImportAsPivotTable}
          showImportAsVisualization={shouldShowImportAsVisualization}
          isEdit={isEdit}
        />
      )}
      {shouldRenderPrepareDataButton && (
        <PrepareDataButton handleSecondary={handleSecondary} disableReason={disableReason} />
      )}
      <CancelButton handleCancel={handleCancel} />
    </div>
  );
};
