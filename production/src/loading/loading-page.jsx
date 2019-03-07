import React, {Component} from 'react';
import {LoadingText} from 'mstr-react-library';

const dialogStyle = {
  position: 'fixed',
  top: '50%',
  transform: 'translateY(-50%)',
};

const titleStyle = {

};

export const LoadingPage = ({title}) => {
  return (
    <dialog className='loading-page' style={dialogStyle}>
      <h1 style={titleStyle}>{title}</h1>
      <LoadingText text='Loading data.' />
    </dialog>
  );
};
