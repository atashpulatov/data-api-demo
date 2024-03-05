import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mstr/rc';

export const BackButton = ({ handleBack, t }) => (
  <Button id="back" onClick={handleBack} variant="secondary">
    {t('Back')}
  </Button>
);

BackButton.propTypes = {
  handleBack: PropTypes.func,
  t: PropTypes.func,
};
