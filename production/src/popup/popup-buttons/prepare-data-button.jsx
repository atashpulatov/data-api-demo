import React from 'react';
import PropTypes from 'prop-types';
import { MstrButton, StandardTooltip } from '@mstr/rc';

export const PrepareDataButton = ({ disableReason, handleSecondary, t }) => (
  <StandardTooltip adjustOverflow mouseEnterDelay={1} disabled={!disableReason} content={t(`${disableReason}`)} theme="dark" placement="topRight">
    <MstrButton
      id="prepare"
      onClick={handleSecondary}
      disabled={!!disableReason}
      mstrText={t('Prepare Data')}
    />
  </StandardTooltip>
);

PrepareDataButton.propTypes = {
  handleSecondary: PropTypes.func,
  t: PropTypes.func,
  disableReason: PropTypes.string,
};
