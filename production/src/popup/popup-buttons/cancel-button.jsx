import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mstr/rc';

export const CancelButton = ({ handleCancel, t }) => (
  <Button id="cancel" onClick={handleCancel} variant="secondary">
    {t('Cancel')}
  </Button>
);

CancelButton.propTypes = {
  handleCancel: PropTypes.func,
  t: PropTypes.func,
};
