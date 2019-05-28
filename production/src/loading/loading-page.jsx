import React from 'react';
import {connect} from 'react-redux';
import {LoadingText} from 'mstr-react-library';
import './loading-page.css';

const _LoadingPage = ({name}) => {
  const displayName = name || 'data';
  return (
    <dialog className='loading-page loading-dialog' >
      <h1 title={displayName} className='loading-title'>{`Importing ${displayName}`}</h1>
      <LoadingText text={'Please wait until the import is complete.'} />
    </dialog>
  );
};

const mapStateToProps = ({popupReducer}) => {
  return {name: popupReducer.refreshingReport};
};

export const LoadingPage = connect(mapStateToProps)(_LoadingPage);
