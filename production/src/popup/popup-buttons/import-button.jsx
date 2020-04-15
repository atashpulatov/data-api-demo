import React from 'react';
import { Button, Popover } from 'antd';

import PropTypes from 'prop-types';

export const ImportButton = ({
  disableReason, handleSecondary, handleOk, loading, t
}) => {
  const internalButton = (
    <Button
      id="import"
      type={!handleSecondary ? 'primary' : ''}
      onClick={handleOk}
      loading={loading}
      disabled={!!disableReason || loading}>
      {t('Import')}
    </Button>
  );

  return disableReason
    ? (
      <Popover className="button-tooltip" placement="topRight" content={t(`${disableReason}`)} mouseEnterDelay={1}>
        {internalButton}
      </Popover>
    )
    : internalButton;
};

ImportButton.propTypes = {
  handleSecondary: PropTypes.func,
  handleOk: PropTypes.func,
  t: PropTypes.func,
  loading: PropTypes.bool,
  disableReason: PropTypes.string,
};
