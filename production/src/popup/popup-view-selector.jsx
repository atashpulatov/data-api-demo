import React from 'react';
import {connect} from 'react-redux';
import {actions} from '../navigation/navigation-tree-actions';
import {AttributeSelectorWindow} from '../attribute-selector/attribute-selector-window';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {NavigationTree} from '../navigation/navigation-tree';
import {LoadingPage} from '../loading/loading-page';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {PromptsWindow} from '../prompts/prompts-window';
import {RefreshAllPage} from '../loading/refresh-all-page';

export const _PopupViewSelector = (props) => {
  let popupType = props.popupType;
  const {propsToPass, methods, importRequested} = props;
  if (importRequested) {
    if (!props.isPrompted) {
      proceedToImport(props);
    } else if (!!props.dossierData && !!props.dossierData.instanceId) {
      proceedToImport(props);
    } else {
      popupType = PopupTypeEnum.promptsWindow;
      propsToPass.projectId = props.chosenProjectId;
      propsToPass.reportId = props.chosenObjectId;
    }
  }
  !!props.authToken && (propsToPass.token = props.authToken);
  return renderProperComponent(popupType, methods, propsToPass);
};

function renderProperComponent(popupType, methods, propsToPass) {
  if (!popupType) {
    return <AttributeSelectorWindow parsed={propsToPass} handleBack={methods.handleBack} />;
  }
  if (popupType === PopupTypeEnum.navigationTree) {
    return <NavigationTree handlePrepare={methods.handlePrepare} parsed={propsToPass} handlePopupErrors={methods.handlePopupErrors} />;
  }
  if (popupType === PopupTypeEnum.loadingPage) {
    return <LoadingPage />;
  }
  if (popupType === PopupTypeEnum.refreshAllPage) {
    return <RefreshAllPage />;
  }
  if (popupType === PopupTypeEnum.promptsWindow) {
    return <PromptsWindow parsed={propsToPass} />;
  }
  // TODO: do some error handling here
  return null;
}

function proceedToImport(props) {
  const okObject = {
    command: selectorProperties.commandOk,
    chosenObject: props.chosenObjectId,
    chosenProject: props.chosenProjectId,
    chosenSubtype: props.chosenSubtype,
    isPrompted: props.isPrompted,
  };
  if (!!props.dossierData) {
    okObject.dossierData = {
      ...props.dossierData,
      reportName: props.chosenProjectName,
    };
  }
  props.startLoading();
  props.startImport();
  Office.context.ui.messageParent(JSON.stringify(okObject));
}

function mapStateToProps(state) {
  return {
    ...state.navigationTree,
    authtoken: state.sessionReducer.authToken,
  };
};

export const PopupViewSelector = connect(mapStateToProps, actions)(_PopupViewSelector);

