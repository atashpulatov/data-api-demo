import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonWithOptions, Tooltip } from '@mstr/rc';

import useGetImportButtonProps from './use-get-import-button-props';
import useGetImportOptions from './use-get-import-options';

import { popupStateActions } from '../../../redux-reducer/popup-state-reducer/popup-state-actions';
import { popupStateSelectors } from '../../../redux-reducer/popup-state-reducer/popup-state-reducer-selectors';
import { settingsReducerSelectors } from '../../../redux-reducer/settings-reducer/settings-reducer-selectors';
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

  const defaultImportType = useSelector(settingsReducerSelectors.selectImportType);
  const selectedImportType = useSelector(popupStateSelectors.selectImportType);

  const isDisabled = !!disableReason;
  const importType = selectedImportType || defaultImportType;

  const options = useGetImportOptions();
  const { shouldDisplayOptions, importButtonProps } = useGetImportButtonProps(importType, options);

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
          disabledDropdownButton={isDisabled}
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
