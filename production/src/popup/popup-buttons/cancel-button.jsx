import React from 'react';
import PropTypes from 'prop-types';
import { MstrButton } from '@mstr/rc';

export const CancelButton = ({ handleCancel, t }) => (
  <MstrButton id="cancel" onClick={handleCancel} mstrText={t('Cancel')} mstrType="secondary" />
);

CancelButton.propTypes = {
  handleCancel: PropTypes.func,
  t: PropTypes.func,
};
