import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@mstr/rc';

export const PrepareDataButton = ({ disableReason, handleSecondary, t }) => (
  <Tooltip content={t(`${disableReason}`)} placement="top-end">
    <Button
      id="prepare"
      onClick={handleSecondary}
      disabled={!!disableReason}
    >
      {t('Prepare Data')}
    </Button>
  </Tooltip>
);

PrepareDataButton.propTypes = {
  handleSecondary: PropTypes.func,
  t: PropTypes.func,
  disableReason: PropTypes.string,
};
