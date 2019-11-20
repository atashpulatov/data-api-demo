import React from 'react';
import { connect } from 'react-redux';
import { LoadingText } from '@mstr/mstr-react-library';
import './loading-page.css';
import { withTranslation } from 'react-i18next';

const _LoadingPage = ({ name, t = (text) => text }) => {
  const displayName = name || t('data');
  return (
    <dialog className='loading-page loading-dialog'>
      <h1 title={displayName} className='loading-title'>{`${t('Importing')} ${displayName}`}</h1>
      <LoadingText text={t('Please wait until the import is complete.')} />
    </dialog>
  );
};

const mapStateToProps = ({ popupReducer }) => ({ name: popupReducer.refreshingReport });

export const LoadingPage = connect(mapStateToProps)(withTranslation('common')(_LoadingPage));
