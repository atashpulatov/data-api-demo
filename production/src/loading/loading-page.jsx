import React from 'react';
import spinner from './assets/small_loading.gif';

// TODO: Move {LoadingText} and styles to 'mstr-react-library';

const dialogStyle = {
  position: 'fixed',
  top: '50%',
  color: '#444A50',
  transform: 'translateY(-50%)',
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

const loadingTextStyle = {
  backgroundColor: '#fff',
  fontSize: '14px',
  textAlign: 'center',
};

const loadingImgStyle = {
  marginRight: '14px',
  verticalAlign: 'middle',
};


const LoadingText = ({text = 'Loading...'}) => {
  return (
    <div style={loadingTextStyle}>
      <img src={spinner} alt="Spinner" style={loadingImgStyle} /><span>{text}</span>
    </div>
  );
};


export const LoadingPage = ({title = 'Data Import'}) => {
  return (
    <dialog className='loading-page' style={dialogStyle}>
      <h1 style={titleStyle}>{title}</h1>
      <LoadingText text='Loading data.' />
    </dialog>
  );
};
