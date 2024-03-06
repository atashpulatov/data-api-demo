import React from 'react';
import { Button } from '@mstr/rc';

import PropTypes from 'prop-types';

export const BackButton = ({ handleBack, t }) => (
  <Button id='back' onClick={handleBack} variant='secondary'>
    {t('Back')}
  </Button>
);

BackButton.propTypes = {
  handleBack: PropTypes.func,
  t: PropTypes.func,
};
