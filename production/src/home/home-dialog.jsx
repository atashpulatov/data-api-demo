import React from 'react';

export const HomeDialog = ({show = false, text}) => {
  return (
    show ?
      <div className="dialog-container">
        <div>{text}</div>
      </div>
      : null
  );
};
