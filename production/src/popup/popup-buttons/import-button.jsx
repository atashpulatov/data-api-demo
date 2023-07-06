import React from 'react';

import PropTypes from 'prop-types';
import { MstrButton, StandardTooltip } from '@mstr/rc';

export const ImportButton = ({
  disableReason, handleSecondary, handleOk, t, useImportAsRunButton
}) => (
  <StandardTooltip adjustOverflow mouseEnterDelay={1} disabled={!disableReason} content={t(`${disableReason}`)} theme="dark" placement="topRight">
    <MstrButton
      id={useImportAsRunButton ? 'run' : 'import'}
      mstrType={!handleSecondary ? 'primary' : 'secondary'}
      onClick={handleOk}
      disabled={!!disableReason}
      mstrText={t(useImportAsRunButton ? 'Apply' : 'Import')}
    />
  </StandardTooltip>
);

ImportButton.propTypes = {
  handleSecondary: PropTypes.func,
  handleOk: PropTypes.func,
  t: PropTypes.func,
  disableReason: PropTypes.string,
  useImportAsRunButton: PropTypes.bool,
};
