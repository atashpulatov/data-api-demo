import React from 'react';
import { Button } from '@mstr/rc';

import PropTypes from 'prop-types';

export const CancelButton = ({ handleCancel, t }) => (
  <Button id='cancel' onClick={handleCancel} variant='secondary'>
    {t('Cancel')}
  </Button>
);

CancelButton.propTypes = {
  handleCancel: PropTypes.func,
  t: PropTypes.func,
};
