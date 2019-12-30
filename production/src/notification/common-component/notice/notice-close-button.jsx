import React from 'react';

export const NoticeCloseButton = ({ onCloseClicked, componentClass, closeIcon }) => (
  <button
      tabIndex="0"
      aria-label="close"
      onClick={onCloseClicked}
      className={`${componentClass}-close`}>
    {closeIcon || <span className={`${componentClass}-close-x`} />}
  </button>
);
