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
import { DEFAULT_PROJECT_NAME } from '../redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import { popupHelper } from '../popup/popup-helper';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { authenticationHelper } from '../authentication/authentication-helper';
import { sessionHelper, EXTEND_SESSION } from '../storage/session-helper';
import { errorCodes } from '../error/constants';

// // TODO move to helper
// // TODO jsdocs
// const mapVizesFromGivenPagesOrPanels = (givenPagesOrPanels, vizKeysSet) => {
//   givenPagesOrPanels.forEach(pageOrPanel => {
//     if (pageOrPanel.visualizations) {
//       pageOrPanel.visualizations.forEach(viz => vizKeysSet.add(viz.key));
//     }

//     if (pageOrPanel.panelStacks) {
//       pageOrPanel.panelStacks.forEach(panelStack => {
//         if (panelStack.panels) {
//           mapVizesFromGivenPagesOrPanels(panelStack.panels, vizKeysSet);
//         }
//       });
//     }
//   });
// };

export default class DossierWindowNotConnected extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      promptsAnswers: [],
      instanceId: '',
      vizualizationsData: [],
      lastSelectedViz: {},
      isEmbeddedDossierLoaded: false,
    };
    this.handleSelection = this.handleSelection.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handlePromptAnswer = this.handlePromptAnswer.bind(this);
    this.handleInstanceIdChange = this.handleInstanceIdChange.bind(this);
    this.handleEmbeddedDossierLoad = this.handleEmbeddedDossierLoad.bind(this);

    const { installSessionProlongingHandler } = sessionHelper;
    this.prolongSession = installSessionProlongingHandler(this.handleCancel);

    this.previousSelectionBackup = [];
  }

  componentDidMount() {
    window.addEventListener('message', this.extendSession);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.extendSession);
  }

  extendSession = (message = {}) => {
    const { data: postMessage, origin } = message;
    const { origin: targetOrigin } = window;
    if (origin === targetOrigin && postMessage === EXTEND_SESSION) {
      this.prolongSession();
    }
  }

  validateSession = () => {
    authenticationHelper.validateAuthToken().catch((error) => {
      popupHelper.handlePopupErrors(error);
    });
  }

  handleCancel = () => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    popupHelper.officeMessageParent(message);
  }

  async handleSelection(dossierData) {
    const { chosenObjectId, chosenProjectId } = this.props;
    const {
      chapterKey, visualizationKey, promptsAnswers, instanceId
    } = dossierData;

    if (instanceId) {
      this.setState({
        lastSelectedViz: {
          chapterKey,
          visualizationKey
        },
        promptsAnswers,
        instanceId,
      });

      const { vizualizationsData } = this.state;

      if (!vizualizationsData.find(el => (el.visualizationKey === visualizationKey && el.chapterKey === chapterKey))) {
        let isSupported = true;

        const checkIfVizDataCanBeImported = async () => {
          await mstrObjectRestService.fetchVisualizationDefinition({
            projectId: chosenProjectId,
            objectId: chosenObjectId,
            instanceId,
            visualizationInfo: { chapterKey, visualizationKey }
          });
        };

        // const checkIfVizIsInDossierInstanceDefinition = async () => {
        //   // TODO fetch the dossier definition only when it opens or when instance is changing
        //   // TODO (e.g. prompts answered or reset) and run only simple selection here instead of complex parsing
        //   const definition = await mstrObjectRestService
        //     .getDossierInstanceDefinition(chosenProjectId, chosenObjectId, instanceId);

        //   const currentChapter = definition.chapters.find(chapter => chapter.key === chapterKey);
        //   const currentPage = currentChapter.pages.find(page => page.key === pageKey);

        //   const vizKeys = new Set();
        //   mapVizesFromGivenPagesOrPanels([currentPage], vizKeys);

        //   if (!vizKeys.has(visualizationKey)) {
        //     throw new Error('Selected visualization is not included in dossier instance definition.');
        //   } else {
        //     const panelStackTree = [];
        //   }
        // };

        await Promise.all([
          checkIfVizDataCanBeImported(),
          // checkIfVizIsInDossierInstanceDefinition(),
        ])
          .catch(error => {
            console.error(error);
            const { ERR009 } = errorCodes;
            if (error.response && error.response.body.code === ERR009) {
              // Close popup if session expired
              popupHelper.handlePopupErrors(error);
            } else {
              isSupported = false;
            }
          });

        vizualizationsData.push({
          chapterKey,
          visualizationKey,
          isSupported,
        });

        this.setState({ vizualizationsData });
      }
    }
  }

  handleOk() {
    const {
      chosenObjectName,
      chosenObjectId,
      chosenProjectId,
      editedObject,
    } = this.props;
    const { isEdit } = editedObject;
    const { lastSelectedViz, promptsAnswers, instanceId } = this.state;
    const {
      chapterKey, visualizationKey, pageKey, panelKey, panelStackKey
    } = lastSelectedViz;
    const message = {
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
        pageKey,
        panelKey,
        panelStackKey
      },
      preparedInstanceId: instanceId,
      isEdit,
    };
    popupHelper.officeMessageParent(message);
  }

  /**
   * Store new instance id in state.
   * Unselect visualization after instanceId changed.
   * Restore backuped viz selection info in case of return to previous instance.
   * Above happens on reprompt button click followed by cancel button click in reprompt popup.
   *
   * @param {String} newInstanceId
   */
  handleInstanceIdChange(newInstanceId) {
    const { instanceId, lastSelectedViz, promptsAnswers } = this.state;

    const backup = this.previousSelectionBackup.find((el) => el.instanceId === newInstanceId);

    if (instanceId !== newInstanceId && !backup) {
      // Make a backup of last selection info.
      this.previousSelectionBackup.unshift({
        instanceId,
        lastSelectedViz,
      });
      // Clear selection of viz and update instance id.
      this.setState({
        instanceId: newInstanceId,
        lastSelectedViz: {},
        vizualizationsData: [],
      });
    } else {
      // Restore backuped viz selection info in case of return to prev instance
      this.setState({ vizualizationsData: [] });
      this.handleSelection({
        ...backup.lastSelectedViz,
        promptsAnswers,
        instanceId: backup.instanceId,
      });
    }
  }

  /**
   * Store new prompts answers in state
   *
   * @param {Array} newAnswers
   */
  handlePromptAnswer(newAnswers) {
    this.setState({ promptsAnswers: newAnswers, vizualizationsData: [], });
  }

  /**
  * Change state of component so that informative message is showed only after embedded dossier is loaded.
  *
  */
  handleEmbeddedDossierLoad() {
    this.setState({ isEmbeddedDossierLoaded: true });
  }

  render() {
    const {
      chosenObjectName, t, handleBack, editedObject
    } = this.props;
    const { isEdit } = editedObject;
    const { isEmbeddedDossierLoaded, lastSelectedViz, vizualizationsData } = this.state;

    const { chapterKey, visualizationKey, } = lastSelectedViz;
    const vizData = vizualizationsData
      .find(el => (el.visualizationKey === visualizationKey && el.chapterKey === chapterKey));

    const isSelected = !!((chapterKey && visualizationKey));
    const isSupported = !!(isSelected && vizData && vizData.isSupported);
    const isChecking = !!(isSelected && (!vizData || (vizData && vizData.isSupported === undefined)));

    // TODO investigate why the import buton is not initialy enabled on edit

    return (
      <div className="dossier-window">
        <h1
          title={chosenObjectName}
          className="ant-col folder-browser-title dossier-title-margin-top"
        >
          {`${t('Import Dossier')} > ${chosenObjectName}`}
        </h1>

        { isEmbeddedDossierLoaded
        && (
          <span className="dossier-window-information-frame">
            <MSTRIcon
              clasName="dossier-window-information-icon"
              type="info-icon"
            />
            <span className="dossier-window-information-text">
              {`${t(
                'This view supports the regular dossier manipulations. To import data, select a visualization.'
              )}`}
            </span>
          </span>
        )}

        <EmbeddedDossier
          handleSelection={this.handleSelection}
          handlePromptAnswer={this.handlePromptAnswer}
          handleInstanceIdChange={this.handleInstanceIdChange}
          handleIframeLoadEvent={this.validateSession}
          handleEmbeddedDossierLoad={this.handleEmbeddedDossierLoad}
        />
        <PopupButtons
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          handleBack={!isEdit && handleBack}
          hideSecondary
          disableActiveActions={!isSelected}
          isPublished={!(isSelected && !isSupported && !isChecking)}
          disableSecondary={isSelected && !isSupported && !isChecking}
          checkingSelection={isChecking}
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
  handleBack: () => {},
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
  const {
    navigationTree, popupReducer, sessionReducer, officeReducer
  } = state;
  const {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
    promptsAnswers,
  } = navigationTree;
  const { editedObject } = popupReducer;
  const { supportForms } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const isReport = editedObject && editedObject.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  const editedObjectParse = {
    ...popupHelper.parsePopupState(
      editedObject,
      promptsAnswers,
      formsPrivilege
    ),
  };
  return {
    chosenObjectName: editedObject
      ? editedObjectParse.dossierName
      : chosenObjectName,
    chosenObjectId: editedObject
      ? editedObjectParse.chosenObjectId
      : chosenObjectId,
    chosenProjectId: editedObject
      ? editedObjectParse.projectId
      : chosenProjectId,
    editedObject: editedObjectParse,
  };
}

const mapActionsToProps = { handleBack: popupStateActions.onPopupBack };

export const DossierWindow = connect(
  mapStateToProps,
  mapActionsToProps
)(withTranslation('common')(DossierWindowNotConnected));
