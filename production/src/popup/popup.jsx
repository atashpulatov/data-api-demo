import React, { Component } from 'react';
import * as queryString from 'query-string';
import { libraryErrorController } from '@mstr/mstr-react-library';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { officeContext } from '../office/office-context';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupViewSelector } from './popup-view-selector';
import i18next from '../i18n';
import { CLEAR_PROMPTS_ANSWERS, CANCEL_DOSSIER_OPEN } from '../navigation/navigation-tree-actions';
import { reduxStore } from '../store';

/* global Office */

export class Popup extends Component {
  constructor(props) {
    super(props);
    const location = (props.location && props.location.search) || window.location.search;
    const mstrData = queryString.parse(location);
    this.state = { mstrData, };
    libraryErrorController.initializeHttpErrorsHandling(this.handlePopupErrors);
  }

  handlePrepare = (projectId,
    reportId,
    reportSubtype,
    reportName,
    reportType) => {
    this.setState({
      mstrData: {
        ...this.state.mstrData,
        popupType: PopupTypeEnum.dataPreparation,
        forceChange: false,
        projectId,
        reportId,
        reportSubtype,
        reportName,
        reportType,
      },
    });
  };

  handleBack = (projectId, reportId, reportSubtype, forceChange = false) => {
    this.setState({
      mstrData: {
        ...this.state.mstrData,
        popupType: PopupTypeEnum.navigationTree,
        forceChange,
        projectId,
        reportId,
        reportSubtype,
      },
    },
    () => {
      reduxStore.dispatch({ type: CLEAR_PROMPTS_ANSWERS });
      reduxStore.dispatch({ type: CANCEL_DOSSIER_OPEN });
    });
  };

  handlePopupErrors = (error) => {
    const messageObject = {
      command: selectorProperties.commandError,
      error,
    };
    officeContext
      .getOffice()
      .context.ui.messageParent(JSON.stringify(messageObject));
  };

  render() {
    const { popupType, ...propsToPass } = this.state.mstrData;
    const methods = {
      handlePrepare: this.handlePrepare,
      handleBack: this.handleBack,
      handlePopupErrors: this.handlePopupErrors,
    };
    i18next.changeLanguage(i18next.options.resources[Office.context.displayLanguage]
      ? Office.context.displayLanguage
      : 'en-US');
    return (
      <PopupViewSelector
        popupType={popupType}
        propsToPass={propsToPass}
        methods={methods}
      />
    );
  }
}
