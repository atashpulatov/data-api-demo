import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../navigation/navigation-tree-actions';
import { popupHelper } from './popup-helper';
import { popupViewSelectorHelper } from './popup-view-selector-helper';
import { AttributeSelectorWindow } from '../attribute-selector/attribute-selector-window';
import { DossierWindow } from '../dossier/dossier-window';
import { LoadingPage } from '../loading/loading-page';
import { RefreshAllPage } from '../loading/refresh-all-page';
import { NavigationTree } from '../navigation/navigation-tree';
import { PromptsWindow } from '../prompts/prompts-window';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { popupActions } from './popup-actions';

const renderProperComponent = (popupType) => {
  switch (popupType) {
  case PopupTypeEnum.dataPreparation:
  case PopupTypeEnum.editFilters:
    return <AttributeSelectorWindow />;
  case PopupTypeEnum.navigationTree:
    return <NavigationTree />;
  case PopupTypeEnum.loadingPage:
    return <LoadingPage />;
  case PopupTypeEnum.refreshAllPage:
    return <RefreshAllPage />;
  case PopupTypeEnum.promptsWindow:
  case PopupTypeEnum.repromptingWindow:
    return <PromptsWindow />;
  case PopupTypeEnum.emptyDiv:
    return <div />;
  case PopupTypeEnum.dossierWindow:
    return <DossierWindow />; // TODO: Might be missing {t}
  default:
    return null;
  }
};

export const PopupViewSelectorNotConnected = (props) => {
  const { authToken, popupType: popupTypeProps } = props;
  if (!authToken) {
    console.log('Waiting for token to be passed');
    return null;
  }
  const popupType = popupViewSelectorHelper.setPopupType(props, popupTypeProps);
  return renderProperComponent(popupType);
};

function mapStateToProps(state) {
  const { navigationTree, popupReducer, sessionReducer, officeReducer } = state;
  const { promptsAnswers } = navigationTree;
  const { editedObject } = popupReducer;
  const { supportForms } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const objectType = editedObject && editedObject.objectType ? editedObject.objectType : 'report';
  const isReport = objectType && (objectType === 'report' || objectType.name === 'report');
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  return {
    ...state.navigationTree,
    authToken: state.sessionReducer.authToken,
    editedObject: { ...(popupHelper.parsePopupState(editedObject, promptsAnswers, formsPrivilege)) },
    preparedInstance: state.popupReducer.preparedInstance,
    propsToPass: { ...state.popupStateReducer },
    popupType: state.popupStateReducer.popupType,
    formsPrivilege
  };
}

const mapDispatchToProps = {
  ...actions,
  preparePromptedReport: popupActions.preparePromptedReport,
};

export const PopupViewSelector = connect(mapStateToProps, mapDispatchToProps)(PopupViewSelectorNotConnected);
