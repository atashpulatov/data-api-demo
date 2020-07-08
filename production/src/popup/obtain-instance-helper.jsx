import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { popupViewSelectorHelper } from './popup-view-selector-helper';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupHelper } from './popup-helper';

export const ObtainInstanceHelper = () => {
  const props = useSelector(state => {
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
  });

  useEffect(() => {
    popupViewSelectorHelper.obtainInstanceWithPromptsAnswers(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div />;
};
