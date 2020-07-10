import React from 'react';
import { Button, Popover } from 'antd';

import PropTypes from 'prop-types';

export const ImportButton = ({
  disableReason, handleSecondary, handleOk, t, useImportAsRunButton
}) => {
  const internalButton = (
    <Button
      id={useImportAsRunButton ? 'run' : 'import'}
      type={!handleSecondary ? 'primary' : ''}
      onClick={handleOk}
      disabled={!!disableReason}>
      {t(useImportAsRunButton ? 'Run' : 'Import')}
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
  disableReason: PropTypes.string,
  useImportAsRunButton: PropTypes.bool,
};
