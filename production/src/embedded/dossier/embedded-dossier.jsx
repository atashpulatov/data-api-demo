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

import {
  prepareGivenPromptAnswers,
  preparePromptedDossier,
  mergeAnswersWithPromptsDefined,
  ObjectExecutionStatus
} from '../../helpers/prompts-handling-helper';

const { microstrategy, Office } = window;

const { createDossierInstance, rePromptDossier } = mstrObjectRestService;

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

    this.dossierData = {
      ...this.dossierData,
      chapterKey: payloadChapterKey,
      visualizationKey: payloadVisKey
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
   * @returns
   */
  handleInstanceId = async (instanceId, projectId, dossierId, isPrompted) => {
    if (instanceId) {
      return { mid: instanceId, status: ObjectExecutionStatus.READY };
    }

    // Create a new instance of the Dossier using shortcut.
    const body = { disableManipulationsAutoSaving: true, persistViewState: true };
    const instance = await createDossierInstance(projectId, dossierId, body);

    // Checking if the dossier is prompted and update the status accordingly
    instance.status = isPrompted ? ObjectExecutionStatus.PROMPTED : ObjectExecutionStatus.READY;

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

  loadEmbeddedDossier = async (container) => {
    const {
      mstrData,
      handleEmbeddedDossierLoad,
      reusePromptAnswers,
      previousPromptsAnswers,
      dossierOpenRequested,
      promptObjects,
      isPrompted,
      isMultipleReprompt,
    } = this.props;
    const {
      envUrl, authToken, dossierId, projectId, promptsAnswers,
      instanceId, selectedViz, visualizationInfo
    } = mstrData;
    let instance = {};
    try {
      // Create instance and handle it different if it is prompted or multiple reprompt is triggered.
      instance = await this.handleInstanceId(instanceId, projectId, dossierId, isPrompted || isMultipleReprompt);

      // Declared variables to determine whether importing a report/dossier is taking place and
      // whether there are previous prompt answers to handle
      const isImportedObjectPrompted = promptObjects?.length > 0;
      const handlePreviousAnswersAtImport = dossierOpenRequested && reusePromptAnswers
        && previousPromptsAnswers?.length > 0 && isImportedObjectPrompted;

      // Update givenPromptsAnswers collection with previous prompt answers if importing a report/dossier
      // or when multiple reprompt is triggered, in this case, use mstrData's (edited object) prompts answers.
      const givenPromptsAnswers = handlePreviousAnswersAtImport || isMultipleReprompt
        ? prepareGivenPromptAnswers(isMultipleReprompt ? mstrData.promptsAnswers.answers : promptObjects,
          previousPromptsAnswers) : { ...promptsAnswers };

      instance = await this.prepareAndHandlePromptAnswers(instance, dossierId, projectId, givenPromptsAnswers);

      // Open Prompts' dialog if there are prompts to answer when importing a report/dossier or when
      // multiple reprompt is triggered; 'reusePromptAnswers' needs to be true for both cases.
      if (reusePromptAnswers && ((dossierOpenRequested && isImportedObjectPrompted) || isMultipleReprompt)) {
        // Re-prompt the Dossier's instance to show the prompts dialog.
        const resp = await rePromptDossier(
          dossierId,
          instance.mid,
          projectId
        );

        instance.mid = resp.mid;
      }
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
        gotoLibrary: false,
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
        this.msgRouter.registerEventHandler(EventType.ON_DOSSIER_INSTANCE_ID_CHANGE, (selectedInstanceId) => {
          // Need to make sure that the instanceId is not null before calling the handler
          selectedInstanceId && this.instanceIdChangeHandler(selectedInstanceId);
        });
        this.msgRouter.registerEventHandler(EventType.ON_ERROR, this.onEmbeddedError);
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
    promptsAnswers.answers = this.combineArraysByObjectKey(tempAnswers, promptsAnswers.answers);

    // Proceed with merging answers with prompts defined if there are prompts to answer.
    await mergeAnswersWithPromptsDefined(mstrData.dossierId, mstrData.projectId, this.dossierData.instanceId, promptsAnswers.answers, false);

    this.dossierData.promptsAnswers = promptsAnswers;
    handlePromptAnswer(promptsAnswers);

    if (this.embeddedDossier) {
      const payload = await this.embeddedDossier.getSelectedVizKeys();
      if (Object.keys(payload).length > 0) {
        this.onVizSelectionHandler(payload);
      }
    }
  }

  /**
   * Have 2 arrays, A and B, that needs to be combined; however, if there are items in B that
   * are also in A, then I want items from B to replace the ones in A.
   * @param {*} A
   * @param {*} B
   * @returns consolidated array
   */
  combineArraysByObjectKey(A, B) {
    // Create a Map to store objects from array A with keys as the map keys
    const combinedMap = new Map(A.map(obj => [obj.key, obj]));

    // Iterate through array B
    for (const objB of B) {
      // Use the key attribute to check if the object exists in the Map
      const keyB = objB.key;

      if (combinedMap.has(keyB)) {
        // If the object with the same key exists in A, replace it with the object from B
        combinedMap.set(keyB, objB);
      } else {
        // If the object doesn't exist in A, add it to the Map
        combinedMap.set(keyB, objB);
      }
    }

    // Convert the Map values back to an array
    const combinedArray = Array.from(combinedMap.values());

    return combinedArray;
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
  isMultipleReprompt: PropTypes.bool,
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
  isMultipleReprompt: false,
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
  const isMultipleReprompt = repromptsQueueReducer.total > 1;

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
    instanceId: !isMultipleReprompt ? editedObject.instanceId : '',
  };
  return {
    mstrData,
    reusePromptAnswers,
    previousPromptsAnswers: answers,
    promptObjects,
    dossierOpenRequested,
    isPrompted,
    repromptsQueue: { ...repromptsQueueReducer },
    isMultipleReprompt,
  };
};

export const EmbeddedDossier = connect(mapStateToProps)(EmbeddedDossierNotConnected);
