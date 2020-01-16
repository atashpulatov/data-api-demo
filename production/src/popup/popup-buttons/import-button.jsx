import React from 'react';
import { Button, Popover } from 'antd';

export const ImportButton = ({ isPublished, disableReason, disableSecondary, disableActiveActions, handleSecondary, handleOk, loading, t }) => {
  const internalButton = (
    <Button id="import" type={!handleSecondary ? 'primary' : ''} onClick={handleOk} loading={loading} disabled={disableActiveActions}>
      {t('Import')}</Button>
  );

  return ((disableActiveActions || disableSecondary || !isPublished)
    ? (
      <Popover className="button-tooltip" placement="topRight" content={t(`${disableReason}`)} mouseEnterDelay={1}>
        {internalButton}
      </Popover>
    )
    : internalButton
  );
};
