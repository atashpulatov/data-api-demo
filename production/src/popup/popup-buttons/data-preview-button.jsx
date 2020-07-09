import React from 'react';
import { Button, Popover } from 'antd';
import PropTypes from 'prop-types';

export const DataPreviewButton = ({
  disableReason, onPreviewClick, t
}) => {
  const internalButton = (
    <Button
      id="data-preview"
      onMouseDown={(e) => { e.preventDefault(); }}
      onClick={onPreviewClick}
      disabled={!!disableReason}>
      {t('Data Preview')}
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

DataPreviewButton.propTypes = {
  onPreviewClick: PropTypes.func,
  t: PropTypes.func,
  disableReason: PropTypes.string,
};
