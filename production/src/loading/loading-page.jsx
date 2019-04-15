import React from 'react';
import {connect} from 'react-redux';
import {LoadingText} from 'mstr-react-library';

const dialogStyle = {
  position: 'fixed',
  top: '50%',
  color: '#444A50',
  transform: 'translateY(-50%) translateY(-15px)',
  border: 'none',
  textAlign: 'center',
  fontFamily: `"HelveticaNeue", "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", sans-serif`,
  width: '100%',
};


const titleStyle = {
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#444649',
  padding: '0.5em',
};

const _LoadingPage = ({name}) => {
  const displayName = name || 'data';
  return (
    <dialog className='loading-page' style={dialogStyle}>
      <h1 style={titleStyle}>{`Importing ${displayName}`}</h1>
      <LoadingText text={`Please wait until the import is complete.`} />
    </dialog>
  );
};

const mapStateToProps = (state) => {
  return {name: state.popupReducer.refreshingReport};
};

export const LoadingPage = connect(mapStateToProps)(_LoadingPage);
