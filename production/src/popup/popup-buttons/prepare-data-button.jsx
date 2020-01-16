import React from 'react';
import { Button, Popover } from 'antd';

export const PrepareDataButton = ({ isPublished, disableReason, disableSecondary, disableActiveActions, handleSecondary, t }) => {
  const internalButton = (
    <Button
          id="prepare"
          type="primary"
          disabled
          onClick={handleSecondary}>
      {t('Prepare Data')}
    </Button>
  );

  return ((disableActiveActions || disableSecondary || !isPublished)
    ? (
      <Popover className="button-tooltip" placement="topRight" content={t(`${disableReason}`)} mouseEnterDelay={1}>
        {internalButton}
      </Popover>
    ) : internalButton
  );
};
