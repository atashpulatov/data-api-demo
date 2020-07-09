import React from 'react';
import { Button, Popover } from 'antd';
import PropTypes from 'prop-types';

export const PrepareDataButton = ({ disableReason, handleSecondary, t }) => {
  const internalButton = (
    <Button
      id="prepare"
      type="primary"
      disabled={!!disableReason}
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

PrepareDataButton.propTypes = {
  handleSecondary: PropTypes.func,
  t: PropTypes.func,
  disableReason: PropTypes.string,
};
