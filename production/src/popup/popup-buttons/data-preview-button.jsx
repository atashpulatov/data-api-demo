import React from 'react';
import { Button, Popover } from 'antd';

export const DataPreviewButton = ({ disableReason, loading, onPreviewClick, t }) => {
  const internalButton = (
    <Button id="data-preview"
            onMouseDown={(e) => { e.preventDefault(); }}
            onClick={onPreviewClick}
            disabled={!!disableReason || loading}>
      {t('Data Preview')}
    </Button>
  );
  return disableReason
    ? (
      <Popover className="button-tooltip" placement="topRight" content={t(`${disableReason}`)} mouseEnterDelay={1}>
        {internalButton}
      </Popover>
    )
    : internalButton;
};
