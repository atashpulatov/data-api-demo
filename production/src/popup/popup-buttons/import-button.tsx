import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tooltip } from '@mstr/rc';

interface ImportButtonProps {
  handleOk: () => void;
  isPrimaryBtn: boolean;
  disableReason: string;
  actionType: string;
  id: string;
}

export const ImportButton: React.FC<ImportButtonProps> = ({
  disableReason,
  isPrimaryBtn,
  handleOk,
  actionType,
  id,
}) => {
  const { t } = useTranslation();
  const isDisabled = !!disableReason;

  return (
    <Tooltip content={t(`${disableReason}`)} placement='top-end'>
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
