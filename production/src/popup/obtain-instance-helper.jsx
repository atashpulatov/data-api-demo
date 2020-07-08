import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { popupViewSelectorHelper } from './popup-view-selector-helper';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupHelper } from './popup-helper';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';

export const ObtainInstanceHelper = () => {
  const props = useSelector(state => {
    const {
      navigationTree,
      popupReducer: { editedObject },
      sessionReducer: { attrFormPrivilege },
      officeReducer,
    } = state;
    const { promptsAnswers } = navigationTree;
    const { supportForms } = officeReducer;
    const isReport = editedObject && editedObject.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
    const formsPrivilege = supportForms && attrFormPrivilege && isReport;
    return {
      ...navigationTree,
      editedObject: { ...(popupHelper.parsePopupState(editedObject, promptsAnswers, formsPrivilege)) },
    };
  });

  const dispatch = useDispatch();

  const preparePromptedReport = () => {
    dispatch(popupActions.preparePromptedReport);
  };

  useEffect(() => {
    popupViewSelectorHelper.obtainInstanceWithPromptsAnswers({ ...props, preparePromptedReport });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div />;
};
