import React, {Component} from 'react';
import {PopupTypeEnum} from '../home/popup-type-enum';
import * as queryString from 'query-string';
import {libraryErrorController} from 'mstr-react-library';
import {officeContext} from '../office/office-context';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {reduxStore} from '../store';
import {Provider} from 'react-redux';
import {PopupViewSelector} from './popup-view-selector';
import i18next from '../i18n';

export class Popup extends Component {
  constructor(props) {
    super(props);
    const mstrData = queryString.parse(this.props.location.search);
    this.state = {
      mstrData,
    };
    libraryErrorController.initializeHttpErrorsHandling(this.handlePopupErrors);
  }

  handlePrepare = (projectId, reportId, reportSubtype, reportName, reportType) => {
    this.setState({
      mstrData: {
        ...this.state.mstrData,
        popupType: PopupTypeEnum.dataPreparation,
        projectId,
        reportId,
        reportSubtype,
        reportName,
        reportType,
      },
    });
  };

  handleReprompt = (projectId, reportId, reportSubtype, reportName, reportType) => {
    this.setState({
      mstrData: {
        ...this.state.mstrData,
        popupType: PopupTypeEnum.dataPreparation,
        projectId,
        reportId,
        reportSubtype,
        reportName,
        reportType,
      },
    });
  };

  handleBack = (projectId, reportId, reportSubtype) => {
    this.setState({
      mstrData: {
        ...this.state.mstrData,
        popupType: PopupTypeEnum.navigationTree,
        projectId,
        reportId,
        reportSubtype,
      },
    });
  };

  handlePopupErrors = (error) => {
    const messageObject = {
      command: selectorProperties.commandError,
      error,
    };
    officeContext.getOffice().context.ui.messageParent(JSON.stringify(messageObject));
  };

  render() {
    const {popupType, ...propsToPass} = this.state.mstrData;
    const methods = {
      handlePrepare: this.handlePrepare,
      // handleReprompt: this.handleReprompt,
      handleBack: this.handleBack,
      handlePopupErrors: this.handlePopupErrors,
    };
    i18next.changeLanguage(Office.context.displayLanguage);
    return (<Provider store={reduxStore}>
      <PopupViewSelector popupType={popupType} propsToPass={propsToPass} methods={methods} />
    </Provider>);
  }
}
