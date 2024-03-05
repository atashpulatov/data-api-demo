import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@mstr/rc';

export const DataPreviewButton = ({ disableReason, onPreviewClick, t }) => (
  <Tooltip adjustOverflow mouseEnterDelay={1} disabled={!disableReason} content={t(`${disableReason}`)} theme="dark" placement="topRight">
    <Button
      id="data-preview"
      onMouseDown={(e) => { e.preventDefault(); }}
      onClick={onPreviewClick}
      disabled={!!disableReason}
    >
      {t('Data Preview')}
    </Button>

  </Tooltip>
);

DataPreviewButton.propTypes = {
  onPreviewClick: PropTypes.func,
  t: PropTypes.func,
  disableReason: PropTypes.string,
};
