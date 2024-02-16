import React from 'react';

import PropTypes from 'prop-types';
import { Button, Tooltip } from '@mstr/rc';

export const ImportButton = ({
  disableReason, isPrimaryBtn, handleOk, t, actionType, id
}) => (
  <Tooltip adjustOverflow mouseEnterDelay={1} disabled={!disableReason} content={t(`${disableReason}`)} placement="top-end">
    <Button
      id={id}
      variant={isPrimaryBtn ? 'primary' : 'secondary'}
      onClick={handleOk}
      disabled={!!disableReason}
    >
      {t(actionType)}
    </Button>
  </Tooltip>
);

ImportButton.propTypes = {
  handleOk: PropTypes.func,
  isPrimaryBtn: PropTypes.bool,
  t: PropTypes.func,
  disableReason: PropTypes.string,
  actionType: PropTypes.string,
  id: PropTypes.string,
};
