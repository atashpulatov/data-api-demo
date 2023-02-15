import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { filterActions } from '../redux-reducer/filter-reducer/filter-actions';
import { popupHelper } from './popup-helper';
import { popupViewSelectorHelper } from './popup-view-selector-helper';
import { AttributeSelectorWindow } from '../attribute-selector/attribute-selector-window';
import { DossierWindow } from '../dossier/dossier-window';
import { NavigationTree } from '../navigation/navigation-tree';
import { PromptsWindow } from '../prompts/prompts-window';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { ObtainInstanceHelper } from './obtain-instance-helper';

const renderProperComponent = (popupType) => {
  switch (popupType) {
    case PopupTypeEnum.dataPreparation:
    case PopupTypeEnum.editFilters:
      return <AttributeSelectorWindow />;
    case PopupTypeEnum.navigationTree:
      return <NavigationTree />;
    case PopupTypeEnum.promptsWindow:
    case PopupTypeEnum.repromptingWindow:
      return <PromptsWindow />;
    case PopupTypeEnum.dossierWindow:
      return <DossierWindow />; // TODO: Might be missing {t}
    case PopupTypeEnum.obtainInstanceHelper:
      return <ObtainInstanceHelper />;
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
  const {
    navigationTree,
    popupReducer: { editedObject, preparedInstance },
    sessionReducer: { attrFormPrivilege, authToken },
    officeReducer,
    popupStateReducer
  } = state;
  const { promptsAnswers } = navigationTree;
  const { supportForms } = officeReducer;
  const { popupType } = popupStateReducer;
  const isReport = editedObject && editedObject.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  return {
    ...navigationTree,
    authToken,
    editedObject: { ...(popupHelper.parsePopupState(editedObject, promptsAnswers, formsPrivilege)) },
    preparedInstance,
    propsToPass: { ...popupStateReducer },
    popupType,
    formsPrivilege
  };
}

const mapDispatchToProps = {
  ...navigationTreeActions,
  ...filterActions,
  preparePromptedReport: popupActions.preparePromptedReport,
};

PopupViewSelectorNotConnected.propTypes = {
  authToken: PropTypes.string,
  popupType: PropTypes.oneOf(Object.values(PopupTypeEnum))
};

export const PopupViewSelector = connect(mapStateToProps, mapDispatchToProps)(PopupViewSelectorNotConnected);
