import React from 'react';
import { Button, Tooltip } from '@mstr/rc';

import PropTypes from 'prop-types';

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
