import React from 'react';
import { Button, Popover } from 'antd';

export const PrepareDataButton = ({ disableReason, loading, handleSecondary, t }) => {
  const internalButton = (
    <Button
          id="prepare"
          type="primary"
          disabled={!!disableReason || loading}
          onClick={handleSecondary}>
      {t('Prepare Data')}
    </Button>
  );

  return disableReason
    ? (
      <Popover className="button-tooltip" placement="topRight" content={t(`${disableReason}`)} mouseEnterDelay={1}>
        {internalButton}
      </Popover>
    ) : internalButton;
};
