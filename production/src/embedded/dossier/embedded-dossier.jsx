/* eslint-disable max-len */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { popupHelper } from '../../popup/popup-helper';
import { DEFAULT_PROJECT_NAME } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import scriptInjectionHelper from '../utils/script-injection-helper';
import { handleLoginExcelDesktopInWindows } from '../utils/embedded-helper';
import './dossier.css';
import { embeddedDossierHelper } from './embedded-dossier-helper';
import { convertPixelsToPoints } from '../../helpers/visualization-image-utils';

import {
  prepareGivenPromptAnswers,
  preparePromptedDossier,
  ObjectExecutionStatus
} from '../../helpers/prompts-handling-helper';
import { selectorProperties } from '../../attribute-selector/selector-properties';

const { microstrategy, Office } = window;

const { createDossierInstance, rePromptDossier, getObjectPrompts } = mstrObjectRestService;

const VIZ_SELECTION_RETRY_DELAY = 200; // ms
const VIZ_SELECTION_RETRY_LIMIT = 10;

export default class EmbeddedDossierNotConnected extends React.Component {
  constructor(props) {
    super(props);
    const { mstrData } = props;

    this.container = React.createRef();
    this.msgRouter = null;
    this.onVizSelectionHandler = this.onVizSelectionHandler.bind(this);
    this.dossierData = { promptsAnswers: mstrData.promptsAnswers };
    this.promptsAnsweredHandler = this.promptsAnsweredHandler.bind(this);
    this.instanceIdChangeHandler = this.instanceIdChangeHandler.bind(this);
    this.restoreVizSelection = this.restoreVizSelection.bind(this);
    this.onEmbeddedError = this.onEmbeddedError.bind(this);
    this.retryCounter = 0;
    this.embeddedDossier = null;
  }

  componentDidMount() {
    scriptInjectionHelper.watchForIframeAddition(this.container.current, this.onIframeLoad);
    this.loadEmbeddedDossier(this.container.current);
  }

  componentWillUnmount() {
    if (this.msgRouter) {
      const { EventType } = microstrategy.dossier;
      this.msgRouter.removeEventhandler(EventType.ON_VIZ_SELECTION_CHANGED, this.onVizSelectionHandler);
      this.msgRouter.removeEventhandler(EventType.ON_PROMPT_ANSWERED, this.promptsAnsweredHandler);
      this.msgRouter.removeEventhandler(EventType.ON_DOSSIER_INSTANCE_ID_CHANGE, this.instanceIdChangeHandler);
      this.msgRouter.removeEventhandler(EventType.ON_ERROR, this.onEmbeddedError);
    }
  }

  /**
   * This function is called after the embedded dossier iframe is added into the DOM
   * @param {*} iframe
   */
  onIframeLoad = (iframe) => {
    iframe.addEventListener('load', () => {
      const { contentDocument } = iframe;
      const { handleIframeLoadEvent } = this.props;
      if (iframe.focusEventListenerAdded === false) {
        iframe.focusEventListenerAdded = true;
        iframe.addEventListener('focus', scriptInjectionHelper.switchFocusToElementOnWindowFocus);
      }
      // DE160793 - Throw session expired error when dossier redirects to login (iframe 'load' event)
      handleIframeLoadEvent();
      handleLoginExcelDesktopInWindows(contentDocument, Office);
    });
  };

  /**
 * Handles the event throwed after new vizualization selection.
 * Retrives the selected vizualizationKey and chapterKey.
 * Passes new data to parent component by handleSelection function.
 *
 * @param {Object} payload - payload throwed by embedded.api after the visualization was selected
 */
  onVizSelectionHandler(payload) {
    const { handleSelection } = this.props;
    const [payloadChapterKey] = Object.keys(payload);
    const chapterData = payload[payloadChapterKey];
    const [payloadVisKey] = Object.keys(chapterData);
    const vizDimensions = chapterData[payloadVisKey];

    if (vizDimensions) {
      vizDimensions.width = convertPixelsToPoints(vizDimensions.width);
      vizDimensions.height = convertPixelsToPoints(vizDimensions.height);
    }

    this.dossierData = {
      ...this.dossierData,
      chapterKey: payloadChapterKey,
      visualizationKey: payloadVisKey,
      vizDimensions
    };

    handleSelection(this.dossierData);
  }

  /**
   * Handles the event throwed after new error in embedded dossier.
   * Retrives the error type (based on title).
   * If error type is not a notification - handles it by closing the window
   *
   * @param {Object} error - payload throwed by embedded.api after the error occured
   */
  // eslint-disable-next-line class-methods-use-this
  onEmbeddedError(error) {
    const { title } = error;
    if (title !== 'Notification') {
      // TODO: improve this, so it doesn't depend on i18n
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      popupHelper.handlePopupErrors(error);
    }
  }

  /**
   * This function handles the instance creation of the Dossier.
   * If the instanceId is provided, it will be used to create the Dossier's instance.
   * Otherwise, a new instance will be created.
   * @param {*} instanceId
   * @param {*} projectId
   * @param {*} dossierId
   * @param {*} isPrompted
   * @param {*} isMultipleRepromptWithReuse
   * @returns
   */
  handleInstanceId = async (instanceId, projectId, dossierId, isPrompted, isMultipleRepromptWithReuse) => {
    if (instanceId) {
      return { mid: instanceId, status: ObjectExecutionStatus.READY };
    }

    // Create a new instance of the Dossier using shortcut. For Multiple Reprompt workflow (with Reuse Prompt Answers flag on),
    // make sure to pass 'disableManipulationsAutoSaving: false' to ensure the Dossier instance is interpreted as a 'Shortcut Run as Base'.
    // Otherwise, the Dossier will include nested prompts answers and these answers will be added when re-prompting the Dossier, causing an error.
    // Refer to the chart here for more details: https://microstrategy.atlassian.net/wiki/spaces/TECCLIENTSMOBILECTCiOSANA/pages/3646718180/F35914+Bookmarks+support+when+linking+to+a+dossier#2.2.1-Dossier-Execution
    const body = { disableManipulationsAutoSaving: !isMultipleRepromptWithReuse, persistViewState: true };
    const instance = await createDossierInstance(projectId, dossierId, body);

    // Checking if the dossier is prompted and update the status accordingly
    instance.status = isPrompted || isMultipleRepromptWithReuse ? ObjectExecutionStatus.PROMPTED : ObjectExecutionStatus.READY;

    return instance;
  };

  /**
   * This function handles the preparation of the Dossier's instance to apply previous answers if necessary.
   * @param {*} instance
   * @param {*} dossierId
   * @param {*} projectId
   * @param {*} givenPromptsAnswers
   * @returns
   */
  prepareAndHandlePromptAnswers = async (instance, dossierId, projectId, givenPromptsAnswers) => {
    // Prepare the Dossier's instance to apply previous answers if necessary.
    if (givenPromptsAnswers.length > 0 && givenPromptsAnswers[0].answers.length > 0) {
      // Proceed with answering prompts if there are prompts to answer, including nested prompts.
      instance = await preparePromptedDossier(instance, dossierId, projectId, givenPromptsAnswers);
    }
    return instance;
  };

  /**
   * Open Prompts' dialog if there are prompts to answer when importing a report/dossier or when
   * multiple reprompt is triggered; 'reusePromptAnswers' needs to be true for both cases.
   * @param {*} dossierId
   * @param {*} instance - passed as reference to update the instanceId (mid) if re-prompting the dossier.
   * @param {*} projectId
   * @param {*} dossierOpenRequested
   * @param {*} isImportedObjectPrompted
   * @param {*} isMultipleRepromptWithReuse
   */
  openPromptDialog = async (dossierId, instance, projectId, dossierOpenRequested, isImportedObjectPrompted, isMultipleRepromptWithReuse) => {
    if ((dossierOpenRequested && isImportedObjectPrompted) || isMultipleRepromptWithReuse) {
      // Re-prompt the Dossier's instance to show the prompts dialog.
      const resp = await rePromptDossier(
        dossierId,
        instance.mid,
        projectId
      );

      instance.mid = resp?.mid;
    }
  };

  loadEmbeddedDossier = async (container) => {
    const {
      mstrData,
      handleEmbeddedDossierLoad,
      reusePromptAnswers,
      previousPromptsAnswers,
      dossierOpenRequested,
      promptObjects,
      isPrompted,
      isMultipleRepromptWithReuse,
      isReprompt,
      handleEmbeddedDossierVisibility,
    } = this.props;
    const {
      envUrl, authToken, dossierId, projectId, promptsAnswers,
      instanceId, selectedViz, visualizationInfo
    } = mstrData;
    let instance = {};
    try {
      // Create instance and handle it different if it is prompted or multiple reprompt is triggered.
      instance = await this.handleInstanceId(instanceId, projectId, dossierId, isPrompted, isMultipleRepromptWithReuse);

      // Declared variables to determine whether importing a report/dossier is taking place and
      // whether there are previous prompt answers to handle
      const isImportedObjectPrompted = promptObjects?.length > 0;
      const handlePreviousAnswersAtImport = dossierOpenRequested && reusePromptAnswers
        && previousPromptsAnswers?.length > 0 && isImportedObjectPrompted;

      // Instead of using the edited dossier prompt answers, use REST API to get the prompts objects when multiple reprompt is triggered.
      const promptObjectAnswers = isMultipleRepromptWithReuse ? await getObjectPrompts(dossierId, projectId, instance.mid) : promptObjects;
      const shouldPreparePromptAnswers = handlePreviousAnswersAtImport || isMultipleRepromptWithReuse;

      // Update givenPromptsAnswers collection with previous prompt answers if importing a report/dossier
      // or when multiple reprompt is triggered, in this case, use mstrData's (edited object) prompts answers.
      const givenPromptsAnswers = shouldPreparePromptAnswers ? prepareGivenPromptAnswers(promptObjectAnswers, previousPromptsAnswers) : { ...promptsAnswers };

      instance = await this.prepareAndHandlePromptAnswers(instance, dossierId, projectId, givenPromptsAnswers);

      // Proceed with opening prompt dialog if applicable.
      await this.openPromptDialog(dossierId, instance, projectId, dossierOpenRequested, isImportedObjectPrompted, isMultipleRepromptWithReuse);
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      popupHelper.handlePopupErrors(error);
    }

    this.dossierData = {
      ...this.dossierData,
      instanceId: instance.mid,
    };

    const serverURL = envUrl.slice(0, envUrl.lastIndexOf('/api'));
    // delete last occurence of '/api' from the enviroment url

    const { CustomAuthenticationType, EventType } = microstrategy.dossier;

    const props = {
      instance,
      serverURL,
      applicationID: projectId,
      objectID: dossierId,
      enableCustomAuthentication: true,
      customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
      enableResponsive: true,
      reportInLibraryFeature: { enabled: false },
      getLoginToken() {
        return Promise.resolve(authToken);
      },
      placeholder: container,
      enableCollaboration: false,
      filterFeature: {
        enabled: true,
        edit: true,
        summary: true,
      },
      navigationBar: {
        enabled: true,
        gotoLibrary: true,
        title: true,
        toc: true,
        reset: true,
        reprompt: true,
        share: false,
        comment: false,
        notification: false,
        filter: true,
        options: false,
        search: false,
        bookmark: true,
        edit: false,
      },
      optionsFeature: {
        enabled: true,
        help: true,
        logout: true,
        manage: true,
        showTutorials: true,
      },
      shareFeature: {
        enabled: true,
        invite: true,
        link: true,
        email: true,
        export: true,
        download: true,
        shareDossier: false,
      },
      tocFeature: { enabled: true, },
      uiMessage: {
        enabled: true,
        addToLibrary: true,
      },
      enableVizSelection: true,
      onMsgRouterReadyHandler: ({ MsgRouter }) => {
        this.msgRouter = MsgRouter;
        this.msgRouter.registerEventHandler(EventType.ON_VIZ_SELECTION_CHANGED, this.onVizSelectionHandler);
        this.msgRouter.registerEventHandler(EventType.ON_PROMPT_ANSWERED, this.promptsAnsweredHandler);
        this.msgRouter.registerEventHandler(EventType.ON_DOSSIER_INSTANCE_ID_CHANGE, (selectedInstanceId, args) => {
          if (isReprompt && !dossierOpenRequested && selectedInstanceId === undefined) {
            const { commandCancel } = selectorProperties;
            const message = { command: commandCancel, };
            popupHelper.officeMessageParent(message);
          }
          // Need to make sure that the instanceId is not null before calling the handler
          selectedInstanceId && this.instanceIdChangeHandler(selectedInstanceId);
        });
        this.msgRouter.registerEventHandler(EventType.ON_ERROR, this.onEmbeddedError);
        this.msgRouter.registerEventHandler(EventType.ON_PAGE_LOADED, () => {
          // Just hide the embedded dossier when it is consumption page is loaded
          // and avoid any flickering.
          !dossierOpenRequested && handleEmbeddedDossierVisibility(false);
        });
      },
      dossierFeature: {
        visExport: {
          enabled: false,
          excel: false,
          pdf: false,
          csv: false,
        }
      }
    };

    if (microstrategy && microstrategy.dossier) {
      const embeddedDossier = await microstrategy.dossier.create(props);
      this.embeddedDossier = embeddedDossier;

      if (selectedViz && visualizationInfo) {
        const { pageKey, chapterKey, visualizationKey } = visualizationInfo;

        const chapterList = embeddedDossier.getChapterList();

        const selectedPageNodeKey = chapterList
          .find(chapter => chapter.nodeKey.includes(chapterKey))
          .children
          .find(page => page.nodeKey.includes(pageKey))
          .nodeKey;

        const selectedPage = embeddedDossier.getPageByNodeKey(selectedPageNodeKey);

        await embeddedDossier.navigateToPage(selectedPage);

        await this.restoreVizSelection(visualizationKey);
      }

      handleEmbeddedDossierLoad();
    } else {
      console.warn('Cannot find microstrategy.dossier, please check embeddinglib.js is present in your environment');
    }
  };

  async restoreVizSelection(visualizationKey) {
    try {
      this.retryCounter++;
      await this.embeddedDossier.selectViz(visualizationKey);
    } catch (error) {
      if (this.retryCounter > VIZ_SELECTION_RETRY_LIMIT) {
        console.error(error);
      } else {
        await new Promise(resolve => setTimeout(resolve, VIZ_SELECTION_RETRY_DELAY));
        await this.restoreVizSelection(visualizationKey);
      }
    }
  }

  /**
  * Update the instanceId in dossierData and also in parent component.
  * InstanceId is changing as result of reset button click, switch to
  * bookmark or new prompts answers given.
  *
  * @param {String} newInstanceId
  */
  instanceIdChangeHandler(newInstanceId) {
    const { handleInstanceIdChange } = this.props;
    this.dossierData.instanceId = newInstanceId;
    handleInstanceIdChange(newInstanceId);
  }

  /**
  * Update the promptsAnswers in dossierData and also in parent component.
  * Update the selectedViz in parent component in case of simple reprompt
  * to keep the import button enabled.
  *
  * @param {Array} promptsAnswers
  */
  async promptsAnsweredHandler(promptsAnswers) {
    const { handlePromptAnswer, mstrData } = this.props;

    // Create reference to previous answers. This function called again after
    // nested re-prompting the dossier, so we need to keep previous answers along with new ones
    const tempAnswers = this.dossierData.promptsAnswers?.answers ? this.dossierData.promptsAnswers.answers : [];
    // Combined the prompt answers.
    promptsAnswers.answers = embeddedDossierHelper.combineArraysByObjectKey(tempAnswers, promptsAnswers.answers);

    this.dossierData.promptsAnswers = promptsAnswers;
    handlePromptAnswer(promptsAnswers);

    if (this.embeddedDossier) {
      const payload = await this.embeddedDossier.getSelectedVizKeys();
      if (Object.keys(payload).length > 0) {
        this.onVizSelectionHandler(payload);
      }
    }
  }

  render() {
    return (
      /*
      Height needs to be passed for container because without it, embedded api will set default height: 600px;
      We need to calculate actual height, regarding the size of other elements:
      58px for header, 19px for header and title margin and 68px for buttons.
      */
      <div
        ref={this.container}
        className="dossier-iframe" />
    );
  }
}

EmbeddedDossierNotConnected.propTypes = {
  mstrData: PropTypes.shape({
    envUrl: PropTypes.string,
    authToken: PropTypes.string,
    dossierId: PropTypes.string,
    projectId: PropTypes.string,
    instanceId: PropTypes.string,
    promptsAnswers: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.any]),
    selectedViz: PropTypes.string,
    visualizationInfo: PropTypes.shape({
      chapterKey: PropTypes.string,
      pageKey: PropTypes.string,
      visualizationKey: PropTypes.string,
    }),
  }),
  handleSelection: PropTypes.func,
  handlePromptAnswer: PropTypes.func,
  handleInstanceIdChange: PropTypes.func,
  handleIframeLoadEvent: PropTypes.func,
  handleEmbeddedDossierLoad: PropTypes.func,
  reusePromptAnswers: PropTypes.bool,
  previousPromptsAnswers: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    useDefault: PropTypes.bool,
    values: PropTypes.arrayOf(PropTypes.string)
  })),
  dossierOpenRequested: PropTypes.bool,
  promptObjects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    answers: PropTypes.arrayOf(PropTypes.shape({})),
    type: PropTypes.string,
  })),
  isPrompted: PropTypes.bool,
  repromptsQueue: PropTypes.shape({
    total: PropTypes.number,
    index: PropTypes.number,
  }),
  isMultipleRepromptWithReuse: PropTypes.bool,
  isReprompt: PropTypes.bool,
  handleEmbeddedDossierVisibility: PropTypes.func,
};

EmbeddedDossierNotConnected.defaultProps = {
  mstrData: {
    envUrl: '',
    authToken: '',
    dossierId: 'default id',
    projectId: 'default id',
    instanceId: 'default id',
    promptsAnswers: null,
    selectedViz: '',
  },
  handleSelection: () => {},
  isMultipleRepromptWithReuse: false,
  isReprompt: false,
};

const mapStateToProps = (state) => {
  const {
    navigationTree,
    popupReducer,
    sessionReducer: { attrFormPrivilege, envUrl, authToken },
    officeReducer,
    answersReducer,
    popupStateReducer,
    repromptsQueueReducer,
  } = state;
  const {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
    promptObjects,
    dossierOpenRequested,
    isPrompted,
  } = navigationTree;
  const popupState = popupReducer.editedObject;
  const { promptsAnswers } = state.navigationTree;
  const { supportForms, reusePromptAnswers } = officeReducer;
  const { answers } = answersReducer;
  const isReport = popupState && popupState.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  const isEdit = (chosenObjectName === DEFAULT_PROJECT_NAME);
  const editedObject = { ...(popupHelper.parsePopupState(popupState, promptsAnswers, formsPrivilege)) };
  const { isReprompt } = popupStateReducer;
  const isMultipleRepromptWithReuse = reusePromptAnswers && repromptsQueueReducer.total > 1;

  // Do not specify the instanceId if it is a multiple reprompt because, if it is specified,
  // the embedded dossier will not load the saved prompts and will use the default ones instead, the ones
  // in the definition when it was imported the first time.
  const mstrData = {
    envUrl,
    authToken,
    dossierId: isEdit || isReprompt ? editedObject.chosenObjectId : chosenObjectId,
    projectId: isEdit || isReprompt ? editedObject.projectId : chosenProjectId,
    promptsAnswers: isEdit || isReprompt ? editedObject.promptsAnswers : promptsAnswers,
    visualizationInfo: editedObject.visualizationInfo,
    selectedViz: isEdit || isReprompt ? editedObject.selectedViz : '',
    instanceId: !isMultipleRepromptWithReuse ? editedObject.instanceId : '',
  };
  return {
    mstrData,
    reusePromptAnswers,
    previousPromptsAnswers: answers,
    promptObjects,
    dossierOpenRequested,
    isPrompted,
    repromptsQueue: { ...repromptsQueueReducer },
    isMultipleRepromptWithReuse,
    isReprompt,
  };
};

export const EmbeddedDossier = connect(mapStateToProps)(EmbeddedDossierNotConnected);
