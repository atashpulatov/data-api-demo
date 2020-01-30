import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

export const CancelButton = ({ handleCancel, t }) => (
  <Button id="cancel" onClick={handleCancel}>
    {t('Cancel')}
  </Button>
);

CancelButton.propTypes = {
  handleCancel: PropTypes.func,
  t: PropTypes.func,
};
