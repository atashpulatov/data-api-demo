import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonWithOptions, Tooltip } from '@mstr/rc';

import dialogButtonHelper from './dialog-button-helper';

import { popupStateActions } from '../../redux-reducer/popup-state-reducer/popup-state-actions';
import { selectImportType } from '../../redux-reducer/popup-state-reducer/popup-state-reducer-selectors';
import { ObjectImportType } from '../../mstr-object/constants';

interface ImportButtonProps {
  handleOk: () => void;
  isPrimaryBtn: boolean;
  disableReason: string;
  actionType: string;
  id: string;
  showImportAsPivotTable?: boolean;
  showImportAsVisualization?: boolean;
  isEdit?: boolean;
}

export const ImportButton: React.FC<ImportButtonProps> = ({
  disableReason,
  isPrimaryBtn,
  handleOk,
  actionType,
  id,
  showImportAsPivotTable = false,
  showImportAsVisualization = false,
  isEdit = false,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const importType = useSelector(selectImportType);

  const isDisabled = !!disableReason;

  // Display ButtonWithOptions only when import as pivot table or visualization is available
  if (showImportAsPivotTable || showImportAsVisualization) {
    const handleOptionChange = (type: ObjectImportType): void => {
      dispatch(popupStateActions.setImportType(type) as any);
    };

    const options = dialogButtonHelper.getImportButtonOptions(
      showImportAsPivotTable,
      showImportAsVisualization,
      importType,
      isEdit
    );

    const isImportTypeInOptions = (type: ObjectImportType): boolean =>
      options.some(option => option.key === type);

    // TODO: Replace ObjectImportType.TABLE with default import type from Settings
    if (!isImportTypeInOptions(importType)) {
      dispatch(popupStateActions.setImportType(ObjectImportType.TABLE) as any);
    }

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
          {t('Import')}
        </ButtonWithOptions>
      </Tooltip>
    );
  }

  return (
    <Tooltip disabled={!isDisabled} content={t(`${disableReason}`)} placement='top-end'>
      <Button
        id={id}
        variant={isPrimaryBtn ? 'primary' : 'secondary'}
        onClick={handleOk}
        disabled={isDisabled}
      >
        {t(actionType)}
      </Button>
    </Tooltip>
  );
};
