import React from 'react';
import PropTypes from 'prop-types';
import { MstrButton, StandardTooltip } from '@mstr/rc';

export const DataPreviewButton = ({ disableReason, onPreviewClick, t }) => (
  <StandardTooltip adjustOverflow mouseEnterDelay={1} disabled={!disableReason} content={t(`${disableReason}`)} theme="dark" placement="topRight">
    <MstrButton
      id="data-preview"
      onMouseDown={(e) => { e.preventDefault(); }}
      onClick={onPreviewClick}
      disabled={!!disableReason}
      mstrText={t('Data Preview')}
      mstrType="secondary"
    />
  </StandardTooltip>
);

DataPreviewButton.propTypes = {
  onPreviewClick: PropTypes.func,
  t: PropTypes.func,
  disableReason: PropTypes.string,
};
