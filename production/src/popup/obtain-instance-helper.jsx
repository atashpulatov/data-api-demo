import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from '@mstr/rc-3';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { popupViewSelectorHelper } from './popup-view-selector-helper';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupHelper } from './popup-helper';

import './obtain-instance-helper.scss';
import i18n from '../i18n';

class ObtainInstanceHelperNotConnected extends React.Component {
  componentDidMount() {
    popupViewSelectorHelper.obtainInstanceWithPromptsAnswers(this.props);
  }

  render() {
    return (
      <div className="obtain-instance-helper">
        <Spinner type="large">{i18n.t('Loading...')}</Spinner>
      </div>
    );
  }
}

function mapStateToProps(state) {
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
}

const mapDispatchToProps = { preparePromptedReport: popupActions.preparePromptedReport, };

export const ObtainInstanceHelper = connect(mapStateToProps, mapDispatchToProps)(ObtainInstanceHelperNotConnected);
