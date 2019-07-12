import React from 'react';
import {ReactComponent as InfoIcon} from './assets/icon-info.svg';

export const HomeDialog = ({show = false, text}) => {
  return (
    show ?
      <div className="dialog-container">
        <dialog>
          <InfoIcon />
          <span>{text}</span>
        </dialog>
      </div>
      : null
  );
};
