import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mstr/rc';

interface CancelButtonProps {
  handleCancel: () => void;
}

export const CancelButton: React.FC<CancelButtonProps> = ({ handleCancel }) => {
  const { t } = useTranslation();
  return (
    <Button id='cancel' onClick={handleCancel} variant='secondary'>
      {t('Cancel')}
    </Button>
  );
};
