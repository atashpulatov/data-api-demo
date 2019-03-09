import React from 'react';
import spinner from './assets/small_loading.gif';
import {LoadingText} from 'mstr-react-library';

// TODO: Move {LoadingText} and styles to 'mstr-react-library';

const dialogStyle = {
  position: 'fixed',
  top: '50%',
  color: '#444A50',
  transform: 'translateY(-50%) translateY(-15px)',
  border: 'none',
  textAlign: 'center',
  maxWidth: '500px',
  fontFamily: `"HelveticaNeue", "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", sans-serif`,
};

const titleStyle = {
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#444649',
  padding: '0.5em',
};

export const LoadingPage = ({title = 'Data Import'}) => {
  return (
    <dialog className='loading-page' style={dialogStyle}>
      <h1 style={titleStyle}>{title}</h1>
      <LoadingText text='Downloading data...' />
    </dialog>
  );
};
