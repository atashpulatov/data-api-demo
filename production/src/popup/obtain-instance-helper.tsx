import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Spinner } from '@mstr/rc';

import { popupHelper } from './popup-helper';
import { popupViewSelectorHelper } from './popup-view-selector-helper';

import i18n from '../i18n';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';

const ObtainInstanceHelperNotConnected: React.FC = props => {
  useEffect(() => {
    popupViewSelectorHelper.obtainInstanceWithPromptsAnswers(props);
  }, [props]);

  return (
    <div className='obtain-instance-helper'>
      <Spinner className='loading-spinner' type='large'>
        {i18n.t('Loading...')}
      </Spinner>
    </div>
  );
};

function mapStateToProps(state: any): any {
  const {
    navigationTree,
    popupReducer: { editedObject },
    sessionReducer: { attrFormPrivilege },
    officeReducer,
  } = state;
  const { promptsAnswers } = navigationTree;
  const { supportForms } = officeReducer;
  const isReport =
    editedObject && editedObject.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  return {
    ...navigationTree,
    editedObject: {
      ...popupHelper.parsePopupState(editedObject, promptsAnswers, formsPrivilege),
    },
  };
}

const mapDispatchToProps = {
  preparePromptedReport: popupActions.preparePromptedReport,
};

export const ObtainInstanceHelper = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObtainInstanceHelperNotConnected);
