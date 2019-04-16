import React from 'react';
import {connect} from 'react-redux';
import {actions} from '../navigation/navigation-tree-actions';
import {AttributeSelectorWindow} from '../attribute-selector/attribute-selector-window';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {NavigationTree} from '../navigation/navigation-tree';
import {LoadingPage} from '../loading/loading-page';
import {selectorProperties} from '../attribute-selector/selector-properties';

export const _PopupViewSelector = (props) => {
  const {popupType, propsToPass, methods, importRequested} = props;
  if (importRequested) {
    proceedToImport(props);
  }
  if (!popupType) {
    return <AttributeSelectorWindow parsed={propsToPass} handleBack={methods.handleBack} />;
  } else if (popupType === PopupTypeEnum.navigationTree) {
    return <NavigationTree handlePrepare={methods.handlePrepare} parsed={propsToPass} handlePopupErrors={methods.handlePopupErrors} />;
  } else if (popupType === PopupTypeEnum.loadingPage) {
    return <LoadingPage />;
  }
  return <></>;
};

function proceedToImport(props) {
  const okObject = {
    command: selectorProperties.commandOk,
    chosenObject: props.chosenObjectId,
    chosenProject: props.chosenProjectId,
    chosenSubtype: props.chosenSubtype,
  };
  props.startLoading();
  props.startImport();
  Office.context.ui.messageParent(JSON.stringify(okObject));
}

function mapStateToProps(state) {
  return {...state.navigationTree};
};

export const PopupViewSelector = connect(mapStateToProps, actions)(_PopupViewSelector);

