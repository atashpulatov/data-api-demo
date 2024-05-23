import React from 'react';
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
}

export const ImportButton: React.FC<ImportButtonProps> = ({
  disableReason,
  isPrimaryBtn,
  handleOk,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isNonGridVizNotSupported = disableReason === ErrorMessages.NON_GRID_VIZ_NOT_SUPPORTED;

  const isDisabled = !!disableReason;

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

  if (shouldDisplayOptions) {
    return (
      <Tooltip disabled={!isDisabled} content={t(`${disableReason}`)} placement='top-end'>
        <ButtonWithOptions
          options={options}
          onClick={handleOk}
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
    <Tooltip disabled={!isDisabled} content={t(`${disableReason}`)} placement='top-end'>
      <Button
        id={importButtonProps.id}
        variant={isPrimaryBtn ? 'primary' : 'secondary'}
        onClick={handleOk}
        disabled={isDisabled}
      >
        {t(importButtonProps.actionType)}
      </Button>
    </Tooltip>
  );
};
