import React from 'react';
import { connect } from 'react-redux';

import dialogButtonHelper from './dialog-button-helper';

import { BackButton } from './back-button';
import { CancelButton } from './cancel-button';
import { DataPreviewButton } from './data-preview-button';
import { ImportButton } from './import-button';
import { PrepareDataButton } from './prepare-data-button';
import { ObjectImportType } from '../../mstr-object/constants';
import { ImportActionTypes, ImportButtonIds } from './import-btn-constants';

import './popup-buttons.css';

interface PopupButtonsProps {
  handleOk?: () => void;
  handleSecondary?: () => void;
  shouldShowImportImage?: boolean;
  handleCancel?: () => void;
  handleBack?: () => void;
  primaryImportType?: string;
  disableActiveActions?: boolean;
  onPreviewClick?: () => void;
  hideSecondary?: boolean;
  disableSecondary?: boolean;
  isPublished?: boolean;
  checkingSelection?: boolean;
  useImportAsRunButton?: boolean;
  hideOk?: boolean;
  isImportReport?: boolean;
  primaryImportBtnString?: string;
  primaryImportBtnId?: string;
}

export const PopupButtonsNotConnected: React.FC<PopupButtonsProps> = ({
  handleOk,
  handleSecondary,
  handleCancel,
  handleBack,
  shouldShowImportImage,
  primaryImportType = ObjectImportType.TABLE,
  disableActiveActions,
  onPreviewClick,
  hideSecondary,
  disableSecondary,
  isPublished,
  checkingSelection,
  useImportAsRunButton,
  hideOk,
  isImportReport,
  primaryImportBtnId = ImportButtonIds.IMPORT_DATA,
  primaryImportBtnString = ImportActionTypes.IMPORT_DATA,
}) => {
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

  return (
    <div className='popup-buttons popup-footer'>
      {handleBack && <BackButton handleBack={handleBack} />}
      {!hideSecondary && !handleSecondary && (
        <DataPreviewButton onPreviewClick={onPreviewClick} disableReason={disableReason} />
      )}
      {!hideOk &&
        (primaryImportType === ObjectImportType.TABLE ? (
          <ImportButton
            id={useImportAsRunButton ? ImportButtonIds.RUN : primaryImportBtnId}
            handleOk={handleOk}
            isPrimaryBtn={isImportReport ? !handleSecondary : true}
            disableReason={disableReasonForImport}
            actionType={useImportAsRunButton ? ImportActionTypes.APPLY : primaryImportBtnString}
          />
        ) : (
          <ImportButton
            id={useImportAsRunButton ? ImportButtonIds.RUN : ImportButtonIds.IMPORT_IMAGE}
            handleOk={handleSecondary}
            isPrimaryBtn
            disableReason={disableReasonForImport}
            actionType={
              useImportAsRunButton ? ImportActionTypes.APPLY : ImportActionTypes.IMPORT_IMAGE
            }
          />
        ))}
      {!hideSecondary &&
        handleSecondary &&
        (shouldShowImportImage ? (
          <ImportButton
            id={ImportButtonIds.IMPORT_IMAGE}
            handleOk={handleSecondary}
            isPrimaryBtn={false}
            disableReason={disableReasonForImport}
            actionType={ImportActionTypes.IMPORT_IMAGE}
          />
        ) : (
          <PrepareDataButton handleSecondary={handleSecondary} disableReason={disableReason} />
        ))}
      <CancelButton handleCancel={handleCancel} />
    </div>
  );
};

function mapStateToProps({ navigationTree }: { navigationTree: any }): { isPrompted: boolean } {
  return { isPrompted: navigationTree.isPrompted };
}

export const PopupButtons = connect(mapStateToProps)(PopupButtonsNotConnected);
