import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, ButtonWithOptions, Tooltip } from '@mstr/rc';

import useGetImportButtonProps from './use-get-import-button-props';
import useGetImportOptions from './use-get-import-options';
import useGetImportType from './use-get-import-type';

import { popupStateActions } from '../../../redux-reducer/popup-state-reducer/popup-state-actions';
import { ErrorMessages } from '../../../error/constants';
import { ObjectImportType } from '../../../mstr-object/constants';

interface ImportButtonProps {
  handleOk: () => void;
  isPrimaryBtn: boolean;
  disableReason: string;
  reportPromptLayer?: number;
}

export const ImportButton: React.FC<ImportButtonProps> = ({
  disableReason,
  isPrimaryBtn,
  handleOk,
  reportPromptLayer = 0,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    // DE297462: For nested prompts in Reports, we need to check the layer # and reset the buttonClicked state
    // at 2+ to prevent the button from being disabled after the first layer. Nested prompts have no issue in
    // Dashboard View, so we can ignore that case.
    if (reportPromptLayer >= 2) {
      setButtonClicked(false);
    }
  }, [reportPromptLayer]);

  let buttonDisableReason = disableReason;
  if (buttonClicked) {
    // DE297462: Set disable reason string to 'Loading...' after initial click to provide user some feedback
    buttonDisableReason = t('Loading...');
  }

  const isNonGridVizNotSupported = buttonDisableReason === ErrorMessages.NON_GRID_VIZ_NOT_SUPPORTED;

  const isDisabled = !!buttonDisableReason;

  const supportedOptions = useGetImportOptions();
  const options = isDisabled && !isNonGridVizNotSupported ? [] : supportedOptions;
  const importType = useGetImportType(options);

  // Enable users to select valid(supported) import options(types), even if the current selected
  // import type is not supported. Indicates whether we should disable the options button
  const isOptionsBtnDisabled = isNonGridVizNotSupported ? false : isDisabled;

  const { shouldDisplayOptions, importButtonProps } = useGetImportButtonProps(
    importType,
    options,
    isOptionsBtnDisabled
  );

  const handleOptionChange = (type: ObjectImportType): void => {
    dispatch(popupStateActions.setImportType(type) as any);
  };

  // DE297462: To prevent duplicate/spammed import requests, set buttonClicked to true
  // which will then disable the import button after the first click.
  const handleOkAndDisableImportButton = (): void => {
    setButtonClicked(true);
    handleOk();
  };

  if (shouldDisplayOptions) {
    return (
      <Tooltip disabled={!isDisabled} content={t(`${buttonDisableReason}`)} placement='top-end'>
        <ButtonWithOptions
          options={options}
          onClick={handleOkAndDisableImportButton}
          selectedValue={importType}
          onOptionChange={handleOptionChange}
          variant={isPrimaryBtn ? 'primary' : 'secondary'}
          disabledActionButton={isDisabled}
          disabledDropdownButton={isOptionsBtnDisabled}
          className='import-button'
          popoverPlacement='bottom-end'
        >
          {t(importButtonProps.actionType)}
        </ButtonWithOptions>
      </Tooltip>
    );
  }

  return (
    <Tooltip disabled={!isDisabled} content={t(`${buttonDisableReason}`)} placement='top-end'>
      <Button
        id={importButtonProps.id}
        variant={isPrimaryBtn ? 'primary' : 'secondary'}
        onClick={handleOkAndDisableImportButton}
        disabled={isDisabled}
      >
        {t(importButtonProps.actionType)}
      </Button>
    </Tooltip>
  );
};
