import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { popupViewSelectorHelper } from './popup-view-selector-helper';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupHelper } from './popup-helper';

const ObtainInstanceHelperNotConnected = (props) => {
  useEffect(() => {
    popupViewSelectorHelper.obtainInstanceWithPromptsAnswers(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div />;
};

function mapStateToProps(state) {
  const {
    navigationFilters,
    navigationObject,
    popupReducer: { editedObject },
    sessionReducer: { attrFormPrivilege },
    officeReducer,
  } = state;
  const { promptsAnswers } = navigationObject;
  const { supportForms } = officeReducer;
  const isReport = editedObject && editedObject.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  return {
    ...navigationFilters,
    ...navigationObject,
    editedObject: { ...(popupHelper.parsePopupState(editedObject, promptsAnswers, formsPrivilege)) },
  };
}

const mapDispatchToProps = { preparePromptedReport: popupActions.preparePromptedReport, };

export const ObtainInstanceHelper = connect(mapStateToProps, mapDispatchToProps)(ObtainInstanceHelperNotConnected);
