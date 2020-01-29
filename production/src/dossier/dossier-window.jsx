import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { MSTRIcon } from '@mstr/mstr-react-library';
import { PopupButtons } from '../popup/popup-buttons/popup-buttons';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { EmbeddedDossier } from './embedded-dossier';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import './dossier.css';
import { DEFAULT_PROJECT_NAME, } from '../storage/navigation-tree-reducer';
import { popupHelper } from '../popup/popup-helper';
import { popupStateActions } from '../popup/popup-state-actions';
import { officeContext } from '../office/office-context';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';

export default class DossierWindowNotConnected extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisualizationSelected: false,
      chapterKey: '',
      visualizationKey: '',
      promptsAnswers: [],
      preparedInstanceId: '',
      isVisualizationSupported: true,
    };
    this.handleSelection = this.handleSelection.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handlePromptAnswer = this.handlePromptAnswer.bind(this);
  }

  handleCancel() {
    const { Office } = window;
    const cancelObject = { command: selectorProperties.commandCancel, };
    Office.context.ui.messageParent(JSON.stringify(cancelObject));
  }

  async handleSelection(dossierData) {
    const { chosenObjectId, chosenProjectId } = this.props;
    const { chapterKey, visualizationKey, promptsAnswers, preparedInstanceId } = dossierData;
    let newValue = false;
    if ((chapterKey !== '') && (visualizationKey !== '')) {
      newValue = true;
    }
    let isVisualizationSupported = true;
    try {
      await mstrObjectRestService.fetchVisualizationDefinition({ projectId:chosenProjectId, objectId:chosenObjectId, instanceId:preparedInstanceId, visualizationInfo:{ chapterKey, visualizationKey } });
    } catch (error) {
      if (error.response.body.code === 'ERR009') {
        // Close popup if session expired
        popupHelper.handlePopupErrors(error);
      } else {
        isVisualizationSupported = false;
      }
    }
    this.setState({
      isVisualizationSelected: newValue,
      chapterKey,
      visualizationKey,
      promptsAnswers,
      preparedInstanceId,
      isVisualizationSupported
    });
  }

  handleOk() {
    const { chosenObjectName, chosenObjectId, chosenProjectId, editedObject } = this.props;
    const { isEdit } = editedObject;
    const { chapterKey, visualizationKey, promptsAnswers, preparedInstanceId } = this.state;
    const okObject = {
      command: selectorProperties.commandOk,
      chosenObjectName,
      chosenObject: chosenObjectId,
      chosenProject: chosenProjectId,
      chosenSubtype: mstrObjectEnum.mstrObjectType.visualization.subtypes,
      isPrompted: false,
      promptsAnswers,
      visualizationInfo: {
        chapterKey,
        visualizationKey,
      },
      preparedInstanceId,
      isEdit,
    };
    const Office = officeContext.getOffice();
    Office.context.ui.messageParent(JSON.stringify(okObject));
  }

  handlePromptAnswer(newAnswers, newInstanceId) {
    this.setState({ promptsAnswers: newAnswers, preparedInstanceId: newInstanceId });
  }

  render() {
    const { chosenObjectName, t, handleBack } = this.props;
    const isEdit = (chosenObjectName === DEFAULT_PROJECT_NAME);
    const { isVisualizationSelected, isVisualizationSupported } = this.state;
    return (
      <div>
        <h1 title={chosenObjectName} className="ant-col folder-browser-title">
          {`${t('Import Dossier')} > ${chosenObjectName}`}
        </h1>
        <span className="dossier-window-information-frame">
          <MSTRIcon clasName="dossier-window-information-icon" type="info-icon" />
          <span className="dossier-window-information-text">
            {`${t('This view supports the regular dossier manipulations. To import data, select a visualization.')}`}
          </span>
        </span>
        <EmbeddedDossier
          handleSelection={this.handleSelection}
          handlePromptAnswer={this.handlePromptAnswer}
        />
        <PopupButtons
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          handleBack={!isEdit && handleBack}
          hideSecondary
          disableActiveActions={!isVisualizationSelected}
          isPublished={isVisualizationSupported}
          disableSecondary={!isVisualizationSupported}
        />
      </div>
    );
  }
}

DossierWindowNotConnected.propTypes = {
  chosenObjectId: PropTypes.string,
  chosenObjectName: PropTypes.string,
  chosenProjectId: PropTypes.string,
  t: PropTypes.func,
  mstrData: PropTypes.shape({
    envUrl: PropTypes.string,
    authToken: PropTypes.string,
    promptsAnswers: PropTypes.array || null
  }),
  handleBack: PropTypes.func,
  editedObject: PropTypes.shape({
    chosenObjectId: PropTypes.string,
    projectId: PropTypes.string,
    isEdit: PropTypes.bool,
    instanceId: PropTypes.string,
    dossierName: PropTypes.string,
    promptsAnswers: PropTypes.array || null,
    selectedViz: PropTypes.string,
  }),
};

DossierWindowNotConnected.defaultProps = {
  chosenObjectId: 'default id',
  chosenObjectName: DEFAULT_PROJECT_NAME,
  chosenProjectId: 'default id',
  t: (text) => text,
  mstrData: {
    envUrl: 'no env url',
    authToken: null,
    promptsAnswers: null
  },
  handleBack: () => { },
  editedObject: {
    chosenObjectId: undefined,
    projectId: undefined,
    isEdit: false,
    instanceId: undefined,
    dossierName: undefined,
    promptsAnswers: null,
    selectedViz: '',
  },
};

function mapStateToProps(state) {
  const { navigationTree, popupReducer, sessionReducer, officeReducer } = state;
  const { chosenObjectName, chosenObjectId, chosenProjectId, promptsAnswers } = navigationTree;
  const { editedObject } = popupReducer;
  const { supportForms } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const objectType = editedObject ? editedObject.objectType : 'report';
  const isReport = objectType && (objectType === 'report' || objectType.name === 'report');
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  const editedObjectParse = { ...(popupHelper.parsePopupState(editedObject, promptsAnswers, formsPrivilege)) };
  return {
    chosenObjectName: editedObject ? editedObjectParse.chosenObjectName : chosenObjectName,
    chosenObjectId: editedObject ? editedObjectParse.chosenObjectId : chosenObjectId,
    chosenProjectId: editedObject ? editedObjectParse.projectId : chosenProjectId,
    editedObject: editedObjectParse,
  };
}

const mapActionsToProps = { handleBack: popupStateActions.onPopupBack, };

export const DossierWindow = connect(mapStateToProps, mapActionsToProps)(withTranslation('common')(DossierWindowNotConnected));
