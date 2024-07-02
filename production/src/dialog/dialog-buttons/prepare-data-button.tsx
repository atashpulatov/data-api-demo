import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tooltip } from '@mstr/rc';

interface PrepareDataButtonProps {
  handleSecondary?: () => void;
  disableReason?: string;
}

export const PrepareDataButton: React.FC<PrepareDataButtonProps> = ({
  disableReason,
  handleSecondary,
}) => {
  const { t } = useTranslation();
  const isDisabled = !!disableReason;

  return (
    <Tooltip disabled={!isDisabled} content={t(`${disableReason}`)} placement='top-end'>
      <Button id='prepare' onClick={handleSecondary} disabled={!!disableReason}>
        {t('Prepare Data')}
      </Button>
    </Tooltip>
  );
};
