import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mstr/rc';

interface BackButtonProps {
  handleBack: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ handleBack }) => {
  const { t } = useTranslation();
  return (
    <Button id='back' onClick={handleBack} variant='secondary'>
    {t('Back')}
  </Button>
  );
};

