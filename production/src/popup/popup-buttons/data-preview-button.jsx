import React from 'react';
import { Button, Popover } from 'antd';

export const DataPreviewButton = ({ disableSecondary, disableReason, disableActiveActions, onPreviewClick, t }) => {
  const internalButton = (
    <Button id="data-preview" onMouseDown={(e) => { e.preventDefault(); }} onClick={onPreviewClick} disabled={disableActiveActions}>
      {t('Data Preview')}
    </Button>
  );
  return ((disableActiveActions || disableSecondary)
    ? (
      <Popover className="button-tooltip" placement="topRight" content={t(`${disableReason}`)} mouseEnterDelay={1}>
        {internalButton}
      </Popover>
    )
    : internalButton
  );
};
