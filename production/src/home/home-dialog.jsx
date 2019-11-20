import React from 'react';
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
