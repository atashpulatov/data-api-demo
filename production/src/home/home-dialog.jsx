import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as InfoIcon } from './assets/icon-info.svg';

export const HomeDialog = ({ show = false, text }) => (
  show
    ? (
      <div className="dialog-container">
        <dialog open>
          <InfoIcon />
          <span>{text}</span>
        </dialog>
      </div>
    )
    : null
);

HomeDialog.propTypes = {
  show: PropTypes.bool,
  text: PropTypes.string,
};
