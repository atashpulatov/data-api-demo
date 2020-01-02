import React from 'react';
import * as queryString from 'query-string';
import {libraryErrorController} from '@mstr/mstr-react-library';
import {connect} from 'react-redux';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {officeContext} from '../office/office-context';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {PopupViewSelector} from './popup-view-selector';
import i18next from '../i18n';
import InternetConnectionError from './internet-connection-error';
import {popupStateActions} from './popup-state-actions';

/* global Office */

export const PopupNotConnected = ({location, mstrData, setMstrData, setPopupType, onPopupBack, }) => {
  React.useEffect(() => {
    const popupLocation = (location && location.search) || window.location.search;
    const mstrDataToSet = queryString.parse(popupLocation);
    console.log({location, mstrDataToSet});
    setMstrData(mstrDataToSet);
    libraryErrorController.initializeHttpErrorsHandling(handlePopupErrors);
  }, [location, setMstrData]);

  const handlePrepare = () => {
    setPopupType(PopupTypeEnum.dataPreparation);
  };

  const handleBack = () => {
    onPopupBack();
  };

  const handlePopupErrors = (error) => {
    const errorObj = error && {status: error.status, message: error.message, response: error.response, type: error.type};
    const messageObject = {
      command: selectorProperties.commandError,
      error: errorObj,
    };
    console.log(messageObject);
    return; // FIXME: disabled temporarily cloding popup on error
    officeContext 
      .getOffice()
      .context.ui.messageParent(JSON.stringify(messageObject));
  };

  const {...propsToPass} = mstrData;
  const methods = {
    handlePrepare,
    handleBack,
    handlePopupErrors,
  };
  i18next.changeLanguage(i18next.options.resources[Office.context.displayLanguage]
    ? Office.context.displayLanguage
    : 'en-US');
  return (
    <>
      <PopupViewSelector
        methods={methods}
      />
      <InternetConnectionError />
    </>
  );
};

const mapStateToProps = ({popupStateReducer}) => ({
  popupType: popupStateReducer.popupType,
  mstrData: {...popupStateReducer},
});

const mapDispatchToProps = {
  setPopupType: popupStateActions.setPopupType,
  setMstrData: popupStateActions.setMstrData,
  onPopupBack: popupStateActions.onPopupBack,
};

export const Popup = connect(mapStateToProps, mapDispatchToProps)(PopupNotConnected);
