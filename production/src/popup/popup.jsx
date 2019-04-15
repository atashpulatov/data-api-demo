import React, {Component} from 'react';
import {AttributeSelectorWindow} from '../attribute-selector/attribute-selector-window';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {NavigationTree} from '../navigation/navigation-tree';
import * as queryString from 'query-string';
import {libraryErrorController} from 'mstr-react-library';
import {officeContext} from '../office/office-context';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {reduxStore} from '../store';
import {Provider} from 'react-redux';
import {LoadingPage} from '../loading/loading-page';
import {PopupViewSelector} from './popup-view-selector';

export class Popup extends Component {
  constructor(props) {
    super(props);
    const parsed = queryString.parse(this.props.location.search);
    this.state = {
      parsed,
    };
    libraryErrorController.initializeHttpErrorsHandling(this.handlePopupErrors);
  }

  handlePrepare = (projectId, reportId, reportSubtype, reportName, reportType) => {
    this.setState({
      parsed: {
        ...this.state.parsed,
        popupType: undefined,
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
      parsed: {
        ...this.state.parsed,
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
  }

  selectView(popupType, propsToPass) {
    if (!popupType) {
      return (<AttributeSelectorWindow parsed={propsToPass} handleBack={this.handleBack} />);
    } else if (popupType === PopupTypeEnum.navigationTree) {
      return (<NavigationTree handlePrepare={this.handlePrepare} parsed={propsToPass} handlePopupErrors={this.handlePopupErrors} />);
    } else if (popupType === PopupTypeEnum.loadingPage) {
      return (<LoadingPage />);
    }
    return (<></>);
  }

  render() {
    const {popupType, ...propsToPass} = this.state.parsed;
    const methods = {
      handlePrepare: this.handlePrepare,
      handleBack: this.handleBack,
      handlePopupErrors: this.handlePopupErrors,
    };
    return (<Provider store={reduxStore}>
      <PopupViewSelector popupType={popupType} propsToPass={propsToPass} methods={methods} />
    </Provider>);
  }
}
