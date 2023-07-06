import React from 'react';
import PropTypes from 'prop-types';
import { MstrButton } from '@mstr/rc';

export const BackButton = ({ handleBack, t }) => (<MstrButton mstrText={t('Back')} id="back" onClick={handleBack} mstrType="secondary" />);

BackButton.propTypes = {
  handleBack: PropTypes.func,
  t: PropTypes.func,
};
