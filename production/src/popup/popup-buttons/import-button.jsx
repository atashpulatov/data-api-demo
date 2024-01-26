import React from 'react';

import PropTypes from 'prop-types';
import { MstrButton, StandardTooltip } from '@mstr/rc';

export const ImportButton = ({
  disableReason, isPrimaryBtn, handleOk, t, actionType, id
}) => (
  <StandardTooltip adjustOverflow mouseEnterDelay={1} disabled={!disableReason} content={t(`${disableReason}`)} theme="dark" placement="topRight">
    <MstrButton
      id={id}
      mstrType={isPrimaryBtn ? 'primary' : 'secondary'}
      onClick={handleOk}
      disabled={!!disableReason}
      mstrText={t(actionType)}
    />
  </StandardTooltip>
);

ImportButton.propTypes = {
  handleOk: PropTypes.func,
  isPrimaryBtn: PropTypes.bool,
  t: PropTypes.func,
  disableReason: PropTypes.string,
  actionType: PropTypes.string,
  id: PropTypes.string,
};
