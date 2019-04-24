import React from 'react';
import {connect} from 'react-redux';
import {actions} from '../navigation/navigation-tree-actions';
import {AttributeSelectorWindow} from '../attribute-selector/attribute-selector-window';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {NavigationTree} from '../navigation/navigation-tree';
import {LoadingPage} from '../loading/loading-page';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {PromptsWindow} from '../prompts/prompts-window';

export const _PopupViewSelector = (props) => {
  let popupType = props.popupType;
  const {propsToPass, methods, importRequested} = props;
  if (importRequested) {
    if (!props.isPrompted) {
      proceedToImport(props);
    } else if (!!props.instanceId) {
      proceedToImport(props);
    } else {
      popupType = PopupTypeEnum.promptsWindow;
      propsToPass.projectId = props.chosenProjectId;
      propsToPass.reportId = props.chosenObjectId;
    }
  }
  if (!popupType) {
    return <AttributeSelectorWindow parsed={propsToPass} handleBack={methods.handleBack} />;
  } else if (popupType === PopupTypeEnum.navigationTree) {
    return <NavigationTree handlePrepare={methods.handlePrepare} parsed={propsToPass} handlePopupErrors={methods.handlePopupErrors} />;
  } else if (popupType === PopupTypeEnum.loadingPage) {
    return <LoadingPage />;
  } else if (popupType === PopupTypeEnum.promptsWindow) {
    return <PromptsWindow parsed={propsToPass} />;
  }
  return <></>;
};

function proceedToImport(props) {
  const okObject = {
    command: selectorProperties.commandOk,
    chosenObject: props.chosenObjectId,
    chosenProject: props.chosenProjectId,
    chosenSubtype: props.chosenSubtype,
    isPrompted: props.isPrompted,
    instanceId: props.instanceId,
  };
  props.startLoading();
  props.startImport();
  Office.context.ui.messageParent(JSON.stringify(okObject));
}

function mapStateToProps(state) {
  return {...state.navigationTree};
};

export const PopupViewSelector = connect(mapStateToProps, actions)(_PopupViewSelector);

