import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tooltip } from '@mstr/rc';

interface DataPreviewButtonProps {
  onPreviewClick?: () => void;
  disableReason?: string;
}

export const DataPreviewButton: React.FC<DataPreviewButtonProps> = ({
  disableReason,
  onPreviewClick,
}) => {
  const { t } = useTranslation();
  return (
    <Tooltip disabled={!disableReason} content={t(`${disableReason}`)} placement='top-end'>
      <Button
        id='data-preview'
        onMouseDown={e => {
          e.preventDefault();
        }}
        onClick={onPreviewClick}
        disabled={!!disableReason}
        variant='secondary'
      >
        {t('Data Preview')}
      </Button>
    </Tooltip>
  );
};
