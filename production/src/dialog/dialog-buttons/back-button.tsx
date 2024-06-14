import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button } from '@mstr/rc';

import { popupStateActions } from '../../redux-reducer/popup-state-reducer/popup-state-actions';

interface BackButtonProps {
  handleBack: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ handleBack }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onBackClick = (): void => {
    dispatch(popupStateActions.setImportType(undefined) as any);
    handleBack();
  };

  return (
    <Button id='back' onClick={onBackClick} variant='secondary'>
      {t('Back')}
    </Button>
  );
};
