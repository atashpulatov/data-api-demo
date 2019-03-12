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

const _LoadingPage = ({title = 'Data Import'}) => {
  return (
    <dialog className='loading-page' style={dialogStyle}>
      <h1 style={titleStyle}>{title}</h1>
      <LoadingText text={'Downloading data...'} />
    </dialog>
  );
};

const mapStateToProps = (state) => {
  // TODO: Add objectName. It doesn't work for now for some reason
  // const object = state.officeReducer.preLoadReport;
  // return {title: !!object ? object.name : undefined};
  return {};
};

export const LoadingPage = connect(mapStateToProps)(_LoadingPage);
