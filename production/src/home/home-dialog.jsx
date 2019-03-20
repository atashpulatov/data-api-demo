import React from 'react';

export const HomeDialog = ({show, text}) => {
  return (
    <div className="dialog-container" style={{
      display: show ? 'block' : 'none',
    }}>
      <div>{text}</div>
    </div>
  );
};
