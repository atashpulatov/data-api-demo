import React from 'react';
import * as queryString from 'query-string';
import {libraryErrorController} from '@mstr/mstr-react-library';
import {connect} from 'react-redux';
import {PopupViewSelector} from './popup-view-selector';
import i18next from '../i18n';
import InternetConnectionError from './internet-connection-error';
import {popupStateActions} from './popup-state-actions';
import {popupHelper} from './popup-helper';

/* global Office */

export const PopupNotConnected = ({location, setMstrData}) => {
  React.useEffect(() => {
    const popupLocation = (location && location.search) || window.location.search;
    const mstrDataToSet = queryString.parse(popupLocation);
    setMstrData(mstrDataToSet);
    libraryErrorController.initializeHttpErrorsHandling(popupHelper.handlePopupErrors);
  }, [location, setMstrData]);

  i18next.changeLanguage(i18next.options.resources[Office.context.displayLanguage]
    ? Office.context.displayLanguage
    : 'en-US');
  return (
    <>
      <PopupViewSelector />
      <InternetConnectionError />
    </>
  );
};

const mapStateToProps = ({popupStateReducer}) => ({
  popupType: popupStateReducer.popupType,
  mstrData: {...popupStateReducer},
});

const mapDispatchToProps = {
  setMstrData: popupStateActions.setMstrData,
};

export const Popup = connect(mapStateToProps, mapDispatchToProps)(PopupNotConnected);
