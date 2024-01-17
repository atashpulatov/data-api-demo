import React from 'react';
import { connect } from 'react-redux';
import { Empty } from '@mstr/connector-components';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { popupViewSelectorHelper } from './popup-view-selector-helper';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupHelper } from './popup-helper';

import './obtain-instance-helper.scss';

class ObtainInstanceHelperNotConnected extends React.Component {
  componentDidMount() {
    popupViewSelectorHelper.obtainInstanceWithPromptsAnswers(this.props);
  }

  render() {
    return (
      <div className="obtain-instance-helper">
        <Empty isLoading />
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
