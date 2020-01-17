import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

export const BackButton = ({ handleBack, t }) => (<Button id="back" onClick={handleBack}>{t('Back')}</Button>);

BackButton.propTypes = {
  handleBack: PropTypes.func,
  t: PropTypes.func,
};
